---
{
  "availability": [
    {
      "place": "quizdock-web::workspace"
    },
    {
      "place": "quizdock-web::administration"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/quizzes/quizzes.service.ts",
      "title": "transition"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/admin/operations/quizzes.operations.ts",
      "title": "quizzes.archive"
    }
  ]
}
---

# Archive a quiz

A quiz leaves the active lists and keeps its history: by its owner, or by an administrator for any quiz.
