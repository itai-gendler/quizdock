---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host renames the selection, describes it, reorders its quizzes or sets a quiz's pace and autostart",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "selection",
          "effect": "reads",
          "facts": [
            "Name",
            "Description",
            "Quizzes"
          ]
        },
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::selection"
        }
      }
    },
    {
      "text": "The Product saves the selection",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "selection",
          "effect": "changes",
          "facts": [
            "Name",
            "Description",
            "Quizzes"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::selection"
        }
      }
    }
  ]
}
---

# Edit a selection

## Trigger

A host adjusts a selection.

## Outcome

The next launch plays the quizzes in the new order and at their pace.

## Edge cases

- A quiz the owner may read but not play — a draft, archived or empty — shows greyed with why.
- A quiz of another host no longer shared stays in its place, unseen, and comes back if shared again.
