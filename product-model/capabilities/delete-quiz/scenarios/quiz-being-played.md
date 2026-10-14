---
{
  "kind": "validation",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "One of the owner's open rooms is playing the quiz",
      "kind": "condition",
      "entities": [
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": [
            "Title"
          ]
        },
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "PIN"
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
      "text": "The Host tries to delete the quiz",
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
      "text": "The Product refuses while the quiz is being played",
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

# A quiz being played cannot be deleted

## Trigger

A host deletes a quiz one of their rooms is playing.

## Outcome

The quiz stays; it can be deleted once the room moves on or closes.
