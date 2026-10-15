---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host opens Selections",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "selection",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::selections"
        }
      }
    },
    {
      "text": "The Product lists their selections and the shared ones holding a quiz they may read, each with how many quizzes it has and how many can be played",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "selection",
          "effect": "reads",
          "facts": [
            "Name",
            "Description",
            "Quizzes",
            "Shared"
          ]
        },
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::selections"
        }
      }
    }
  ]
}
---

# Browse selections

## Trigger

A host prepares a session.

## Outcome

They find a selection to launch or to edit.

## Edge cases

- Their own selections always show, an empty one included.
