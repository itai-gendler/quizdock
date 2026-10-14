---
{
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/users/host-seat.service.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/prisma/schema.prisma",
      "title": "HostSeat"
    }
  ]
}
---

# Host seat

In local mode, the single seat that makes its holder the instance's host: whoever holds it hosts, every other name takes part as a participant.

## Information kept

- **Holder** — the name holding the seat
- **Claimed at** — when the holder took or last extended it
- **Expires at** — when the seat frees itself, or never

## States

### Free

Nobody holds the seat, or its expiry is past; the next name to take it hosts.

### Held

One name holds the seat and hosts.
