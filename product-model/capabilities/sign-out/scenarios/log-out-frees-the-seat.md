---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "Authentication mode is Local and this name holds the seat",
      "kind": "condition",
      "entities": [
        {
          "entity": "instance-settings",
          "effect": "reads",
          "facts": [
            "Authentication mode"
          ]
        },
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
      },
      "actor": "host"
    },
    {
      "text": "The Host chooses Log out",
      "kind": "actor",
      "actor": "host",
      "entities": [],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace"
        }
      }
    },
    {
      "text": "The Product frees the seat and ends their sign-in",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "host-seat",
          "effect": "changes",
          "from": "Held",
          "to": "Free",
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

# Log out and free the host seat

## Trigger

The seat's holder logs out in local mode.

## Outcome

The seat is free for the next name; they keep only the roles granted to their account.

## Edge cases

- On a public demo the shared account keeps the seat for good: logging out frees nothing.
