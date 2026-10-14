---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The question's time is up",
      "kind": "condition",
      "unattended": true,
      "entities": [
        {
          "entity": "game",
          "effect": "reads",
          "facts": [
            "Time left"
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
      }
    },
    {
      "text": "The Product closes the answers and shows the reveal",
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

# The time is up

## Trigger

Nobody revealed before the deadline.

## Outcome

The question is revealed on every screen.
