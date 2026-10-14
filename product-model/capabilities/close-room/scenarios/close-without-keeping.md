---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host chooses Close the room, unticks Archive this quiz's results, and confirms",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "PIN"
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
      "text": "The Product ends the game and closes the room, keeping nothing of the quiz",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "game",
          "effect": "changes",
          "from": "Podium",
          "to": "Ended",
          "facts": []
        },
        {
          "entity": "room",
          "effect": "changes",
          "from": "Open",
          "to": "Closed",
          "facts": []
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

# Close the room without keeping the results

## Trigger

A rehearsal, or results nobody needs.

## Outcome

The room is closed and History is unchanged.
