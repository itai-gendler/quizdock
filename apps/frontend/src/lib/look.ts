import {
  DEFAULT_LOOK,
  type InterfaceLook,
  LOOK_RADII,
  isShippedPicture,
  linkOnDark,
  shippedPictureUrl,
} from '@quiz-dock/contracts';
import type { CSSProperties } from 'react';
import { appConfig } from '../config';
import { loadFont } from '../game/theme';
import { mediaUrl } from './media-url';

/** The look as `/config.js` gives it: files by URL, the link colour on the dark page. */
export interface ResolvedLook extends InterfaceLook {
  linkDark: string;
  fontUrl: string | null;
  pictureUrl: string | null;
}

/** A look being edited, as a page would get it from `/config.js`. */
export function resolveLook(look: InterfaceLook): ResolvedLook {
  const image = look.showcase.picture?.image;
  return {
    ...look,
    linkDark: linkOnDark(look.accent),
    fontUrl: 'file' in look.font ? mediaUrl(look.font.file) : null,
    pictureUrl: !image
      ? null
      : isShippedPicture(image)
        ? shippedPictureUrl(image)
        : mediaUrl(image),
  };
}

/** The instance's look (THEMING lot 2): QuizDock's own until an administrator sets one. */
export const instanceLook: ResolvedLook = appConfig.look ?? resolveLook(DEFAULT_LOOK);

/**
 * The tokens a look sets: the main colour under white text, in both modes; links in the
 * accent, lightened on the dark page; the corners; the font (its faces loaded).
 */
export function lookVars(look: ResolvedLook, dark = false): CSSProperties {
  const font = loadFont(
    'file' in look.font && look.fontUrl ? { ...look.font, file: look.fontUrl } : look.font,
  );
  return {
    '--primary': look.primary,
    '--primary-foreground': '#ffffff',
    '--ring': look.primary,
    '--link': dark ? look.linkDark : look.accent,
    '--radius': `${LOOK_RADII[look.radius]}rem`,
    ...(font ? { '--font-sans': font } : {}),
  } as CSSProperties;
}

/** Dresses the whole document, before the first render. */
export function applyLook(look: ResolvedLook = instanceLook): void {
  const root = document.documentElement.style;
  for (const [name, value] of Object.entries(lookVars(look))) root.setProperty(name, String(value));
}
