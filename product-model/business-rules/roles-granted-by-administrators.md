---
{
  "appliesTo": [
    {
      "type": "entity",
      "id": "account",
      "effect": "changes",
      "facts": [
        "Granted roles"
      ]
    }
  ],
  "permits": [
    {
      "actors": [
        "administrator"
      ],
      "when": [
        {
          "entity": "instance-settings",
          "fact": "Web administration scope",
          "is": "Write"
        }
      ]
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/admin/runner/operation-runner.ts",
      "title": "scope"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/auth/roles.ts"
    }
  ]
}
---

# Only an administrator grants or revokes roles

An administrator changes the roles granted to an account while the operator lets the web administration write; the operator's command line always may. A granted role adds to what the identity provider or the seat gives.
