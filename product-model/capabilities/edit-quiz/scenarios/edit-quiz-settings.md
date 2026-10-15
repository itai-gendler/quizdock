---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host changes the quiz's title, description, language, tags, licence, ratings switch, sound or theme",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": [
            "Title",
            "Description",
            "Language",
            "Cover",
            "Tags",
            "Licence",
            "Reviews enabled",
            "Sound settings",
            "Theme"
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
      "text": "The Product saves each change as it is made",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "quiz",
          "effect": "changes",
          "facts": [
            "Title",
            "Description",
            "Language",
            "Cover",
            "Tags",
            "Licence",
            "Reviews enabled",
            "Sound settings",
            "Theme"
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

# Edit a quiz's settings

## Trigger

A host refines a quiz they own.

## Outcome

The quiz keeps the new settings; a room already playing it keeps the quiz as it opened, apart from whether it takes ratings.

## Edge cases

- A replaced cover leaves with its file unless something else uses it.
- A licence is needed to offer the quiz as a template.
