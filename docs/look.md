# The instance's look

The look of the application itself — the back office, the home, join and sign-in pages —
as an administrator sets it. A quiz on the live screens wears its own theme
([`themes.md`](themes.md)), never this. Intent and remaining work:
[`SPECIFICATIONS-THEMING.md`](../specifications/SPECIFICATIONS-THEMING.md).

## What it holds

`InterfaceLook` (`packages/contracts/src/interface-look.ts`), QuizDock's own in
`DEFAULT_LOOK`:

| Part | What it sets |
|---|---|
| `primary` | `--primary` and `--ring`: buttons, the selected filters, the focus ring. Its text is always white, in light and dark mode alike. |
| `accent` | `--link`: links and the mark of the current page in the header. On the dark page it is lightened, same hue, until it reaches 7:1 (`linkOnDark`). |
| `font` | a shipped font or an imported woff2, as a theme's (`--font-sans`). |
| `radius` | `square`, `standard` or `rounded` (`LOOK_RADII`, the `--radius` token). |
| `colorMode` | `auto` (each device chooses), `light` or `dark` (the instance forces it). |
| `showcase` | the background of the showcase pages — home, join, sign-in, error, not found; working pages stay plain: `none`, `logo` (a watermark, with its `size` in % of the short side and its `opacity`) or `picture` (a media laid by a background style, as a step's). |

The logo watermark is the logo's shape in the text's colour: QuizDock's mark
(`assets/default-mark.svg`, the logo without its square, drawn by luminance) while the
instance shows QuizDock's logo — bundled, or the same file in `branding/` —; an instance's
own logo by its outline, so a transparent one draws best.

## Where it lives

Kept in `instance_setting` under `look.interface`, changed through the `look.get`,
`look.set` and `look.reset` operations (category `look`, audited like every operation).
A font or a picture it names becomes one of the instance's media, never swept.

`/config.js` carries it resolved (`look`: files by URL, `linkDark`); `applyLook`
(`apps/frontend/src/lib/look.ts`) sets the tokens on the document before the first render.
A change shows from the next page each visitor opens.

## Light or dark

`lib/color-mode.ts` sets `.dark` on the document (the dark tokens of `index.css`). Unless
the instance forces a mode, a device follows its system, or what its person picked in the
account menu (*Appearance*: as the system, light, dark), kept in its `localStorage`
(`qd-color-mode`). The class is set before the first render and again on each page.

The live screens are never dark: a participant's pages (`/join…`) and the projection get
no `.dark`, and the miniatures of a big screen or a phone drawn inside the interface
(`ScaledStage`, the participant preview) carry `.light`, which restores the light tokens
under a dark page.

## Administration

Two spaces under *Instance*:

- **Branding**: the four identity settings (`APP_NAME`, `APP_LANG`, `APP_LOGO_URL`,
  `APP_FEEDBACK_URL`), each changed as the Settings page changes it.
- **Interface**: the look, light or dark included, saved as it changes.

Both beside a preview of five pages (home, join, sign-in, not found, my quizzes), light or
dark.

## Accessibility

Measured on the colours (`lookAccessibility`), never declared: white text on the main
colour 4.5:1; the main colour 3:1 on the light and on the dark page; links 4.5:1 on the
light page and, lightened, on the dark one. Only a look that passes every check says so.
