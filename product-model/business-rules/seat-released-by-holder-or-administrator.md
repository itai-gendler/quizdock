---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "host-seat",
      "effect": "changes",
      "to": "Free"
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
    },
    {
      "actors": [
        "administrator"
      ]
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/users/host-seat.service.ts",
      "title": "release"
    }
  ]
}
---

# The seat's holder or an administrator frees the host seat

The holder frees the seat by releasing it or logging out; an administrator frees it whoever holds it.
