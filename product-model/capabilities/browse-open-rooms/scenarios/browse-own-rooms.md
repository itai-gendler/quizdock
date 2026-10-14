---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host opens Open rooms",
      "kind": "actor",
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
          "place": "quizdock-web::workspace::open-rooms"
        }
      }
    },
    {
      "text": "The Product lists their open rooms with their PIN, quiz, step and connected players",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "PIN",
            "Name"
          ]
        },
        {
          "entity": "game",
          "effect": "reads",
          "facts": [
            "Quiz played",
            "Current step"
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
          "place": "quizdock-web::workspace::open-rooms"
        }
      }
    }
  ]
}
---

# See one's open rooms

## Trigger

A host looks for a room they opened.

## Outcome

They see each open room and can go back to its console or close it.
