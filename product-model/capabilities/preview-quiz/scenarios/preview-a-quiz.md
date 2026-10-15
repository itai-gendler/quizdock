---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host chooses Preview",
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
      "text": "The Product opens the quiz's steps as they will show, the right answers marked, the media credits listed",
      "kind": "product",
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
          "entity": "question",
          "effect": "reads",
          "facts": [
            "Prompt",
            "Media",
            "Answer choices",
            "Explanation"
          ]
        },
        {
          "entity": "slide",
          "effect": "reads",
          "facts": [
            "Content",
            "Background",
            "Video"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::quiz-preview"
        }
      }
    }
  ]
}
---

# Preview a quiz

## Trigger

A host checks how a quiz will look before presenting it.

## Outcome

They have walked through it; nothing was played or recorded.
