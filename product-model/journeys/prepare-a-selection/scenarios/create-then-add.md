---
{
  "kind": "primary",
  "result": "achieved",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host chooses New selection",
      "kind": "actor",
      "actor": "host",
      "capability": "create-selection",
      "entities": [
        {
          "entity": "selection",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::selections"
        }
      }
    },
    {
      "text": "The Product creates the selection and opens it",
      "kind": "product",
      "actor": "host",
      "capability": "create-selection",
      "entities": [
        {
          "entity": "selection",
          "effect": "creates",
          "facts": [
            "Name",
            "Shared"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::selection"
        }
      }
    },
    {
      "text": "The Host adds a quiz to it",
      "kind": "actor",
      "actor": "host",
      "capability": "add-quiz-to-selection",
      "entities": [
        {
          "entity": "selection",
          "effect": "changes",
          "facts": [
            "Quizzes"
          ]
        },
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": [
            "Title"
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

# Create a selection, then add a quiz

## Trigger

A host chooses New selection.

## Outcome

The host lands on the new selection and adds its first quiz.
