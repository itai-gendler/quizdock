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
      "title": "SessionDetailPage"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/quizzes/quizzes.service.ts",
      "title": "sessionDetail"
    }
  ]
}
---

# Read a session

A host reads one kept session: its figures, the results by question and each participant's result, and the room it was played in.
