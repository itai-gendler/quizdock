---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "quiz",
      "effect": "changes",
      "from": "Ready",
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
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/quizzes/quizzes.service.ts"
    }
  ]
}
---

# Only its owner returns a ready quiz to draft

A ready quiz goes back to draft only by its owner.
