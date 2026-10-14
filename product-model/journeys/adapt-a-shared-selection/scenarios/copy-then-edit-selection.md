---
{
  "kind": "primary",
  "result": "achieved",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host chooses Create a selection from this",
      "kind": "actor",
      "actor": "host",
      "capability": "copy-selection",
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
      "text": "The Product creates the Host's selection and opens it",
      "kind": "product",
      "actor": "host",
      "capability": "copy-selection",
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
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::selection"
        }
      }
    },
    {
      "text": "The Host renames it",
      "kind": "actor",
      "actor": "host",
      "capability": "edit-selection",
      "entities": [
        {
          "entity": "selection",
          "effect": "changes",
          "as": "copy",
          "facts": [
            "Name"
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

# Create a selection from a shared one, then edit it

## Trigger

A host reads a selection another host shares.

## Outcome

The host lands on their own selection and edits it.
