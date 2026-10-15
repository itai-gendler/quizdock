---
{
  "type": "web",
  "actors": [
    "participant",
    "host",
    "administrator"
  ],
  "entryPoints": [
    {
      "web": "/quizzes"
    }
  ],
  "languages": [
    "en",
    "fr",
    "es",
    "zh",
    "zh-TW",
    "tr",
    "de",
    "hi",
    "it",
    "ja",
    "pl",
    "ru"
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/router.tsx"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/i18n/languages.ts"
    }
  ]
}
---

# QuizDock web app

The browser application of an instance, where signed-in hosts build their selections, present them from the console and read their rooms in History. Every screen follows the person's interface language.
