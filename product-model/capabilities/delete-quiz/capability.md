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
      "title": "remove"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/prisma/migrations/20261003120000_archive_follows_deletes/migration.sql"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/admin/operations/quizzes.operations.ts",
      "title": "quizzes.delete"
    }
  ]
}
---

# Delete a quiz

A quiz is deleted for good, with its questions, slides, reviews and the sessions History kept of it: by its owner, or by an administrator.
