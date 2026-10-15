---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "quiz",
      "effect": "changes",
      "from": "Archived",
      "to": "Draft"
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
      "title": "quizzes.restore"
    }
  ]
}
---

# Its owner or an administrator restores a quiz

An archived quiz comes back as a draft of its owner, restored by them or by an administrator.
