---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host opens My quizzes",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::my-quizzes"
        }
      }
    },
    {
      "text": "The Product lists their quizzes, latest first, then those other hosts share, marked read-only with their owner",
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
            "Cover",
            "Tags",
            "Licence",
            "Question count",
            "Owner",
            "Updated",
            "Shared"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::my-quizzes"
        }
      }
    },
    {
      "text": "The Host narrows the list by status, owner, language or tags",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": [
            "Title",
            "Tags",
            "Language",
            "Owner"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::my-quizzes"
        }
      }
    }
  ]
}
---

# Browse one's quizzes

## Trigger

A host wants a quiz to work on or to present.

## Outcome

They see the quizzes they may open, each with its status, size, language, date, licence and tags.

## Edge cases

- Archived quizzes stay out of the way unless the status filter asks for them.
- Another host's quiz shows only while it is shared and not archived.
