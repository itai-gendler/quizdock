---
{
  "kind": "validation",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "A question or a slide misses something to be played",
      "kind": "condition",
      "entities": [
        {
          "entity": "question",
          "effect": "reads",
          "facts": [
            "Prompt",
            "Answer choices"
          ]
        },
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
      },
      "actor": "host"
    },
    {
      "text": "The Host chooses Publish",
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
      "text": "The Product lists each step still to finish and what it misses, each opening its step",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "question",
          "effect": "reads",
          "facts": [
            "Prompt"
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

# Publish a quiz with steps to finish

## Trigger

A host publishes before finishing.

## Outcome

The quiz stays a draft until every step is complete.

## Edge cases

- A quiz with no question at all cannot be published.
