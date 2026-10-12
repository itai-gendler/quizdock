/**
 * Colour arithmetic for the themes' accessibility checks (docs/themes.md): WCAG contrast,
 * OKLab distance, colour-blindness simulation. Colours are `#rrggbb`; blends happen in
 * sRGB space, as the browser composites them.
 */

/** An sRGB colour, each channel in 0–1. */
export type Rgb = readonly [number, number, number];

export const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

export function parseHex(hex: string): Rgb {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function toHex(c: Rgb): string {
  return (
    '#' +
    c
      .map((v) =>
        Math.round(Math.min(1, Math.max(0, v)) * 255)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
}

const toLinear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const toGamma = (v: number) => (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055);

/** WCAG relative luminance. */
export function luminance(c: Rgb): number {
  const [r, g, b] = c.map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two luminances, 1–21. */
export function contrastOfLuminances(a: number, b: number): number {
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

export function contrast(a: Rgb, b: Rgb): number {
  return contrastOfLuminances(luminance(a), luminance(b));
}

/** `top` laid over `bottom` at `alpha`. */
export function blend(top: Rgb, bottom: Rgb, alpha: number): Rgb {
  return [0, 1, 2].map((i) => top[i] * alpha + bottom[i] * (1 - alpha)) as unknown as Rgb;
}

export const WHITE: Rgb = [1, 1, 1];
export const BLACK: Rgb = [0, 0, 0];

/** The text colour that reads best on `background`: white or black (docs/themes.md, level 2). */
export function textOn(background: Rgb): Rgb {
  return contrast(WHITE, background) >= contrast(BLACK, background) ? WHITE : BLACK;
}

/** OKLab coordinates (Björn Ottosson). */
export function oklab(c: Rgb): Rgb {
  const [r, g, b] = c.map(toLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

/** Euclidean distance in OKLab: about 0.02 is a just-noticeable difference. */
export function distance(a: Rgb, b: Rgb): number {
  const [x, y] = [oklab(a), oklab(b)];
  return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
}

export type ColorVision = 'protanopia' | 'deuteranopia' | 'tritanopia';
export const COLOR_VISIONS: readonly ColorVision[] = ['protanopia', 'deuteranopia', 'tritanopia'];

/** Machado, Oliveira & Fernandes (2009), severity 1, on linear RGB. */
const CVD: Record<ColorVision, readonly number[]> = {
  protanopia: [
    0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882, -0.048116, 1.051998,
  ],
  deuteranopia: [
    0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.01182, 0.04294, 0.968881,
  ],
  tritanopia: [
    1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733, 0.691367, 0.3039,
  ],
};

/** How `c` looks to someone with that colour vision. */
export function simulate(c: Rgb, vision: ColorVision): Rgb {
  const m = CVD[vision];
  const [r, g, b] = c.map(toLinear);
  return [0, 1, 2].map((i) =>
    toGamma(Math.min(1, Math.max(0, m[i * 3] * r + m[i * 3 + 1] * g + m[i * 3 + 2] * b))),
  ) as unknown as Rgb;
}

/** OKLCH (lightness 0–1, chroma, hue in degrees) of a colour. */
export function oklch(c: Rgb): [number, number, number] {
  const [L, a, b] = oklab(c);
  return [L, Math.hypot(a, b), ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360];
}

/** The sRGB colour of an OKLCH one, clipped into the gamut. */
export function fromOklch([L, C, h]: readonly [number, number, number]): Rgb {
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => Math.min(1, Math.max(0, toGamma(Math.min(1, Math.max(0, v)))))) as unknown as Rgb;
}
