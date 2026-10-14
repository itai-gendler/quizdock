---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "quiz",
      "effect": "changes",
      "facts": [
        "Owner"
      ]
    }
  ],
  "permits": [
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
      "target": "apps/backend/src/admin/operations/cli-commands.operations.ts",
      "title": "quizzes.transfer"
    }
  ]
}
---

# Only an administrator hands a quiz over

A quiz changes owner only through the administration; its media used by it alone and its history follow it.
