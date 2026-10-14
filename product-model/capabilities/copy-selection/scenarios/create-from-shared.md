---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The selection is another host's and is shared",
      "kind": "condition",
      "entities": [
        {
          "entity": "selection",
          "effect": "reads",
          "as": "original",
          "facts": [
            "Shared"
          ]
        },
        {
          "entity": "host",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::selection"
        }
      },
      "actor": "host"
    },
    {
      "text": "The Host chooses Create a selection from this",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "selection",
          "effect": "reads",
          "as": "original",
          "facts": [
            "Name",
            "Quizzes"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::selection"
        }
      }
    },
    {
      "text": "The Product creates a selection of the Host's with the same name, description and the quizzes they may read, and opens it",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "selection",
          "effect": "creates",
          "as": "copy",
          "facts": [
            "Name",
            "Description",
            "Quizzes"
          ]
        },
        {
          "entity": "selection",
          "effect": "reads",
          "as": "original",
          "facts": []
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
    }
  ]
}
---

# Create a selection from a shared one

## Trigger

A host wants to adapt a colleague's selection.

## Outcome

The new selection is theirs to edit; whoever wants results keeps a copy of the quizzes they need.
