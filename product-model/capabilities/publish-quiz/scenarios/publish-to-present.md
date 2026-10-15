---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host chooses Publish to present on a draft in My quizzes",
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
          "place": "quizdock-web::workspace::my-quizzes"
        }
      }
    },
    {
      "text": "The Product opens the quiz in the editor and publishes it, or lists what is missing",
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

# Publish to present from My quizzes

## Trigger

A host wants to present a draft from the list.

## Outcome

The quiz is ready to present, or the host sees what to finish first.
