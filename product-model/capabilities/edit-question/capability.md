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
      "title": "update"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "packages/contracts/src/question-content.ts"
    }
  ]
}
---

# Edit a question

The owner changes a question: its prompt and media, its answer choices or accepted answers, its timing, points and scoring rule, its explanation and background.
