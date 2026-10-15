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
      "title": "quizzes.restore"
    }
  ]
}
---

# Restore a quiz

An archived quiz comes back to its owner as a draft: by its owner, or by an administrator.
