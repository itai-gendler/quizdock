---
{
  "appliesTo": [
    {
      "type": "capability-scenario",
      "id": "start-on-its-own"
    },
    {
      "type": "capability-scenario",
      "id": "choose-after-a-quiz"
    },
    {
      "type": "capability",
      "id": "stop-lobby-countdown"
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.engine.ts",
      "title": "armLobbyCountdown"
    }
  ]
}
---

# A quiz picked after another starts on its own

A quiz picked in the lobby after another quiz — or opened by a selection with autostart — starts 30 seconds later, or as soon as every connected player is ready, unless the host stops the countdown; the room's first quiz waits for the host.
