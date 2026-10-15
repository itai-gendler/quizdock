---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host chooses Export",
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
      "text": "The Product downloads the quiz, its questions, slides, theme and media, with their credits, as a bundle",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": [
            "Title",
            "Description",
            "Language",
            "Tags",
            "Licence",
            "Sound settings",
            "Theme"
          ]
        },
        {
          "entity": "question",
          "effect": "reads",
          "facts": [
            "Type",
            "Prompt",
            "Media",
            "Answer choices",
            "Accepted answers",
            "Target number",
            "Several right pictures",
            "Time limit",
            "Points",
            "Scoring rule",
            "Explanation",
            "Reveal delay",
            "Listen first",
            "Background",
            "Position"
          ]
        },
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
    }
  ]
}
---

# Export a quiz

## Trigger

A host backs a quiz up or moves it.

## Outcome

They have a bundle another instance imports as a new draft.
