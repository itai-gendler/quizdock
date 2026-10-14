---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "host-seat",
      "effect": "changes",
      "facts": [
        "Expires at"
      ],
      "contexts": [
        {
          "place": "quizdock-web::workspace"
        }
      ]
    }
  ],
  "permits": [
    {
      "related": [
        {
          "verb": "holds",
          "entity": "account"
        },
        {
          "verb": "holds",
          "entity": "host"
        }
      ]
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/users/host-seat.service.ts",
      "title": "claim"
    }
  ]
}
---

# Only the seat's holder extends the seat

The seat's expiry moves only for the account holding it.
