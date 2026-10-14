---
{
  "appliesTo": [
    {
      "type": "capability-scenario",
      "id": "host-goes-away"
    },
    {
      "type": "capability-scenario",
      "id": "host-comes-back"
    },
    {
      "type": "capability-scenario",
      "id": "abandoned-room-closes"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.engine.ts",
      "title": "declareHostDisconnected"
    },
    {
      "kind": "spec",
      "role": "intent",
      "target": "specifications/SPECIFICATIONS-LIVE.md"
    }
  ]
}
---

# A room waits two minutes for its host

Five seconds after the host's last console is gone, the game stands still, answers refused; if the host comes back within two minutes it resumes where it was, otherwise the room closes, keeping what was played as an interrupted session. An idle room expires four hours after it was last used.
