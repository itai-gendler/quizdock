---
{
  "kind": "primary",
  "result": "achieved",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host chooses Present on one of their ready quizzes",
      "kind": "actor",
      "actor": "host",
      "capability": "present-quiz",
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
          "place": "quizdock-web::workspace::my-quizzes"
        }
      }
    },
    {
      "text": "The Product opens a room on it and its console",
      "kind": "product",
      "actor": "host",
      "capability": "present-quiz",
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
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::console"
        }
      }
    },
    {
      "text": "The Host chooses Start the quiz",
      "kind": "actor",
      "actor": "host",
      "capability": "start-quiz",
      "entities": [
        {
          "entity": "game",
          "effect": "changes",
          "from": "Lobby",
          "to": "Question",
          "facts": [
            "Current step",
            "Time left"
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
          "place": "quizdock-web::workspace::console"
        }
      }
    }
  ]
}
---

# Present, then start the quiz

## Trigger

A host chooses Present on a ready quiz.

## Outcome

The host lands on the room's console and starts the quiz once participants are in.
