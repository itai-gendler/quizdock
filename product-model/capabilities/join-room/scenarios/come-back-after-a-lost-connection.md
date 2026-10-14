---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The player is disconnected and the room is still open",
      "kind": "condition",
      "entities": [
        {
          "entity": "player",
          "effect": "reads",
          "facts": [
            "Nickname"
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
          "place": "quizdock-web::public::participant-view"
        }
      },
      "actor": "participant"
    },
    {
      "text": "The Participant's device reconnects",
      "kind": "actor",
      "actor": "participant",
      "entities": [
        {
          "entity": "player",
          "effect": "reads",
          "facts": [
            "Nickname"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::public::participant-view"
        }
      }
    },
    {
      "text": "The Product puts them back in their place with their score, on the step being played",
      "kind": "product",
      "actor": "participant",
      "entities": [
        {
          "entity": "player",
          "effect": "changes",
          "from": "Disconnected",
          "to": "Connected",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::public::participant-view"
        }
      }
    }
  ]
}
---

# Come back after a lost connection

## Trigger

A phone lost its network or the page reloaded.

## Outcome

They play on as before; a question they had not answered is still open to them if its time runs.
