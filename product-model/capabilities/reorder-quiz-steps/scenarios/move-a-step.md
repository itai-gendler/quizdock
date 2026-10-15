---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host moves a question or a slide to another place in the sequence",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "question",
          "effect": "reads",
          "facts": [
            "Position"
          ]
        },
        {
          "entity": "slide",
          "effect": "reads",
          "facts": [
            "Position"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::quiz-editor"
        }
      }
    },
    {
      "text": "The Product renumbers the questions and places each slide before the question that now follows it",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "question",
          "effect": "changes",
          "facts": [
            "Position"
          ]
        },
        {
          "entity": "slide",
          "effect": "changes",
          "facts": [
            "Position"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::quiz-editor"
        }
      }
    }
  ]
}
---

# Move a step

## Trigger

A host changes the order of the quiz.

## Outcome

The quiz plays in the new order.
