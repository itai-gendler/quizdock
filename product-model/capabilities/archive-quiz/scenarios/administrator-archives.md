---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Administrator chooses Archive on a quiz of the instance",
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
      "text": "The Product archives it for its owner",
      "kind": "product",
      "actor": "administrator",
      "entities": [
        {
          "entity": "quiz",
          "effect": "changes",
          "from": "Draft",
          "to": "Archived",
          "facts": []
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

# An administrator archives someone's quiz

## Trigger

An administrator takes a quiz out of circulation.

## Outcome

The quiz is archived with its history; its owner can restore it.
