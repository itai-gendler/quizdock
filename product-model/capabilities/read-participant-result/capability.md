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
      "target": "apps/frontend/src/routes/sessions-page.tsx",
      "title": "SessionPlayerPage"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/quizzes/quizzes.service.ts",
      "title": "sessionPlayerDetail"
    }
  ]
}
---

# Read a participant's result

A host reads one participant's result in a session and, when every answer was kept, their answer to each question.
