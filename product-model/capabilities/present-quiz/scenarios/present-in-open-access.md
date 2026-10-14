---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "Authentication mode is Identity provider and hosts may open rooms to participants without an account",
      "kind": "condition",
      "entities": [
        {
          "entity": "instance-settings",
          "effect": "reads",
          "facts": [
            "Authentication mode",
            "Anonymous participants"
          ]
        },
        {
          "entity": "participant",
          "effect": "reads",
          "facts": []
        },
        {
          "entity": "host",
          "effect": "reads",
          "facts": []
        },
        {
          "entity": "account",
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
          "place": "quizdock-web::workspace::my-quizzes"
        }
      },
      "actor": "host"
    },
    {
      "text": "The Host chooses Present, then Open access, and may ask to remember the choice",
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
          "place": "quizdock-web::workspace::my-quizzes"
        }
      }
    },
    {
      "text": "The Product opens the room in open access, where participants are guests: personalised tracking off and nicknames typed",
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
          "entity": "account",
          "effect": "changes",
          "facts": [
            "Participant access at launch"
          ]
        },
        {
          "entity": "participant",
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

# Open the room to participants without an account

## Trigger

A host on an instance that requires accounts welcomes visitors or trainees who have none.

## Outcome

The PIN and a nickname are enough to join this room for as long as it is open.

## Edge cases

- A host who remembered their choice is not asked again; Accounts required opens the room the usual way.
