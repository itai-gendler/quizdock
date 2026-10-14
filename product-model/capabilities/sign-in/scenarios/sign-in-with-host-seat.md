---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "Authentication mode is Local and nobody holds the seat",
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
      "text": "The Visitor types their name and how long to keep the seat, then takes it",
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
      "text": "The Product signs the Visitor in under that name and gives them the seat until the chosen time, or until they log out",
      "kind": "product",
      "actor": "visitor",
      "entities": [
        {
          "entity": "host-seat",
          "effect": "changes",
          "from": "Free",
          "to": "Held",
          "facts": [
            "Holder",
            "Claimed at",
            "Expires at"
          ]
        },
        {
          "entity": "account",
          "effect": "changes",
          "facts": [
            "Display name",
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

# Take the free host seat

## Trigger

Someone in local mode wants to build and present quizzes on this instance.

## Outcome

They are signed in and hold the seat: they host, and every other name takes part as a participant until the seat is free again.

## Edge cases

- The seat may be kept for a number of hours or until log out; an expired seat is free for the next name that takes it.
- Whoever had let the seat expire goes back to the roles granted to their account.
