---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "selection",
      "effect": "changes"
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
      "target": "apps/backend/src/selections/selections.service.ts",
      "title": "findOwned"
    }
  ]
}
---

# Only its owner changes a selection

Its name, description, quizzes and sharing change only by its owner.
