---
{
  "entities": [
    {
      "entity": "quiz",
      "shows": [
        "Title"
      ]
    },
    {
      "entity": "session",
      "shows": [
        "Started",
        "PIN",
        "Participant count",
        "Success rate",
        "Personalised tracking",
        "Full answer capture"
      ]
    }
  ],
  "entryPoints": [
    {
      "quizdock-web": "/quizzes/:quizId/history"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/sessions-page.tsx",
      "title": "SessionsPage"
    }
  ]
}
---

# Session history

The kept sessions of one quiz, latest first.
