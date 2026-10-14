---
{
  "kind": "primary",
  "result": "achieved",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host chooses Create a quiz on the shared quiz",
      "kind": "actor",
      "actor": "host",
      "capability": "copy-quiz",
      "entities": [
        {
          "entity": "quiz",
          "effect": "reads",
          "as": "original",
          "facts": [
            "Title",
            "Owner"
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
      "text": "The Product creates the Host's draft copy and opens it",
      "kind": "product",
      "actor": "host",
      "capability": "copy-quiz",
      "entities": [
        {
          "entity": "quiz",
          "effect": "creates",
          "as": "copy",
          "to": "Draft",
          "facts": [
            "Title",
            "Description",
            "Language",
            "Owner"
          ]
        },
        {
          "entity": "quiz",
          "effect": "reads",
          "as": "original",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::quiz-editor"
        }
      }
    },
    {
      "text": "The Host renames the copy",
      "kind": "actor",
      "actor": "host",
      "capability": "edit-quiz",
      "entities": [
        {
          "entity": "quiz",
          "effect": "changes",
          "as": "copy",
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
    }
  ]
}
---

# Create a quiz from a shared quiz, then edit it

## Trigger

A host reads a quiz another host shares.

## Outcome

The host lands in their own copy and changes its settings.
