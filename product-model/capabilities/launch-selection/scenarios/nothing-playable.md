---
{
  "kind": "validation",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "No quiz of the selection can be played",
      "kind": "condition",
      "entities": [
        {
          "entity": "selection",
          "effect": "reads",
          "facts": [
            "Quizzes"
          ]
        },
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::selection"
        }
      },
      "actor": "host"
    },
    {
      "text": "The Host chooses Present",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "selection",
          "effect": "reads",
          "facts": [
            "Name"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::selection"
        }
      }
    },
    {
      "text": "The Product opens no room and says nothing in it can be played",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::selection"
        }
      }
    }
  ]
}
---

# A selection with nothing to play

## Trigger

Every quiz of the selection is a draft, archived or empty.

## Outcome

No room is opened.
