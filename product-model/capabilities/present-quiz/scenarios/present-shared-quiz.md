---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The quiz is another host's, shared and ready",
      "kind": "condition",
      "entities": [
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": [
            "Owner",
            "Shared"
          ]
        },
        {
          "entity": "host",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::my-quizzes"
        }
      },
      "actor": "host"
    },
    {
      "text": "The Host chooses Present without keeping results",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": [
            "Title",
            "Owner"
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
      "text": "The Product opens a room on it whose game keeps nothing, full answer capture and personalised tracking off, and opens its console",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "room",
          "effect": "creates",
          "to": "Open",
          "facts": [
            "PIN",
            "Name",
            "Participant access",
            "Full answer capture",
            "Personalised tracking",
            "Own display names",
            "Closed to newcomers",
            "Room sound"
          ]
        },
        {
          "entity": "game",
          "effect": "creates",
          "to": "Lobby",
          "facts": [
            "Quiz played",
            "Pace",
            "Keeps results"
          ],
          "with": "room"
        },
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": []
        },
        {
          "entity": "answer",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::console"
        }
      }
    }
  ]
}
---

# Present another host's quiz without keeping results

## Trigger

A host presents a colleague's quiz as it is.

## Outcome

The quiz plays as usual; nothing of it will reach History, and participants are told nothing is recorded.

## Edge cases

- The same is offered from the read-only view of the quiz and from the room's quiz picker.
