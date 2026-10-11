import { mediaHeaders } from './media-response';

describe('mediaHeaders', () => {
  it('serves a recognised type as itself, sandboxed', () => {
    expect(mediaHeaders('audio/mp4')).toEqual({
      'Content-Type': 'audio/mp4',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; sandbox",
    });
  });

  it('serves anything else as a download', () => {
    for (const mime of ['image/svg+xml', 'text/html', undefined]) {
      expect(mediaHeaders(mime)).toMatchObject({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment',
      });
    }
  });

  it('serves an SVG or a font only from the icon or font row of a theme', () => {
    expect(mediaHeaders('image/svg+xml', 'icon')['Content-Type']).toBe('image/svg+xml');
    expect(mediaHeaders('font/woff2', 'font')['Content-Type']).toBe('font/woff2');
    expect(mediaHeaders('image/svg+xml', 'image')['Content-Type']).toBe('application/octet-stream');
    expect(mediaHeaders('image/svg+xml', 'font')['Content-Type']).toBe('application/octet-stream');
  });
});
