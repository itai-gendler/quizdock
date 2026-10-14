---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "quiz",
      "effect": "changes",
      "to": "Ready"
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

# Only its owner publishes a quiz

A draft becomes ready only by its owner.
