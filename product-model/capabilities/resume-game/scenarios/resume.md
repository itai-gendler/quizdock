---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host chooses Resume",
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
      "text": "The Product runs the clock again from the remaining time",
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

# Resume

## Trigger

The moment is over.

## Outcome

The question goes on with the time it had left; autoplay picks up.
