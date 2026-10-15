---
{
  "availability": [
    {
      "place": "quizdock-web::workspace"
    }
  ],
  "domain": "my-quizzes",
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/dashboard-page.tsx",
      "title": "onCreate"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/quiz-starter.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/quizzes/quizzes.service.ts"
    }
  ]
}
---

# Create a quiz

A host starts a new quiz: a draft in the instance's language with an intro slide and a first question to complete, opened in the editor.
