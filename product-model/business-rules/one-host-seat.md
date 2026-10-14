---
{
  "appliesTo": [
    {
      "type": "capability",
      "id": "sign-in"
    },
    {
      "type": "entity",
      "id": "host-seat"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/users/host-seat.service.ts"
    },
    {
      "kind": "spec",
      "role": "intent",
      "target": "specifications/SPECIFICATIONS-METIER.md"
    }
  ]
}
---

# Local mode has one host at a time

In local mode the host seat is held by one name at a time: it hosts, every other name takes part as a participant. The seat frees itself once its expiry is past. An administrator does not take the seat: managing is not hosting, and an account granted the Host role does not need it.

## Rationale

Local mode needs no identity provider; the seat keeps hosting an explicit act on a shared instance.
