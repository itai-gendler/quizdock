---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host deletes a slide and confirms",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "slide",
          "effect": "reads",
          "facts": [
            "Content"
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
      "text": "The Product removes it",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "slide",
          "effect": "removes"
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

# Delete a slide

## Trigger

A slide is no longer wanted.

## Outcome

The slide is gone from the sequence.
