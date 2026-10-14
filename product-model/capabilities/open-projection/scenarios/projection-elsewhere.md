---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Visitor opens the room's projection address on the computer connected to the projector",
      "kind": "actor",
      "actor": "visitor",
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
          "place": "quizdock-web::public::projection"
        }
      }
    },
    {
      "text": "The Product shows the room and a projection code for the host to pair",
      "kind": "product",
      "actor": "visitor",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "PIN",
            "Name"
          ]
        },
        {
          "entity": "host",
          "effect": "reads",
          "facts": []
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

# A projection on another computer

## Trigger

The projector is on another computer than the host's.

## Outcome

The screen follows the room; it becomes the room's projection once the host pairs it.
