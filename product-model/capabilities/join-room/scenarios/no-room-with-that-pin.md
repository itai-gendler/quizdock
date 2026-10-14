---
{
  "kind": "validation",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Participant types a PIN no open room has",
      "kind": "actor",
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
    },
    {
      "text": "The Product says there is no open room with this PIN",
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

# No open room with that PIN

## Trigger

A mistyped PIN, or a room already closed.

## Outcome

They stay on the PIN entry.
