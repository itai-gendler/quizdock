---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Administrator chooses Delete on a quiz of the instance and confirms what goes with it",
      "kind": "actor",
      "actor": "administrator",
      "entities": [
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": [
            "Title",
            "Owner"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::administration::instance-quizzes"
        }
      }
    },
    {
      "text": "The Product deletes the quiz with its questions, slides, reviews and kept sessions",
      "kind": "product",
      "actor": "administrator",
      "entities": [
        {
          "entity": "quiz",
          "effect": "removes",
          "from": "Archived"
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
          "from": "Interrupted",
          "with": "quiz"
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::administration::instance-quizzes"
        }
      }
    }
  ]
}
---

# An administrator deletes a quiz

## Trigger

An administrator removes a quiz from the instance.

## Outcome

The quiz and its history are gone; the confirmation names the quiz and its owner and advises exporting it first.
