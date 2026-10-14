---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Participant types the room's PIN",
      "kind": "actor",
      "actor": "participant",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "PIN"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::public::join"
        }
      }
    },
    {
      "text": "The Product finds the room and shows its name, its host and the quiz being played",
      "kind": "product",
      "actor": "participant",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "Name"
          ]
        },
        {
          "entity": "game",
          "effect": "reads",
          "facts": [
            "Quiz played"
          ]
        },
        {
          "entity": "quiz",
          "effect": "reads",
          "facts": []
        },
        {
          "entity": "host",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::public::join"
        }
      }
    },
    {
      "text": "The Participant picks a nickname and an avatar, says whether they play in the room or remotely, and joins",
      "kind": "actor",
      "actor": "participant",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "Name"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::public::join"
        }
      }
    },
    {
      "text": "The Product seats them in the room, says what will be recorded about them, and shows the step being played",
      "kind": "product",
      "actor": "participant",
      "entities": [
        {
          "entity": "player",
          "effect": "creates",
          "to": "Connected",
          "facts": [
            "Nickname",
            "Avatar",
            "Presence",
            "Ready",
            "Score",
            "Joined at"
          ]
        },
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "Full answer capture",
            "Personalised tracking"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::public::participant-view"
        }
      }
    }
  ]
}
---

# Join with a nickname

## Trigger

Someone is invited into a room.

## Outcome

They are in the room; the console and the projection show them.

## Edge cases

- A remote participant gets the whole question, its sound and its video on their device.
- Wrong PINs from one address are slowed down.
- Where the room requires accounts and they are not signed in, they sign in first and come back to the room.
