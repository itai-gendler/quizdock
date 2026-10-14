---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host picks a duration and extends the seat",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "host-seat",
          "effect": "reads",
          "facts": [
            "Expires at"
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
      "text": "The Product keeps the seat theirs until the new time",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "host-seat",
          "effect": "changes",
          "facts": [
            "Claimed at",
            "Expires at"
          ]
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

# Extend the seat

## Trigger

The seat's holder needs more time than they first chose.

## Outcome

The seat now expires at the new time.
