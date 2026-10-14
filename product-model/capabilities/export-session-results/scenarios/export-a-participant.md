---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host chooses Export (CSV) on a participant's sheet",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "participant-result",
          "effect": "reads",
          "facts": [
            "Nickname"
          ]
        },
        {
          "entity": "participant",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::participant-sheet"
        }
      }
    },
    {
      "text": "The Product downloads each question with their answer, whether it was right, its points and time",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "answer",
          "effect": "reads",
          "facts": [
            "Value",
            "Correct",
            "Points awarded",
            "Response time"
          ]
        },
        {
          "entity": "question",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::participant-sheet"
        }
      }
    }
  ]
}
---

# Export a participant's answers

## Trigger

A host files one participant's answers.

## Outcome

They have that participant's sheet as a spreadsheet.
