---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "selection",
      "facts": [
        "Quizzes"
      ]
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/selections/selection-access.ts",
      "title": "SELECTION_ITEMS_MAX"
    }
  ]
}
---

# A selection holds at most 50 quizzes, each once

A selection lists at most 50 quizzes and each quiz once; its name holds 60 characters and its description 2,000. A quiz deleted leaves every selection.
