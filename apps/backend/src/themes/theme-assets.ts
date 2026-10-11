import { BadRequestException } from '@nestjs/common';
import { XMLParser, XMLValidator } from 'fast-xml-parser';

/**
 * A theme's own files (THEMING §2.2, §1.3): its answer icons, monochrome SVG, and its
 * font, woff2. Neither is a media the library takes: they are checked here, an icon
 * rebuilt from an allowlist, before being stored.
 */

export const ICON_MAX_BYTES = 64 * 1024;
export const FONT_MAX_BYTES = 2 * 1024 * 1024;

const NUMBER = /^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?(px)?$/i;
const UNIT = /^(0(\.\d+)?|1(\.0+)?|\.\d+)$/;
const RULE = /^(nonzero|evenodd)$/;

/** The attributes an icon keeps, each with the values it may take. */
const ATTRIBUTES: Record<string, RegExp> = {
  d: /^[MmZzLlHhVvCcSsQqTtAa0-9eE.,+\-\s]*$/,
  points: /^[0-9eE.,+\-\s]*$/,
  transform: /^(\s*(matrix|translate|scale|rotate|skewX|skewY)\s*\([0-9eE.,+\-\s]*\)\s*,?)*\s*$/,
  'fill-rule': RULE,
  'clip-rule': RULE,
  opacity: UNIT,
  'fill-opacity': UNIT,
  cx: NUMBER,
  cy: NUMBER,
  r: NUMBER,
  rx: NUMBER,
  ry: NUMBER,
  x: NUMBER,
  y: NUMBER,
  width: NUMBER,
  height: NUMBER,
};

const SHAPES = new Set(['path', 'circle', 'ellipse', 'rect', 'polygon', 'polyline']);
const STROKE = /^stroke(-|$)/;
const MAX_DEPTH = 16;
const MAX_NODES = 2000;

type XmlNode = Record<string, unknown> & { ':@'?: Record<string, string> };

export interface SanitisedIcon {
  svg: string;
  /** The file drew with strokes, which an icon filled by its colour cannot keep. */
  strokeRemoved: boolean;
}

const invalid = () => new BadRequestException('theme.icon_invalid');

/**
 * Rebuilds an icon from what an allowlist keeps: shapes and groups, their geometry,
 * `fill` forced to `currentColor` (the slot's colour comes from CSS). Scripts, styles,
 * links, references and anything unknown are dropped; a `stroke` is reported.
 */
export function sanitiseIcon(bytes: Buffer): SanitisedIcon {
  if (bytes.length > ICON_MAX_BYTES) {
    throw new BadRequestException({
      code: 'theme.icon_too_large',
      params: { maxKb: ICON_MAX_BYTES / 1024 },
    });
  }
  const text = bytes.toString('utf8');
  if (/<!(DOCTYPE|ENTITY)/i.test(text) || XMLValidator.validate(text) !== true) throw invalid();
  const tree = new XMLParser({
    preserveOrder: true,
    ignoreAttributes: false,
    attributeNamePrefix: '',
    processEntities: false,
    ignoreDeclaration: true,
    ignorePiTags: true,
    parseAttributeValue: false,
    trimValues: true,
  }).parse(text) as XmlNode[];
  const root = tree.find((n) => 'svg' in n);
  if (!root) throw invalid();

  const box = viewBoxOf(root[':@'] ?? {});
  if (!box) throw invalid();
  if (Math.abs(box[2] - box[3]) > 1e-6) throw new BadRequestException('theme.icon_not_square');

  let strokeRemoved = false;
  let nodes = 0;
  let shapes = 0;
  const walk = (children: XmlNode[], depth: number): string => {
    if (depth > MAX_DEPTH) throw invalid();
    let out = '';
    for (const node of children) {
      if (++nodes > MAX_NODES) throw invalid();
      const tag = Object.keys(node).find((k) => k !== ':@');
      if (!tag || tag === '#text') continue;
      const attrs = node[':@'] ?? {};
      if (Object.keys(attrs).some((a) => STROKE.test(a)) || /stroke/i.test(attrs.style ?? '')) {
        strokeRemoved = true;
      }
      if (tag === 'g') {
        const inner = walk(node[tag] as XmlNode[], depth + 1);
        if (inner) out += `<g${attributes(attrs)}>${inner}</g>`;
      } else if (SHAPES.has(tag)) {
        shapes++;
        out += `<${tag}${attributes(attrs)}/>`;
      }
    }
    return out;
  };
  const body = walk(root.svg as XmlNode[], 0);
  if (!shapes) throw new BadRequestException('theme.icon_empty');
  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box.join(' ')}" fill="currentColor">${body}</svg>`,
    strokeRemoved,
  };
}

function viewBoxOf(attrs: Record<string, string>): number[] | null {
  if (attrs.viewBox) {
    const box = attrs.viewBox
      .trim()
      .split(/[\s,]+/)
      .map(Number);
    return box.length === 4 && box.every(Number.isFinite) && box[2] > 0 && box[3] > 0 ? box : null;
  }
  const [w, h] = [parseFloat(attrs.width), parseFloat(attrs.height)];
  return w > 0 && h > 0 ? [0, 0, w, h] : null;
}

/** The kept attributes; `fill` only as `none`, to keep a shape's hole. */
function attributes(attrs: Record<string, string>): string {
  let out = '';
  for (const [name, value] of Object.entries(attrs)) {
    if (name === 'fill' && value.trim() === 'none') out += ' fill="none"';
    else if (ATTRIBUTES[name]?.test(value)) out += ` ${name}="${value.trim()}"`;
  }
  return out;
}

/** Checks a font is a whole woff2 file: its signature and the length it declares. */
export function checkFont(bytes: Buffer): void {
  if (bytes.length > FONT_MAX_BYTES) {
    throw new BadRequestException({
      code: 'theme.font_too_large',
      params: { maxMb: FONT_MAX_BYTES / (1024 * 1024) },
    });
  }
  if (
    bytes.length < 48 ||
    bytes.toString('latin1', 0, 4) !== 'wOF2' ||
    bytes.readUInt32BE(8) !== bytes.length
  ) {
    throw new BadRequestException('theme.font_invalid');
  }
}
