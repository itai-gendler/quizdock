---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host adds a slide",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": [
            "Title"
          ]
        },
        {
          "entity": "slide",
          "effect": "reads",
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
      "text": "The Product adds an empty slide to the sequence",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "slide",
          "effect": "creates",
          "facts": [
            "Content",
            "Position"
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

# Add a slide

## Trigger

A host wants to show something between questions.

## Outcome

The slide is in the sequence, ready to be filled.
