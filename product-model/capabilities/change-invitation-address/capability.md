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
      "target": "apps/frontend/src/game/join-address-picker.tsx"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.engine.ts",
      "title": "setJoinUrl"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/game/game.controller.ts",
      "title": "joinAddresses"
    }
  ]
}
---

# Change the invitation address

In the lobby, the host picks the address the QR code and the join link point at: the instance's public address, an address of the machine on the local network, the page's own, or one typed.
