---
{
  "kind": "validation",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The room is closed to newcomers",
      "kind": "condition",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "Closed to newcomers"
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
      "text": "The Participant types the PIN",
      "kind": "actor",
      "actor": "participant",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "PIN",
            "Closed to newcomers"
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
      "text": "The Product says the room is closed to newcomers",
      "kind": "product",
      "actor": "participant",
      "entities": [
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
      }
    }
  ]
}
---

# A room closed to newcomers

## Trigger

Someone arrives after the host closed the room to newcomers.

## Outcome

They are not seated; a participant already in still comes back.
