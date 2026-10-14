---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host adds a question and picks its type",
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
          "entity": "question",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::quiz-editor"
        }
      }
    },
    {
      "text": "The Product adds it after the last question, with a 20-second time limit and standard points",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "question",
          "effect": "creates",
          "facts": [
            "Type",
            "Prompt",
            "Answer choices",
            "Time limit",
            "Points",
            "Scoring rule",
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

# Add a question

## Trigger

A host writes another question.

## Outcome

The question is in the quiz, ready to be completed.
