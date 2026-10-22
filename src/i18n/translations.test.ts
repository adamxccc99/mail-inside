import test from 'node:test';
import assert from 'node:assert/strict';
import { translations, type Language } from './translations.ts';

test('translations has complete dictionary coverage for all 4 languages', () => {
  const languages: Language[] = ['en', 'ar', 'es', 'pt'];
  const englishKeys = Object.keys(translations.en) as Array<keyof typeof translations.en>;

  assert.ok(englishKeys.length > 30, 'English dictionary must have comprehensive keys');

  for (const lang of languages) {
    const langDict = translations[lang];
    assert.ok(langDict, `Dictionary for ${lang} must exist`);

    for (const key of englishKeys) {
      assert.ok(
        typeof langDict[key] === 'string' && langDict[key].trim().length > 0,
        `Key "${key}" in language "${lang}" must exist and not be empty`
      );
    }
  }
});

test('Arabic translation contains proper Arabic brand and headline', () => {
  assert.equal(translations.ar.brandName, 'ايميل مؤقت');
  assert.ok(translations.ar.heroHeadline.includes('ايميل مؤقت'));
});
