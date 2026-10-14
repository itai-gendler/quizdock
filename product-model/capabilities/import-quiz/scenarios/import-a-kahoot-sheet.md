---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host chooses Import and picks a Kahoot spreadsheet",
      "kind": "actor",
      "actor": "host",
      "entities": [],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::my-quizzes"
        }
      }
    },
    {
      "text": "The Product creates a draft from its rows and opens it in the editor, which says once which rows still need finishing",
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
    }
  ]
}
---

# Import a Kahoot spreadsheet

## Trigger

A host moves a quiz over from Kahoot.

## Outcome

The quiz is a draft with the rows that could not be read flagged for the host to finish.
