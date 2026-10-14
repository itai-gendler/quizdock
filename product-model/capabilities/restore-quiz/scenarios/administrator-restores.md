---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Administrator chooses Restore on an archived quiz",
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
      "text": "The Product returns it to its owner as a draft",
      "kind": "product",
      "actor": "administrator",
      "entities": [
        {
          "entity": "quiz",
          "effect": "changes",
          "from": "Archived",
          "to": "Draft",
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

# An administrator restores a quiz

## Trigger

An administrator undoes an archiving.

## Outcome

The quiz is a draft of its owner again.
