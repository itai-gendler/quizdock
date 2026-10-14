---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host changes the slide and saves it",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "slide",
          "effect": "reads",
          "facts": [
            "Content",
            "Background",
            "Video",
            "Sound",
            "Display time",
            "Position"
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
      "text": "The Product saves it",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "slide",
          "effect": "changes",
          "facts": [
            "Content",
            "Background",
            "Video",
            "Sound",
            "Display time"
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

# Edit a slide

## Trigger

A host fills or changes a slide.

## Outcome

The slide is saved; a room playing the quiz shows its new version when it comes.

## Edge cases

- A picture background and a gradient cannot both be set.
