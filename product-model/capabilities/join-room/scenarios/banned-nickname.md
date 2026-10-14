---
{
  "kind": "validation",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The nickname was banned from the room and its ban still runs",
      "kind": "condition",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "Banned nicknames"
          ]
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
      "text": "The Product refuses until the ban ends",
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

# A banned nickname

## Trigger

A removed participant tries to come back under the same nickname.

## Outcome

They are not seated.
