---
{
  "kind": "primary",
  "result": "achieved",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host chooses New quiz",
      "kind": "actor",
      "actor": "host",
      "capability": "create-quiz",
      "entities": [
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::my-quizzes"
        }
      }
    },
    {
      "text": "The Product creates a draft with an intro slide and a first question and opens it in the editor",
      "kind": "product",
      "actor": "host",
      "capability": "create-quiz",
      "entities": [
        {
          "entity": "quiz",
          "effect": "creates",
          "to": "Draft",
          "facts": [
            "Title",
            "Language",
            "Reviews enabled",
            "Sound settings",
            "Owner"
          ]
        },
        {
          "entity": "slide",
          "effect": "creates",
          "facts": [
            "Content",
            "Position"
          ],
          "with": "quiz"
        },
        {
          "entity": "question",
          "effect": "creates",
          "facts": [
            "Type",
            "Prompt",
            "Answer choices",
            "Time limit",
            "Points",
            "Position"
          ],
          "with": "quiz"
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::quiz-editor"
        }
      }
    },
    {
      "text": "The Host writes the first question and saves it",
      "kind": "actor",
      "actor": "host",
      "capability": "edit-question",
      "entities": [
        {
          "entity": "question",
          "effect": "changes",
          "facts": [
            "Prompt",
            "Answer choices"
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

# From New quiz to the first question

## Trigger

A host chooses New quiz in My quizzes.

## Outcome

The host lands in the new draft's editor and completes its first question.
