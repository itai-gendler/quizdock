import i18next from 'i18next';
import { type ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { contentLang, loadNamespace } from './content-language';
import { type AppLang, namespaces } from './languages';

/**
 * Draws its children in the room's language (#209) without touching the page's: the
 * console's previews of the projection and of a phone speak what the room hears, the
 * console itself its host's language. A copy of the translations, sharing their store;
 * the page's language while the room's loads, or when the app does not speak it.
 */
export function InAudienceLanguage({
  tag,
  children,
}: {
  tag: string | null | undefined;
  children: ReactNode;
}) {
  const [copy] = useState(() => i18next.cloneInstance());
  useEffect(() => {
    let current = true;
    const lang: AppLang = (tag && contentLang(tag)) || (i18next.language as AppLang);
    void Promise.all(namespaces.map((ns) => loadNamespace(lang, ns)))
      .then(() => (current ? copy.changeLanguage(lang) : undefined))
      .catch(() => undefined);
    return () => {
      current = false;
    };
  }, [tag, copy]);
  return <I18nextProvider i18n={copy}>{children}</I18nextProvider>;
}
