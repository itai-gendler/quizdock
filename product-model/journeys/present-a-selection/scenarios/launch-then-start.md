---
{
  "kind": "primary",
  "result": "achieved",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host chooses Present on a selection",
      "kind": "actor",
      "actor": "host",
      "capability": "launch-selection",
      "entities": [
        {
          "entity": "selection",
          "effect": "reads",
          "facts": [
            "Name"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::selection"
        }
      }
    },
    {
      "text": "The Product opens a room on the selection's first playable quiz and its console",
      "kind": "product",
      "actor": "host",
      "capability": "launch-selection",
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
            "Room sound",
            "Selection"
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
          "entity": "selection",
          "effect": "reads",
          "facts": []
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

# Present a selection, then start its first quiz

## Trigger

A host chooses Present on a selection.

## Outcome

The host lands on the room's console and starts the first quiz.
