---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host chooses Delete quiz and confirms",
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
      "text": "The Product deletes the quiz with its questions, slides, reviews and kept sessions",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "quiz",
          "effect": "removes",
          "from": "Draft"
        },
        {
          "entity": "question",
          "effect": "removes",
          "with": "quiz"
        },
        {
          "entity": "slide",
          "effect": "removes",
          "with": "quiz"
        },
        {
          "entity": "review",
          "effect": "removes",
          "with": "quiz"
        },
        {
          "entity": "session",
          "effect": "removes",
          "from": "Ended",
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

# Delete a quiz

## Trigger

A quiz is no longer wanted at all.

## Outcome

It is gone from every list, its results gone from History; its media go too unless another quiz uses them, and selections drop it.

## Edge cases

- Copies other hosts made of it stay theirs.
