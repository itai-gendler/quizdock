---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Administrator opens All quizzes",
      "kind": "actor",
      "actor": "administrator",
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
      "text": "The Product lists every quiz of the instance with its owner, read-only",
      "kind": "product",
      "actor": "administrator",
      "entities": [
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": [
            "Title",
            "Question count",
            "Owner",
            "Updated"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::my-quizzes"
        }
      }
    }
  ]
}
---

# An administrator browses every quiz

## Trigger

An administrator oversees the instance's content.

## Outcome

They read every quiz without being able to change or present it on that role alone.
