---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host chooses New quiz",
      "kind": "actor",
      "actor": "host",
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
      "text": "The Product creates a draft owned by the Host, in the instance's language, with an intro slide and a first question to complete",
      "kind": "product",
      "actor": "host",
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
        },
        {
          "entity": "instance-settings",
          "effect": "reads",
          "facts": [
            "Instance language"
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
      "text": "The Product opens the new quiz in the editor",
      "kind": "product",
      "actor": "host",
      "entities": [
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
      }
    }
  ]
}
---

# Create a blank quiz

## Trigger

A host wants to write a quiz from scratch.

## Outcome

A new draft is in their quizzes and open in the editor.
