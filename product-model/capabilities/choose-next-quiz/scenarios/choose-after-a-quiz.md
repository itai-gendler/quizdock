---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The room is back in its lobby with no quiz picked",
      "kind": "condition",
      "entities": [
        {
          "entity": "game",
          "effect": "reads",
          "as": "current",
          "facts": []
        },
        {
          "entity": "quiz",
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
      },
      "actor": "host"
    },
    {
      "text": "The Host picks a quiz in the room's picker",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": [
            "Title",
            "Question count",
            "Owner"
          ]
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
    },
    {
      "text": "The Product opens it in the lobby, players at zero, and starts its 30-second countdown",
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
            "Keeps results",
            "Starts on its own at"
          ]
        },
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": []
        },
        {
          "entity": "player",
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

# Choose the quiz after another

## Trigger

A quiz is over and the room stays together for another.

## Outcome

Every screen shows the quiz coming; it starts after 30 seconds, once everyone is ready, or when the host starts it.

## Edge cases

- The picker marks the quizzes already played in this room and the ones other hosts share, which keep nothing.
- A quiz of the room's selection keeps the pace the selection gives it.
