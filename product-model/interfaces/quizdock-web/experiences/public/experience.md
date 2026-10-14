---
{
  "actors": [
    "visitor",
    "participant"
  ],
  "access": "public",
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/frontend/src/router.tsx",
      "title": "joinRoute, screenRoute, loginRoute"
    }
  ]
}
---

# Joining and the big screen

Where people get in without the host area: the sign-in page, joining a room with its PIN and playing from a phone, and a room's projection. Where the instance requires accounts, joining sends a participant who is not signed in to the sign-in first.
