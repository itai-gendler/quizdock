---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "quiz",
      "effect": "changes",
      "facts": [
        "Shared"
      ]
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

# Only its owner shares a quiz or stops sharing it

Sharing is the owner's switch; it is off for a new quiz.
