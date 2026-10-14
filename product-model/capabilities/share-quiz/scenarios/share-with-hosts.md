---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host turns on Share with the instance's other hosts",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": [
            "Shared"
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
      "text": "The Product shares the quiz",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "quiz",
          "effect": "changes",
          "facts": [
            "Shared"
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

# Share a quiz with the other hosts

## Trigger

A host wants colleagues to use a quiz.

## Outcome

Other hosts see it marked read-only with its owner; they may present it once it is ready.

## Edge cases

- Its ratings from other hosts' games reach the owner without the reviewers' nicknames.
