---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "quiz",
      "effect": "removes"
    }
  ],
  "permits": [
    {
      "related": [
        {
          "verb": "owns",
          "entity": "host"
        }
      ]
    },
    {
      "actors": [
        "administrator"
      ]
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/quizzes/quizzes.service.ts"
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

# Its owner or an administrator deletes a quiz

A host deletes their own quizzes; an administrator deletes any quiz of the instance.
