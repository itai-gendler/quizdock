---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host opens one of their rooms from Open rooms",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "PIN",
            "Name"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::open-rooms"
        }
      }
    },
    {
      "text": "The Product opens its console on the current step, with the quiz's outline and answer key",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "PIN",
            "Name",
            "Standings"
          ]
        },
        {
          "entity": "game",
          "effect": "reads",
          "facts": [
            "Quiz played",
            "Current step",
            "Pace",
            "Paused",
            "Time left"
          ]
        },
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": []
        },
        {
          "entity": "answer",
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

# Reopen a room's console

## Trigger

A host reloaded the console or moves to another device.

## Outcome

They run the room from where it stood; several consoles of the same host may be open at once.
