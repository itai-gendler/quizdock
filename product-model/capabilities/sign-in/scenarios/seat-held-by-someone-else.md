---
{
  "kind": "validation",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "Authentication mode is Local and the seat is held under another name",
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
            "Holder",
            "Expires at"
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
      "text": "The Visitor types a name that does not hold the seat and tries to take it",
      "kind": "actor",
      "actor": "visitor",
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
          "place": "quizdock-web::public::sign-in"
        }
      }
    },
    {
      "text": "The Product refuses, says who holds the seat and until when, and offers to join a room instead",
      "kind": "product",
      "actor": "visitor",
      "entities": [
        {
          "entity": "host-seat",
          "effect": "reads",
          "facts": [
            "Holder",
            "Expires at"
          ]
        },
        {
          "entity": "room",
          "effect": "reads",
          "facts": []
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

# The seat is held by someone else

## Trigger

Someone tries to take the seat while another name holds it.

## Outcome

They are not signed in as host; they may still take part in the holder's rooms with a PIN.
