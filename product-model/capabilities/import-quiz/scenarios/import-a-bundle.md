---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host chooses Import and picks a bundle",
      "kind": "actor",
      "actor": "host",
      "entities": [],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::my-quizzes"
        }
      }
    },
    {
      "text": "The Product creates a draft owned by the Host with the bundle's questions, slides, settings and media, and opens it in the editor",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "quiz",
          "effect": "creates",
          "to": "Draft",
          "facts": [
            "Title",
            "Description",
            "Language",
            "Tags",
            "Licence",
            "Sound settings",
            "Theme",
            "Owner"
          ]
        },
        {
          "entity": "question",
          "effect": "creates",
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
          ],
          "with": "quiz"
        },
        {
          "entity": "slide",
          "effect": "creates",
          "facts": [
            "Content",
            "Background",
            "Video",
            "Sound",
            "Display time",
            "Position"
          ],
          "with": "quiz"
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

# Import a bundle

## Trigger

A host brings a quiz from a backup, another instance or someone else.

## Outcome

The quiz is a new draft of theirs, independent of where it came from.

## Edge cases

- A bundle written for an older format version is still read.
