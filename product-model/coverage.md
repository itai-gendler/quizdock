---
{
  "scope": "The web application's live game, quiz authoring, history, selections, sign-in and roles: the backend services behind them, the shared contracts and the frontend pages that use them.",
  "method": "Static reading of source, schema, migrations, specifications, documentation and tests at the pinned commit; nothing was run.",
  "covered": [
    {
      "description": "Live rooms and games: the socket gateway, engine, scoring, archiving and room standings.",
      "paths": [
        "apps/backend/src/game/"
      ]
    },
    {
      "description": "Quizzes, questions, slides, quiz history and the portable import and export.",
      "paths": [
        "apps/backend/src/quizzes/",
        "apps/backend/src/questions/",
        "apps/backend/src/slides/"
      ]
    },
    {
      "description": "Selections.",
      "paths": [
        "apps/backend/src/selections/"
      ]
    },
    {
      "description": "Sign-in, roles, the host seat, accounts and preferences.",
      "paths": [
        "apps/backend/src/auth/",
        "apps/backend/src/users/",
        "apps/backend/src/me/"
      ]
    },
    {
      "description": "Data model and migrations.",
      "paths": [
        "apps/backend/prisma/"
      ]
    },
    {
      "description": "Contracts shared by the backend and the frontend: game events, question and slide content, preferences.",
      "paths": [
        "packages/contracts/src/index.ts",
        "packages/contracts/src/question-content.ts",
        "packages/contracts/src/slide-content.ts",
        "packages/contracts/src/preferences.ts"
      ]
    },
    {
      "description": "Frontend routing, the live game client and the pages for joining, playing, projecting, the console, quizzes, history, selections and the account.",
      "paths": [
        "apps/frontend/src/router.tsx",
        "apps/frontend/src/game/",
        "apps/frontend/src/routes/join-page.tsx",
        "apps/frontend/src/routes/player-page.tsx",
        "apps/frontend/src/routes/screen-page.tsx",
        "apps/frontend/src/routes/control-page.tsx",
        "apps/frontend/src/routes/live-page.tsx",
        "apps/frontend/src/routes/dashboard-page.tsx",
        "apps/frontend/src/routes/editor-page.tsx",
        "apps/frontend/src/routes/quiz-read-only.tsx",
        "apps/frontend/src/routes/question-form.tsx",
        "apps/frontend/src/routes/slide-form.tsx",
        "apps/frontend/src/routes/preview-page.tsx",
        "apps/frontend/src/routes/feedback-page.tsx",
        "apps/frontend/src/routes/history-page.tsx",
        "apps/frontend/src/routes/sessions-page.tsx",
        "apps/frontend/src/routes/selections-page.tsx",
        "apps/frontend/src/routes/selection-page.tsx",
        "apps/frontend/src/routes/profile-page.tsx",
        "apps/frontend/src/routes/login-page.tsx",
        "apps/frontend/src/routes/callback-page.tsx",
        "apps/frontend/src/routes/use-copy-quiz.ts",
        "apps/frontend/src/routes/quiz-starter.ts"
      ]
    },
    {
      "description": "Administration pages for accounts and quizzes, and the account and quiz operations behind them.",
      "paths": [
        "apps/frontend/src/routes/admin/admin-accounts-page.tsx",
        "apps/frontend/src/routes/admin/admin-quizzes-page.tsx",
        "apps/backend/src/admin/operations/accounts.operations.ts",
        "apps/backend/src/admin/operations/quizzes.operations.ts",
        "apps/backend/src/admin/operations/cli-commands.operations.ts"
      ]
    },
    {
      "description": "Interface translations.",
      "paths": [
        "apps/frontend/src/i18n/"
      ]
    }
  ],
  "exclusions": [
    {
      "description": "Automated tests, fixtures and load-test tooling.",
      "paths": [
        "apps/backend/test/",
        "tools/"
      ]
    },
    {
      "description": "Specifications, documentation, screenshots and branding assets.",
      "paths": [
        "specifications/",
        "docs/",
        "branding/"
      ]
    },
    {
      "description": "Packaging, deployment and repository tooling.",
      "paths": [
        "docker/",
        "env/",
        "keycloak/",
        ".github/",
        ".husky/",
        "quizdock",
        "Dockerfile",
        "Dockerfile.standalone",
        "docker-compose.yml",
        "docker-compose.prod.yml"
      ]
    },
    {
      "description": "Generated API client and API description.",
      "paths": [
        "apps/frontend/src/api/generated/",
        "apps/backend/openapi/"
      ]
    },
    {
      "description": "Design system components, styling and the frontend's visual helpers.",
      "paths": [
        "apps/frontend/src/components/ui/",
        "apps/frontend/src/index.css"
      ]
    }
  ],
  "unmapped": [
    {
      "description": "Media library, in-browser conversion, credits and media housekeeping: left out as a supporting area of authoring; a question's and a slide's media appear as their facts.",
      "paths": [
        "apps/backend/src/media/",
        "apps/frontend/src/routes/media-library-dialog.tsx",
        "apps/frontend/src/routes/media-upload.tsx",
        "apps/frontend/src/routes/question-media-field.tsx",
        "apps/frontend/src/routes/slide-media-field.tsx",
        "apps/frontend/src/routes/admin-media-page.tsx"
      ]
    },
    {
      "description": "Quiz themes and the instance's look: left out as presentation the model does not prescribe beyond a quiz's Theme fact.",
      "paths": [
        "apps/backend/src/themes/",
        "apps/backend/src/look/",
        "apps/frontend/src/routes/themes-page.tsx",
        "apps/frontend/src/routes/theme-editor-page.tsx",
        "apps/frontend/src/routes/builtin-theme-page.tsx",
        "apps/frontend/src/routes/quiz-theme-field.tsx"
      ]
    },
    {
      "description": "Template catalogue, the community store and publication export: left out as a sharing channel beside the core (copies offered to the instance or to an outside store).",
      "paths": [
        "apps/backend/src/store/",
        "apps/backend/src/quizzes/portable/quiz-publication.service.ts",
        "apps/frontend/src/routes/templates-page.tsx",
        "apps/frontend/src/routes/template-page.tsx",
        "apps/frontend/src/routes/community-page.tsx",
        "apps/frontend/src/routes/community-preview-page.tsx",
        "apps/frontend/src/routes/publication-export.tsx"
      ]
    },
    {
      "description": "The rest of the administration — settings and their locks, branding, interface, health, audit trail, statistics, presets, the setup wizard and update notices: left out as instance operation rather than the hosting product.",
      "paths": [
        "apps/backend/src/admin/",
        "apps/backend/src/app-config/",
        "apps/backend/src/health/",
        "apps/frontend/src/routes/admin/",
        "apps/frontend/src/routes/setup/"
      ]
    },
    {
      "description": "The operator command line and the local MCP connector: left out as operator tooling that runs the same operations.",
      "paths": [
        "apps/backend/src/cli/",
        "apps/backend/src/cli.ts",
        "apps/backend/src/mcp/"
      ]
    },
    {
      "description": "Public demo mode and sample quizzes: left out as a showcase deployment and seed content.",
      "paths": [
        "apps/backend/src/demo/",
        "apps/backend/src/quizzes/samples/",
        "apps/backend/samples/"
      ]
    }
  ],
  "limitations": [
    {
      "description": "Joining a room that requires an account while not signed in (sign in, then come back to the room) is not written as a Journey, because the person changes Actor when they sign in, which pdd-kit 0.37.0 cannot express.",
      "paths": [
        "apps/frontend/src/router.tsx",
        "apps/frontend/src/routes/login-page.tsx"
      ]
    }
  ]
}
---

# Coverage
