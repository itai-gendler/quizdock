---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host switches game sounds, picks a background track or moves a level",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "Room sound"
          ]
        },
        {
          "entity": "game",
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
      "text": "The Product keeps the room's sound and every screen plays accordingly",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "room",
          "effect": "changes",
          "facts": [
            "Room sound"
          ]
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

# Set the room's sound

## Trigger

A host sets the mood, or quiets the room.

## Outcome

The sounds carry over from one quiz of the room to the next.

## Edge cases

- A sound picked must be the host's own or one the instance provides.
- The background track steps out while a question plays its own sound.
