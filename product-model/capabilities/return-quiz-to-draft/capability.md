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
      "target": "apps/backend/src/quizzes/quizzes.service.ts",
      "title": "ALLOWED_TRANSITIONS"
    }
  ]
}
---

# Return a quiz to draft

The owner takes a ready quiz back to draft to rework it.
