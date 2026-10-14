---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The lobby is counting down",
      "kind": "condition",
      "entities": [
        {
          "entity": "game",
          "effect": "reads",
          "facts": [
            "Starts on its own at"
          ]
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
      "text": "The Host stops the countdown",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "game",
          "effect": "reads",
          "facts": [
            "Starts on its own at"
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
      "text": "The Product stops it on every screen",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "game",
          "effect": "changes",
          "facts": [
            "Starts on its own at"
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

# Stop the countdown

## Trigger

The host wants to say something before the next quiz.

## Outcome

The quiz waits for Start; everyone being ready no longer starts it.
