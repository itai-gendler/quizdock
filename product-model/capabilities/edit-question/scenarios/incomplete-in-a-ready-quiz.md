---
{
  "kind": "validation",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The quiz is Ready and the question as edited misses something to be played",
      "kind": "condition",
      "entities": [
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": []
        },
        {
          "entity": "question",
          "effect": "reads",
          "facts": [
            "Prompt",
            "Answer choices",
            "Accepted answers",
            "Target number"
          ]
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
      "text": "The Host saves the question",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "question",
          "effect": "reads",
          "facts": [
            "Prompt"
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
      "text": "The Product refuses it, says what is missing, and offers to return the quiz to draft",
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

# An incomplete question in a ready quiz

## Trigger

A host empties a question of a quiz that can be presented at any time.

## Outcome

The question keeps its last complete version until the host completes it or returns the quiz to draft.
