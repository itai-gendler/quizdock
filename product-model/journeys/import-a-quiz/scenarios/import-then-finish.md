---
{
  "kind": "primary",
  "result": "achieved",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host chooses Import and picks a file",
      "kind": "actor",
      "actor": "host",
      "capability": "import-quiz",
      "entities": [],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::my-quizzes"
        }
      }
    },
    {
      "text": "The Product creates a draft from it and opens it in the editor",
      "kind": "product",
      "actor": "host",
      "capability": "import-quiz",
      "entities": [
        {
          "entity": "quiz",
          "effect": "creates",
          "to": "Draft",
          "facts": [
            "Title",
            "Language",
            "Owner"
          ]
        },
        {
          "entity": "question",
          "effect": "creates",
          "facts": [
            "Type",
            "Prompt",
            "Answer choices",
            "Time limit",
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
      "text": "The Host completes a flagged question and saves it",
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

# Import a spreadsheet, then finish its rows

## Trigger

A host imports a file from My quizzes.

## Outcome

The host lands in the imported draft and finishes the questions the import flagged.
