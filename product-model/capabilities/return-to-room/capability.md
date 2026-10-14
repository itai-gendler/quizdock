---
{
  "availability": [
    {
      "place": "quizdock-web::workspace"
    }
  ],
  "domain": "rooms",
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.engine.ts",
      "title": "onHostAttached"
    },
    {
      "kind": "spec",
      "role": "intent",
      "target": "specifications/SPECIFICATIONS-LIVE.md",
      "title": "The presenter disconnects"
    }
  ]
}
---

# Return to a room

The room's host opens its console again — after a reload, from another device or from Open rooms — and the room picks up where it stood. While the host is away the room waits for them.
