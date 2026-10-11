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

const PLURAL = /_(zero|one|two|few|many|other)$/;

/**
 * The keys a language must carry, and those it may carry, for one namespace.
 * A plural group (`X_one`, `X_other`…) needs the forms of the language's own
 * grammar — cardinal (`_few`, `_many` in Russian or Polish, `_many` for millions
 * in French, Spanish or Italian) or ordinal (`_ordinal_many`: the 6th in Hindi,
 * the 8th in Italian) — as Weblate writes them; it may keep English's others
 * (`_one` in Chinese), which i18next never picks. Anything else is `en`'s key.
 */
function expectedKeys(
  enKeys: string[],
  lang: string,
): { required: Set<string>; allowed: Set<string> } {
  const cardinal = new Intl.PluralRules(lang).resolvedOptions().pluralCategories;
  const ordinal = new Intl.PluralRules(lang, { type: 'ordinal' }).resolvedOptions()
    .pluralCategories;
  const required = new Set<string>();
  const allowed = new Set<string>(enKeys);
  for (const key of enKeys) {
    if (!PLURAL.test(key)) {
      required.add(key);
      continue;
    }
    const stem = key.replace(PLURAL, '_');
    for (const form of stem.endsWith('_ordinal_') ? ordinal : cardinal) {
      required.add(`${stem}${form}`);
      allowed.add(`${stem}${form}`);
    }
  }
  return { required, allowed };
}

/**
 * Every language must carry the keys of `en`, namespace by namespace, with the
 * plural forms of its own grammar: a missing key silently falls back to English
 * ("6th"), an orphan one is dead weight.
 */
describe('locale key parity', () => {
  const reference = resources.en as Record<string, unknown>;

  for (const lang of supportedLngs) {
    if (lang === 'en') continue;
    it(`${lang} matches en`, () => {
      const translated = resources[lang] as Record<string, unknown>;
      const problems: string[] = [];
      for (const [ns, enDict] of Object.entries(reference)) {
        const { required, allowed } = expectedKeys(flatKeys(enDict), lang);
        const langKeys = new Set(flatKeys(translated[ns] ?? {}));
        const missing = [...required].filter((k) => !langKeys.has(k));
        const extra = [...langKeys].filter((k) => !allowed.has(k));
        if (missing.length) problems.push(`${ns}: missing ${missing.join(', ')}`);
        if (extra.length) problems.push(`${ns}: extra ${extra.join(', ')}`);
      }
      expect(problems, `${lang} differs from en:\n${problems.join('\n')}`).toEqual([]);
    });
  }
});
