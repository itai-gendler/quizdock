---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Participant chooses to show the big screen, or shares it to another of their devices",
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
          "place": "quizdock-web::public::participant-view"
        }
      }
    },
    {
      "text": "The Product shows that device the room's projection, muted in the room and with sound for someone following remotely",
      "kind": "product",
      "actor": "participant",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "PIN",
            "Name"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::public::projection"
        }
      }
    }
  ]
}
---

# Follow the projection on one's own device

## Trigger

A participant cannot see the big screen well, or follows from home.

## Outcome

Their device follows the projection; it never takes their seat.
