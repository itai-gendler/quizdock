---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The room requires accounts and does not let participants pick their name",
      "kind": "condition",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "Participant access",
            "Own display names"
          ]
        },
        {
          "entity": "participant",
          "effect": "reads",
          "facts": []
        },
        {
          "entity": "account",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::public::join"
        }
      },
      "actor": "participant"
    },
    {
      "text": "The Participant, signed in, types the PIN and joins",
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
      "text": "The Product seats them under their account's name, telling two homonyms apart by a number",
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
          "entity": "account",
          "effect": "reads",
          "facts": [
            "Display name"
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

# Join under one's account name

## Trigger

A signed-in participant joins a room on an instance that requires accounts.

## Outcome

Their results attach to their account under the name it carries.
