---
{
  "availability": [
    {
      "place": "quizdock-web::workspace"
    }
  ],
  "domain": "sessions",
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/history-page.tsx"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/sessions-page.tsx"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/quizzes/quizzes.service.ts"
    }
  ]
}
---

# Browse sessions

A host goes through what they played: room by room, or one quiz's sessions. An administrator reads every host's.
