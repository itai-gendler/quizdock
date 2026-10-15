---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "Every question and slide of the quiz is complete",
      "kind": "condition",
      "entities": [
        {
          "entity": "question",
          "effect": "reads",
          "facts": [
            "Prompt",
            "Answer choices"
          ]
        },
        {
          "entity": "slide",
          "effect": "reads",
          "facts": [
            "Content"
          ]
        },
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::quiz-editor"
        }
      },
      "actor": "host"
    },
    {
      "text": "The Host chooses Publish",
      "kind": "actor",
      "actor": "host",
      "entities": [
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
          "place": "quizdock-web::workspace::quiz-editor"
        }
      }
    },
    {
      "text": "The Product makes the quiz ready",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "quiz",
          "effect": "changes",
          "from": "Draft",
          "to": "Ready",
          "facts": []
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

# Publish a draft

## Trigger

A host has finished a quiz.

## Outcome

The quiz can be presented at any time.
