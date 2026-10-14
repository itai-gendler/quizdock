---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The lobby has a quiz nobody has played yet",
      "kind": "condition",
      "entities": [
        {
          "entity": "game",
          "effect": "reads",
          "as": "current",
          "facts": [
            "Quiz played"
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
          "place": "quizdock-web::workspace::console"
        }
      },
      "actor": "host"
    },
    {
      "text": "The Host chooses Change quiz and picks another",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": [
            "Title"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::console"
        }
      }
    },
    {
      "text": "The Product replaces the quiz in the lobby; participants stay in the room",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "game",
          "effect": "changes",
          "as": "current",
          "from": "Lobby",
          "to": "Ended",
          "facts": []
        },
        {
          "entity": "game",
          "effect": "creates",
          "as": "next",
          "to": "Lobby",
          "facts": [
            "Quiz played",
            "Pace",
            "Keeps results"
          ]
        },
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": []
        },
        {
          "entity": "participant",
          "effect": "reads",
          "facts": []
        },
        {
          "entity": "room",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::console"
        }
      }
    }
  ]
}
---

# Change the quiz before it starts

## Trigger

The host picked the wrong quiz, or the audience calls for another.

## Outcome

The lobby shows the new quiz.
