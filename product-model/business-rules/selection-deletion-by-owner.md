---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "selection",
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
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/selections/selections.service.ts",
      "title": "remove"
    }
  ]
}
---

# Only its owner deletes a selection

Deleting a selection is its owner's.
