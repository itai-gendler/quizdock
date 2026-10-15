---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "question",
      "effect": "changes"
    }
  ],
  "permits": [
    {
      "related": [
        {
          "verb": "contains",
          "entity": "quiz"
        },
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
      "target": "apps/backend/src/questions/questions.service.ts"
    }
  ]
}
---

# Only the quiz's owner changes its questions

A question of a quiz is changed only by the quiz's owner.
