---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The game is in its lobby",
      "kind": "condition",
      "entities": [
        {
          "entity": "game",
          "effect": "reads",
          "facts": [
            "Current step"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::console"
        }
      },
      "actor": "host"
    },
    {
      "text": "The Host lets participants pick their name, picks who hears the sound, or one language for the screens",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "room",
          "effect": "reads",
          "facts": [
            "Own display names",
            "Who hears the sound",
            "Screen language"
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
    },
    {
      "text": "The Product keeps the settings and every device follows",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "room",
          "effect": "changes",
          "facts": [
            "Own display names",
            "Who hears the sound",
            "Screen language"
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

# Set the names, the sound and the screens' language

## Trigger

A host adapts the room to its audience.

## Outcome

The projection and the phones follow at once; a chosen name changes what the screens show, never whom results attach to.
