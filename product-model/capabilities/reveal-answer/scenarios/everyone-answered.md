---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "Every connected player has answered",
      "kind": "condition",
      "unattended": true,
      "entities": [
        {
          "entity": "game",
          "effect": "reads",
          "facts": [
            "Answer count"
          ]
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
    },
    {
      "text": "The Product reveals a second later, once the last tick is heard",
      "kind": "product",
      "entities": [
        {
          "entity": "game",
          "effect": "changes",
          "from": "Question",
          "to": "Answers revealed",
          "facts": []
        },
        {
          "entity": "answer",
          "effect": "reads",
          "facts": [
            "Value",
            "Correct"
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

# Everyone answered

## Trigger

The whole room answered before the deadline.

## Outcome

The question is revealed without waiting for the clock.

## Edge cases

- Players who left are not waited for.
