---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "Authentication mode is Local and the seat is held under the name typed",
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
          "place": "quizdock-web::public::sign-in"
        }
      },
      "actor": "visitor"
    },
    {
      "text": "The Visitor types the name that holds the seat and signs back in",
      "kind": "actor",
      "actor": "visitor",
      "entities": [
        {
          "entity": "host-seat",
          "effect": "reads",
          "facts": [
            "Holder",
            "Expires at"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::public::sign-in"
        }
      }
    },
    {
      "text": "The Product signs them back in as the seat's holder",
      "kind": "product",
      "actor": "visitor",
      "entities": [
        {
          "entity": "host-seat",
          "effect": "reads",
          "facts": [
            "Holder"
          ]
        },
        {
          "entity": "account",
          "effect": "changes",
          "facts": [
            "Roles"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::public::sign-in"
        }
      }
    }
  ]
}
---

# Come back as the seat's holder

## Trigger

The seat's holder signs in again, on this device or another.

## Outcome

They are back in the host area with their quizzes; the seat stays theirs.
