---
{
  "kind": "validation",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "A player of the room already has that nickname",
      "kind": "condition",
      "entities": [
        {
          "entity": "player",
          "effect": "reads",
          "facts": [
            "Nickname"
          ]
        },
        {
          "entity": "room",
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
      "text": "The Participant joins under it",
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
      "text": "The Product refuses the nickname and asks for another",
      "kind": "product",
      "actor": "participant",
      "entities": [],
      "contexts": {
        "web": {
          "place": "quizdock-web::public::join"
        }
      }
    }
  ]
}
---

# A nickname already taken

## Trigger

Two people pick the same nickname.

## Outcome

They are not seated until they pick a free nickname.

## Edge cases

- Nicknames are compared ignoring case, accents and extra spaces.
