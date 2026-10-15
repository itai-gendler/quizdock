---
{
  "appliesTo": [
    {
      "type": "context",
      "context": {
        "place": "quizdock-web::workspace"
      }
    }
  ],
  "references": [
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/auth/auth.guard.ts"
    },
    {
      "kind": "code",
      "role": "implementation",
      "target": "apps/backend/src/auth/roles.ts"
    },
    {
      "kind": "spec",
      "role": "intent",
      "target": "specifications/SPECIFICATIONS-METIER.md"
    }
  ]
}
---

# An administrator alone creates, edits and presents nothing

The Administrator role reads the whole instance and administers it; creating, editing and presenting belong to the Host role. An account holding both hosts its own bank like any host, and never edits another's.

## Rationale

Managing and hosting are different jobs; the two roles accumulate on one account when a small instance needs it.
