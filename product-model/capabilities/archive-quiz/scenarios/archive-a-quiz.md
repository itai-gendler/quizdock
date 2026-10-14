---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host chooses Archive on one of their quizzes",
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
          "place": "quizdock-web::workspace::my-quizzes"
        }
      }
    },
    {
      "text": "The Product archives it",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "quiz",
          "effect": "changes",
          "from": "Ready",
          "to": "Archived",
          "facts": []
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

# Archive a quiz

## Trigger

A quiz is obsolete but its results matter.

## Outcome

It is out of the active lists, cannot be presented, and its sessions stay in History.

## Edge cases

- A draft is archived the same way.
- Another host who had it shared no longer sees it.
