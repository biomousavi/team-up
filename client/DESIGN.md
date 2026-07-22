# TeamUp Design System — Patch Bay / Electric Signal

TeamUp is a full-mesh peer-to-peer WebRTC meeting app. The visual identity is
a **patch bay** — an analog switchboard, the real-world analog for direct
peer connections. The palette is "Electric Signal": a vivid signal-cable blue
as the one interactive color, amber as the single live accent, on a
warm-charcoal console.

## Tokens

All colors are Vuetify theme tokens (`client/src/plugins/vuetify.ts`). Use them
via Vuetify props (`color="primary"`), utility classes (`bg-surface`,
`text-medium-emphasis`), or the CSS var `rgb(var(--v-theme-<token>))`.

| Token | Dark | Light | Role |
|---|---|---|---|
| `background` | `#141216` | `#ECEDEA` | app ground |
| `surface` | `#1E1B21` | `#F7F6F3` | cards, panels, meeting chrome |
| `surface-variant` | `#2A262F` | `#E3E0D9` | insets, tooltips, menus |
| `on-surface` | `#EDEAE4` | `#1A181C` | text / icons |
| `on-surface-variant` | `#D8D3CB` | `#3A363C` | text on surface-variant (tooltips) |
| `primary` | `#3D7EFF` | `#2F5FE0` | interactive: buttons, links, active nav, focus |
| `accent` | `#E0A94A` | `#B47E27` | the live-tile ring + dot only |
| `secondary` | `#423D48` | `#C9C3B8` | reserved neutral — never use directly |
| `success` | `#3FA96A` | `#2E8F55` | mic/cam on |
| `error` | `#E0523B` | `#C6412C` | leave, errors |

## The usage law

- **Surfaces** form an elevation ladder: page = `background`; panels/cards =
  `surface`; insets, tooltips, menus, dialogs = `surface-variant`.
- **Content** is `on-surface`, dimmed with `text-medium-emphasis` /
  `text-disabled` — never a raw grey.
- **`primary`** is the only color that means "clickable": buttons, links,
  active nav, focus rings. Nothing decorative gets it.
- **`accent`** appears in exactly one place per screen — the live-tile ring
  and its dot. It is its own token, never `secondary`, so it can't leak.
- **Status** (`success`, `error`) encodes state only — never decoration.
- **`secondary`** exists so Vuetify has the slot; never reference it in app code.

## Adding a color

Add the key (and its `on-<key>` companion) to *both* theme blocks in
`vuetify.ts`. Vuetify auto-generates `bg-<key>`, `text-<key>`, `border-<key>`
and `color="<key>"`. Then document it here. Don't hard-code hex anywhere else.
