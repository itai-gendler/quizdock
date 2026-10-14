---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "host-seat",
      "effect": "changes",
      "to": "Held"
    }
  ],
  "permits": [
    {
      "actors": [
        "visitor"
      ],
      "when": [
        {
          "entity": "instance-settings",
          "fact": "Authentication mode",
          "is": "Local"
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

# Only someone signing in locally takes a free host seat

In local mode, a person signing in under a name takes the host seat when nobody holds it. With an identity provider there is no seat: roles come from the provider and the administration.
