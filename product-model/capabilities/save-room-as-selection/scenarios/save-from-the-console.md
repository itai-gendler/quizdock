---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The room is in its lobby, or closed, after playing quizzes",
      "kind": "condition",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "Played quizzes"
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
          "place": "quizdock-web::console"
        }
      },
      "actor": "host"
    },
    {
      "text": "The Host chooses Save as a selection",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "Name"
          ]
        },
        {
          "entity": "selection",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::console"
        }
      }
    },
    {
      "text": "The Product creates a selection named after the room, with every quiz the room played in order and the pace each had",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "selection",
          "effect": "creates",
          "facts": [
            "Name",
            "Quizzes"
          ]
        },
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": []
        },
        {
          "entity": "room",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::console"
        }
      }
    }
  ]
}
---

# Save from the console

## Trigger

An improvised series went well.

## Outcome

The selection is among the host's, ready to launch again; quizzes they may no longer read are left out.
