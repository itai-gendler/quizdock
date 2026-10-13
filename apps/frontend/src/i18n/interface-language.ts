import i18next from 'i18next';
import { useEffect, useSyncExternalStore } from 'react';
import { contentLang, loadNamespace } from './content-language';
import { namespaces, resolveLang } from './languages';

/**
 * The interface's language (#209). The instance's by default (`APP_LANG`); anyone may
 * pick their own — kept in their account when signed in, else on the device. The
 * projection speaks the room's language; a player's phone in a game too, unless its
 * player picked one. A language the app does not speak falls back to the instance's.
 */

let latest = 0;

/**
 * Switches the interface to `tag` (BCP 47) when the app speaks it, else to the instance's.
 * The last call wins: one still loading its language is dropped when another came after.
 */
export async function setInterfaceLanguage(tag: string | null): Promise<void> {
  const call = ++latest;
  const lang = (tag && contentLang(tag)) || resolveLang();
  await Promise.all(namespaces.map((ns) => loadNamespace(lang, ns)));
  if (call !== latest || i18next.language === lang) return;
  await i18next.changeLanguage(lang);
  document.documentElement.lang = lang;
}

/** The room's language on a game screen; `overridable`: a player's phone, not the projection. */
let audience: { tag: string; overridable: boolean } | null = null;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => void listeners.delete(listener);
};
const tell = (next: typeof audience) => {
  audience = next;
  for (const listener of listeners) listener();
};

/**
 * A game screen asks for the room's language while it is shown (null: not known yet).
 * `overridable`: a player's own choice comes first (their phone); the projection's never.
 */
export function useAudienceLanguage(tag: string | null | undefined, overridable = false): void {
  useEffect(() => {
    tell(tag ? { tag, overridable } : null);
    return () => tell(null);
  }, [tag, overridable]);
}

/** Applies the language: the room's on a game screen (unless a player picked theirs), else `personal`, else the instance's. */
export function useInterfaceLanguage(personal: string | null): void {
  const room = useSyncExternalStore(subscribe, () => audience);
  const wanted = room && !(room.overridable && personal) ? room.tag : personal;
  useEffect(() => {
    // A language that does not load leaves the one shown: nothing else to do.
    setInterfaceLanguage(wanted).catch(() => undefined);
  }, [wanted]);
}
