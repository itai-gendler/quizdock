---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Administrator chooses Hand over on a quiz and picks its new owner",
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
      "text": "The Product makes that account the quiz's owner, with its media and history",
      "kind": "product",
      "actor": "administrator",
      "entities": [
        {
          "entity": "quiz",
          "effect": "changes",
          "facts": [
            "Owner"
          ]
        },
        {
          "entity": "account",
          "effect": "reads",
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

# Hand a quiz over

## Trigger

A quiz's owner left, or the quiz belongs to someone else now.

## Outcome

The new owner finds it in My quizzes with its sessions in History.
