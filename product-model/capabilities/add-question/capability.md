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
      "target": "apps/backend/src/questions/questions.service.ts",
      "title": "add"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/question-form.tsx"
    }
  ]
}
---

# Add a question

The owner adds a question of a chosen type at the end of the quiz.
