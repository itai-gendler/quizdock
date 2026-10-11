import { describe, expect, it } from 'vitest';
import { namespaces, supportedLngs } from './index';

// Every locale file, read here directly: the app loads one language only.
const files = import.meta.glob<Record<string, unknown>>('./locales/*/*.json', {
  eager: true,
  import: 'default',
});
const resources = Object.fromEntries(
  supportedLngs.map((lang) => [
    lang,
    Object.fromEntries(namespaces.map((ns) => [ns, files[`./locales/${lang}/${ns}.json`]])),
  ]),
);

/** Flattens nested translation objects into dotted keys, recursively. */
function flatKeys(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) return [prefix];
  return Object.entries(value).flatMap(([k, v]) => flatKeys(v, prefix ? `${prefix}.${k}` : k));
}

/**
 * The keys a language needs beyond `en`'s: the plural forms English lacks,
 * beside each `X_other` — cardinal (`_few`, `_many` in Russian or Polish) and
 * ordinal (`_ordinal_many`: the 6th in Hindi, the 8th in Italian). A missing
 * form falls back to English ("6th").
 */
function pluralExtras(enKeys: string[], lang: string): string[] {
  const cardinal = new Intl.PluralRules(lang).resolvedOptions().pluralCategories;
  const ordinal = new Intl.PluralRules(lang, { type: 'ordinal' }).resolvedOptions()
    .pluralCategories;
  // French, Spanish or Italian also have a cardinal `many`, for millions only:
  // their `_other` covers it, as in every interface string.
  const extraCardinal = cardinal.includes('few')
    ? cardinal.filter((f) => f === 'few' || f === 'many')
    : [];
  const enKeySet = new Set(enKeys);
  return enKeys
    .filter((k) => k.endsWith('_other'))
    .flatMap((k) => {
      const stem = k.slice(0, -'other'.length);
      const forms = stem.endsWith('_ordinal_') ? ordinal : extraCardinal;
      return forms.map((form) => `${stem}${form}`).filter((key) => !enKeySet.has(key));
    });
}

/**
 * Every language must carry exactly the keys of `en`, namespace by namespace,
 * plus the plural forms its grammar needs: a missing key silently falls back to
 * English, an orphan one is dead weight.
 */
describe('locale key parity', () => {
  const reference = resources.en as Record<string, unknown>;

  for (const lang of supportedLngs) {
    if (lang === 'en') continue;
    it(`${lang} matches en`, () => {
      const translated = resources[lang] as Record<string, unknown>;
      const problems: string[] = [];
      for (const [ns, enDict] of Object.entries(reference)) {
        const enFlat = flatKeys(enDict);
        const enKeys = new Set([...enFlat, ...pluralExtras(enFlat, lang)]);
        const langKeys = new Set(flatKeys(translated[ns] ?? {}));
        const missing = [...enKeys].filter((k) => !langKeys.has(k));
        const extra = [...langKeys].filter((k) => !enKeys.has(k));
        if (missing.length) problems.push(`${ns}: missing ${missing.join(', ')}`);
        if (extra.length) problems.push(`${ns}: extra ${extra.join(', ')}`);
      }
      expect(problems, `${lang} differs from en:\n${problems.join('\n')}`).toEqual([]);
    });
  }
});
