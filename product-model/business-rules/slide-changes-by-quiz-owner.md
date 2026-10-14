---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "slide",
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
      "target": "apps/backend/src/slides/slides.service.ts"
    }
  ]
}
---

# Only the quiz's owner changes its slides

A slide of a quiz is changed only by the quiz's owner.
