---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "A question is on screen",
      "kind": "condition",
      "entities": [
        {
          "entity": "game",
          "effect": "reads",
          "facts": [
            "Current step"
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
          "place": "quizdock-web::workspace::console"
        }
      },
      "actor": "host"
    },
    {
      "text": "The Host chooses Pause",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "game",
          "effect": "reads",
          "facts": [
            "Paused"
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
      "text": "The Product freezes the clock with its remaining time and every screen shows the pause",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "game",
          "effect": "changes",
          "facts": [
            "Paused",
            "Time left"
          ]
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

# Pause

## Trigger

The host needs a moment.

## Outcome

Nothing moves until the host resumes.
