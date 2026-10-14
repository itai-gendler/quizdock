---
{
  "kind": "alternative",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Administrator chooses Free the seat on the Accounts page",
      "kind": "actor",
      "actor": "administrator",
      "entities": [
        {
          "entity": "host-seat",
          "effect": "reads",
          "facts": [
            "Holder",
            "Claimed at"
          ]
        },
        {
          "entity": "account",
          "effect": "reads",
          "facts": []
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::administration::accounts"
        }
      }
    },
    {
      "text": "The Product frees the seat, whoever held it, and returns the holder to their granted roles",
      "kind": "product",
      "actor": "administrator",
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
          "place": "quizdock-web::administration::accounts"
        }
      }
    }
  ]
}
---

# An administrator frees the seat

## Trigger

A seat is held by someone who is gone.

## Outcome

The seat is free for the next name.

## Edge cases

- An administrator frees the seat without taking it: an administrator does not host on that role alone.
