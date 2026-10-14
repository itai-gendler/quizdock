---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host chooses Remove from the selection on a quiz",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": [
            "Title"
          ]
        },
        {
          "entity": "selection",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::selection"
        }
      }
    },
    {
      "text": "The Product takes it off the list",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "selection",
          "effect": "changes",
          "facts": [
            "Quizzes"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::selection"
        }
      }
    }
  ]
}
---

# Remove a quiz

## Trigger

A quiz no longer fits the selection.

## Outcome

The quiz is off the selection; the quiz itself is untouched.
