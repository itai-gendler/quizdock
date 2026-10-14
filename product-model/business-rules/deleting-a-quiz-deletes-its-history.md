---
{
  "appliesTo": [
    {
      "type": "capability",
      "id": "delete-quiz"
    },
    {
      "type": "entity",
      "id": "session"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/prisma/migrations/20261003120000_archive_follows_deletes/migration.sql"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/quizzes/quizzes.service.ts"
    }
  ]
}
---

# Deleting a quiz deletes its kept sessions

A quiz takes its questions, slides, reviews and the sessions History kept of it when it is deleted; its media go too unless another quiz uses them. Deleting one question leaves the sessions as they were played.
