---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host closes the room to newcomers",
      "kind": "actor",
      "actor": "host",
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
          "place": "quizdock-web::workspace::console"
        }
      }
    },
    {
      "text": "The Product refuses new participants from then on, even with the PIN, and every screen shows it",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "room",
          "effect": "changes",
          "facts": [
            "Closed to newcomers"
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

# Close the room to newcomers

## Trigger

Everyone expected is in.

## Outcome

Nobody else joins until the host reopens the room.
