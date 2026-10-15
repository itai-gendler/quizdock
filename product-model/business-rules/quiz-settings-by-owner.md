---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "quiz",
      "effect": "changes",
      "facts": [
        "Title",
        "Description",
        "Language",
        "Cover",
        "Tags",
        "Licence",
        "Reviews enabled",
        "Sound settings",
        "Theme"
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

# Only its owner edits a quiz

A quiz's settings change only by its owner; others read it, at most.
