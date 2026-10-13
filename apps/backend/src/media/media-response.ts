/**
 * The types a media is served as: the ones the upload recognises from the bytes
 * (`sniffMedia` in contracts). A row stored under another type (before uploads
 * were checked, an SVG could be one) is served as a download, never as a page.
 */
const SERVED_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/avif',
  'video/mp4',
  'audio/mpeg',
  'audio/mp4',
]);

/**
 * A quiz theme's icons and fonts (docs/themes.md): served as what they are only from
 * the rows that hold them, written by the theme upload (an SVG sanitised there).
 */
const THEME_TYPES: Record<string, string> = { icon: 'image/svg+xml', font: 'font/woff2' };

/**
 * The headers of every media response. `nosniff` keeps the browser to the type
 * sent; the sandbox policy keeps a media opened on its own from running anything
 * on the application's origin.
 */
export function mediaHeaders(mime: string | undefined, kind?: string): Record<string, string> {
  const known =
    mime !== undefined &&
    (SERVED_TYPES.has(mime) || (kind !== undefined && THEME_TYPES[kind] === mime));
  return {
    'Content-Type': known ? mime : 'application/octet-stream',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'none'; sandbox",
    ...(known ? {} : { 'Content-Disposition': 'attachment' }),
  };
}
