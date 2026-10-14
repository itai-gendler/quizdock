---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host chooses Release the seat",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "host-seat",
          "effect": "reads",
          "facts": [
            "Holder"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace"
        }
      }
    },
    {
      "text": "The Product frees the seat; they stay signed in with only the roles granted to their account",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "host-seat",
          "effect": "changes",
          "from": "Held",
          "to": "Free",
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
          "place": "quizdock-web::workspace"
        }
      }
    }
  ]
}
---

# Release one's own seat

## Trigger

The holder hands hosting over to someone else.

## Outcome

The seat is free; the former holder can still take part in rooms, and may undo at once.
