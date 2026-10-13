import { checkFont, sanitiseIcon } from './theme-assets';

const svg = (body: string, attrs = 'viewBox="0 0 24 24"') =>
  Buffer.from(
    `<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" ${attrs}>${body}</svg>`,
  );
const code = (fn: () => unknown) => {
  try {
    fn();
  } catch (e) {
    const r = (e as { getResponse(): unknown }).getResponse() as {
      message?: string;
      code?: string;
    };
    return r.code ?? r.message;
  }
  return null;
};

describe('sanitiseIcon', () => {
  it('keeps the shapes, their geometry, and fills them with the slot colour', () => {
    const { svg: out, strokeRemoved } = sanitiseIcon(
      svg(
        '<g transform="translate(1 1)"><path d="M0 0L10 10Z" fill="#ff0000"/><circle cx="5" cy="5" r="2" fill="none"/></g>',
      ),
    );
    expect(out).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">' +
        '<g transform="translate(1 1)"><path d="M0 0L10 10Z"/><circle cx="5" cy="5" r="2" fill="none"/></g></svg>',
    );
    expect(strokeRemoved).toBe(false);
  });

  it('drops scripts, styles, links, references and handlers', () => {
    const { svg: out } = sanitiseIcon(
      svg(
        '<script>alert(1)</script><style>path{fill:red}</style>' +
          '<a href="javascript:alert(1)"><path d="M0 0H1"/></a>' +
          '<use href="#x"/><image href="http://evil/x.png"/><foreignObject><div/></foreignObject>' +
          '<path d="M0 0H2" onclick="alert(1)" style="fill:red" href="x"/>',
      ),
    );
    expect(out).not.toMatch(/script|style|href|onclick|image|foreign|use|<a/);
    expect(out).toContain('<path d="M0 0H2"/>');
  });

  it('refuses a value that is not plain geometry', () => {
    const { svg: out } = sanitiseIcon(
      svg('<path d="M0 0 url(x)"/><rect width="calc(1px)" x="1"/>'),
    );
    expect(out).toContain('<path/>');
    expect(out).toContain('<rect x="1"/>');
  });

  it('reports strokes, which a filled icon cannot keep', () => {
    expect(
      sanitiseIcon(svg('<path d="M0 0H1" stroke="#000" stroke-width="2"/>')).strokeRemoved,
    ).toBe(true);
    expect(sanitiseIcon(svg('<path d="M0 0H1" style="stroke:#000"/>')).strokeRemoved).toBe(true);
  });

  it('takes the size as its box when there is no viewBox', () => {
    expect(sanitiseIcon(svg('<path d="M0 0H1"/>', 'width="32" height="32"')).svg).toContain(
      'viewBox="0 0 32 32"',
    );
  });

  it('refuses what is not a square icon', () => {
    expect(code(() => sanitiseIcon(svg('<path d="M0 0H1"/>', 'viewBox="0 0 24 12"')))).toBe(
      'theme.icon_not_square',
    );
    expect(code(() => sanitiseIcon(svg('<text>A</text>')))).toBe('theme.icon_empty');
    expect(code(() => sanitiseIcon(Buffer.from('<html><body/></html>')))).toBe(
      'theme.icon_invalid',
    );
    expect(code(() => sanitiseIcon(Buffer.from('<svg viewBox="0 0 1 1"><path></svg>')))).toBe(
      'theme.icon_invalid',
    );
    expect(
      code(() =>
        sanitiseIcon(
          Buffer.from(
            '<!DOCTYPE svg [<!ENTITY x "y">]><svg viewBox="0 0 1 1"><path d="M0 0"/></svg>',
          ),
        ),
      ),
    ).toBe('theme.icon_invalid');
    expect(code(() => sanitiseIcon(Buffer.alloc(70 * 1024, 32)))).toBe('theme.icon_too_large');
  });
});

describe('checkFont', () => {
  const woff2 = (declared?: number) => {
    const b = Buffer.alloc(64);
    b.write('wOF2', 0, 'latin1');
    b.writeUInt32BE(declared ?? b.length, 8);
    return b;
  };

  it('takes a whole woff2 file', () => {
    expect(code(() => checkFont(woff2()))).toBeNull();
  });

  it('refuses another format or a cut file', () => {
    expect(
      code(() => checkFont(Buffer.from('wOFFxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'))),
    ).toBe('theme.font_invalid');
    expect(code(() => checkFont(woff2(128)))).toBe('theme.font_invalid');
  });
});
