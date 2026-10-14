---
{
  "kind": "edge",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The host's last console has been gone for five seconds",
      "kind": "condition",
      "unattended": true,
      "entities": [
        {
          "entity": "game",
          "effect": "reads",
          "facts": [
            "Current step"
          ]
        },
        {
          "entity": "host",
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
      "text": "The Product stops the clock, refuses answers, and tells the projection and the phones it waits for the host",
      "kind": "product",
      "entities": [
        {
          "entity": "game",
          "effect": "changes",
          "from": "Question",
          "to": "Waiting for the host",
          "facts": [
            "Time left"
          ]
        },
        {
          "entity": "host",
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

# The room waits for its host

## Trigger

The host's console closes or loses its connection mid-game.

## Outcome

The game stands still, scores and places kept, until the host comes back or two minutes pass.
