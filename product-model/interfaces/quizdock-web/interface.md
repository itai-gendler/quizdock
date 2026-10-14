---
{
  "type": "web",
  "actors": [
    "visitor",
    "participant",
    "host",
    "administrator"
  ],
  "entryPoints": [
    {
      "web": "/"
    },
    {
      "web": "/join"
    },
    {
      "web": "/login"
    },
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

The browser application of an instance: the pages where people sign in and join rooms from their phones, the projection a room shows on the big screen, the hosts' quizzes, consoles, selections and history, and the administration. Every screen follows the person's interface language; the projection and the phones speak the quiz's language or the room's.
