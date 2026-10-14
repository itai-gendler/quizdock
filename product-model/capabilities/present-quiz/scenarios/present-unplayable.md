---
{
  "kind": "validation",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The quiz is not ready, has no question, or is neither the host's nor shared",
      "kind": "condition",
      "entities": [
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": [
            "Owner",
            "Shared",
            "Question count"
          ]
        },
        {
          "entity": "host",
          "effect": "reads",
          "facts": []
        },
        {
          "entity": "question",
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
      "text": "The Host tries to present it",
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
      "text": "The Product opens no room and says why",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
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

# A quiz that cannot be played

## Trigger

A host tries to present a draft or an empty quiz.

## Outcome

No room is opened; a draft is offered to be published first.
