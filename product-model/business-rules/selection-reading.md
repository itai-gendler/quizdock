---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "selection",
      "effect": "reads",
      "facts": [
        "Name",
        "Description",
        "Shared",
        "Quizzes"
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
    },
    {
      "actors": [
        "host"
      ],
      "when": [
        {
          "fact": "Shared",
          "is": "On"
        }
      ]
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/selections/selection-access.ts",
      "title": "visibleSelection"
    }
  ]
}
---

# A host reads their selections and those shared with them

A host reads their own selections, and another host's while it is shared and holds a quiz they may read; of each, they see only the quizzes they may read.
