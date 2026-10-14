---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "selection",
      "effect": "creates"
    }
  ],
  "permits": [
    {
      "actors": [
        "host"
      ]
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/selections/selections.service.ts"
    }
  ]
}
---

# A host creates selections

Creating a selection — new, saved from a room or from another host's — belongs to hosts; it is theirs.
