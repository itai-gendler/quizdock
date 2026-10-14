---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host chooses Present on a selection",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "selection",
          "effect": "reads",
          "facts": [
            "Name",
            "Quizzes"
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
      "text": "The Product opens a room on the selection's first quiz that can be played, with the pace the selection gives it, and opens its console",
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
    }
  ]
}
---

# Present a selection

## Trigger

A host runs a prepared series.

## Outcome

The room is open on the first quiz; the console shows the selection's quizzes, those played and the next one.

## Edge cases

- The settings that depend on the audience — capture, tracking, names, access, address, sound, language — are the room's, picked at each launch.
- Quizzes that cannot be played are skipped.
