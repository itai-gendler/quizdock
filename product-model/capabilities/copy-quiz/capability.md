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
      "target": "apps/frontend/src/routes/use-copy-quiz.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/quizzes/quizzes.service.ts",
      "title": "duplicate"
    }
  ]
}
---

# Create a quiz from a shared quiz

A host makes another host's shared quiz their own: a private draft copy, with nothing linking it to the original, opened in the editor.
