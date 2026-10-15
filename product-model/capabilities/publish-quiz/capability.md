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
      "title": "transition"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/routes/editor-page.tsx",
      "title": "onPublish"
    }
  ]
}
---

# Publish a quiz

The owner makes a draft ready to present, once every question and slide is complete.
