---
{
  "kind": "primary",
  "routes": {
    "web": "Web"
  },
  "steps": [
    {
      "text": "The Host chooses Ban on a player, sets the ban's minutes and confirms",
      "kind": "actor",
      "actor": "host",
      "entities": [
        {
          "entity": "player",
          "effect": "reads",
          "facts": [
            "Nickname",
            "Avatar"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::console"
        }
      }
    },
    {
      "text": "The Product removes the player from the room and its standings, tells their device, and bans the nickname for that long",
      "kind": "product",
      "actor": "host",
      "entities": [
        {
          "entity": "player",
          "effect": "removes",
          "from": "Connected"
        },
        {
          "entity": "room",
          "effect": "changes",
          "facts": [
            "Banned nicknames"
          ]
        }
      ],
      "contexts": {
        "web": {
          "place": "quizdock-web::workspace::console"
        }
      }
    }
  ]
}
---

# Remove and ban a player

## Trigger

An inappropriate nickname, or someone disrupting the room.

## Outcome

The player is gone; the same nickname is refused until the ban ends.

## Edge cases

- Removing the last player who had not answered reveals the question at once.
