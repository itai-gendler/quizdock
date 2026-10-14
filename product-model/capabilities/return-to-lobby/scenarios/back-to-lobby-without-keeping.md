---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The quiz is at its podium",
      "kind": "condition",
      "entities": [
        {
          "entity": "game",
          "effect": "reads",
          "as": "current",
          "facts": [
            "Current step"
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
      "text": "The Host unticks Archive this quiz's results and goes back to the lobby",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "Name"
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
      }
    },
    {
      "text": "The Product opens the lobby and keeps nothing of the quiz in History",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "game",
          "effect": "changes",
          "as": "current",
          "from": "Podium",
          "to": "Ended",
          "facts": []
        },
        {
          "entity": "game",
          "effect": "creates",
          "as": "next",
          "to": "Lobby",
          "facts": [
            "Pace"
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
      }
    }
  ]
}
---

# Back to the lobby without keeping the results

## Trigger

A warm-up quiz.

## Outcome

The quiz still counts in the room's live standings, which are not kept.
