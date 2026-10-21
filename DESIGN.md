<!-- echo-ui:start -->
<!-- written by echo-ui-cli 0.3.2 from seed {"accent":"#047857","chassis":"#f8fafc","paper":"#10212c"} -->
# Design

This project's interface is **Echo UI**: tactile React components in `src\components\echo/`, on the grammar in the `echo-ui-core` package. This file is its look in Echo's terms. **In this codebase, build with those components; don't rebuild them from this file.** `npx echo-ui-cli which "<the job>"` names the part for a job, `npx echo-ui-cli docs <name>` shows it.

## Overview

A device, not a skin: light molded plastic lit by one key light from the upper left, screens of paper glass printed in ink, keys that travel when pressed. The grammar is fixed (the light, what each material is for, state without hue, motion as physics, sound as feedback, WCAG 2.2 AA). The vocabulary below (colour, type, radius, density, finish) comes from this project's seed, and its pale or dark chassis makes this a light device.

## Colors

| Role | Value | For |
| --- | --- | --- |
| `--echo-surface` | #f8fafc | The molded chassis base. |
| `--echo-cap` | #fbfdff | Neutral button-cap plastic. |
| `--echo-cap-highlight` | #fefeff | The lit top rim of a bevel. |
| `--echo-cap-shadow` | #d6d9dd | A cap's underside and side wall. |
| `--echo-well` | #eef0f2 | Recesses: the shade a cap sits in. |
| `--echo-accent` | #238866 | The one saturated colour — emissive marks: LEDs, LCD digits, the lit rail. |
| `--echo-accent-highlight` | #96b9a3 | Top-lit gloss on an active cap. |
| `--echo-accent-pressed` | #1b6d51 | The pressed or recording accent. |
| `--echo-accent-glow` | #3f9a78 | What's lit: an LED, the current rail. On a light device, 3:1 on every ground. |
| `--echo-accent-ink` | #1a664c | What's lit, printed: a readout, a count, a current tab's text, and the focus ring. The glow on a dark device, a step deeper on a light one; AA on every ground. |
| `--echo-primary-cap-top` | #2a8464 | Top of the primary cap's gradient. Guaranteed AA against its label, primary-cap-ink. |
| `--echo-primary-cap-mid` | #227659 | Middle of the primary cap's gradient. |
| `--echo-primary-cap-base` | #175e46 | Base of the primary cap's gradient. |
| `--echo-primary-cap-ink` | #fefeff | The label on the primary cap: the text on a dark device, near-white on a light one. |
| `--echo-pour-top` | #97c2af | The liquid a cap or slider fills with, under a label that also sits on the unlit plastic. AA against text. |
| `--echo-pour-mid` | #71b196 | Middle of the pour. |
| `--echo-pour-base` | #3e9877 | Base of the pour. |
| `--echo-accent-fill-top` | #298162 | A bright accent fill that carries dark text. Emitted for your own use; no component paints it. |
| `--echo-accent-fill-base` | #19654b | Base of that fill. |
| `--echo-lcd` | #f1f3f5 | The screen field: dark glass, or paper glass on a light device. |
| `--echo-lcd-glow` | #f1f3f5 | Emissive tint on the screen. |
| `--echo-text` | #10212c | Primary text. |
| `--echo-text-dim` | #455864 | Secondary text. Still AA on every ground it is used on. |
| `--echo-seam` | #c4c6c7 | Panel seams and the darkest hairline. |

One saturated colour, with two jobs only: a lit cap (the primary action, the current page) and what's lit (LEDs, the rail), with the text it lights and the focus ring printed in the accent's ink (screen digits, a current tab). A state is said in words and shape, never by hue: there's no success green or danger red.

## Typography

- `--echo-font-machine`: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif
- `--echo-font-sans`: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif
- `--echo-font-mono`: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace
- `--echo-font-lcd`: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace
- Text styles, as `font: var(--echo-type-<style>)`: machine-label, body, body-sm, caption, heading, readout, display.

## Layout

- Spacing, `--echo-space-1` to `--echo-space-12`: 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32, 64px, at density `default`.
- Control heights: compact 32px, default 44px, large 60px. No target is smaller than 24×24px.
- Breakpoints: 560px, 640px, 900px, 1100px.

## Elevation & Depth

Raised parts catch light on their top edge and cast a shadow below; recessed parts are shaded at the top and lit at the bottom lip. Take a recipe, never a shadow written by hand:

- `--echo-shadow-well`: Set into the body: a field, a tray, the bed a cap sits in.
- `--echo-shadow-well-screen`: The glass of a screen or a readout.
- `--echo-shadow-well-deep`: A deep bezel: a large screen, a keypad's window.
- `--echo-shadow-groove`: A track cut into the body, for progress and levels.
- `--echo-shadow-edge`: Light catching the top edge of a small raised part.
- `--echo-shadow-hairline`: The lit lip under a divider.
- `--echo-shadow-chip`: A small raised part: a badge, a count.
- `--echo-shadow-key`: A low key standing on its seam.
- `--echo-shadow-cap`: A molded cap at rest.
- `--echo-shadow-cap-lit`: The lit cap, the one place the hardware turns accent.
- `--echo-shadow-panel`: A panel resting on the body.
- `--echo-shadow-lifted`: A panel lifted off the body, the way a card rises under the pointer.
- `--echo-shadow-chassis`: The device's own body.
- `--echo-shadow-tooltip`: A tooltip, the lowest thing that floats.
- `--echo-shadow-popover`: A popover or a small popup.
- `--echo-shadow-toast`: An announcement floating over the page.
- `--echo-shadow-modal`: A dialog, the highest thing that floats.
- `--echo-shadow-ring`: Keyboard focus around a raised part: a gap in the body's colour, then the accent's ink (the glow, on a dark device).
- `--echo-shadow-ring-inset`: Keyboard focus inside a well, where a ring outside would sit on the rim.
- `--echo-shadow-glow`: The glow of something lit: the current tab, the page you're on.

## Shapes

- Radius, `--echo-radius-*`: xs 2px, sm 6px, md 9px, lg 12px, xl 14px, 2xl 18px, 3xl 22px, full 999px, at this seed's radius 0.5 (0 crisp, 1 soft). Buttons and segments follow the radius (`pills`).
- Finish 0.5 (0 matte, 1 glossy): how brightly edges shine and how deep shadows fall.

## Motion

- Durations, `--echo-duration-*`: glitch 80ms, press 90ms, tick 120ms, swap 160ms, glide 190ms, sweep 220ms, pop 400ms, flood 700ms, each with its `--echo-ease-*`.
- Controls acknowledge you quickly; things that arrive and leave take a little longer; glass moves smoothly, pixels move in steps. Anything the hand can redirect moves on a spring. Under reduced motion, movement collapses to a fade or stops.

## Sound

- 9 tokens: tap, press, release, select, transition, notify, caution, error, celebrate. Dry and short, like a device. It confirms what you can see and never carries anything on its own; it starts muted until the person turns it on.

## Components

Installed here: hardware-button, size. `npx echo-ui-cli which` names the rest by job.

## Do's and Don'ts

- Do use Echo's component for every job it has, and build what it lacks from Echo's parts, styled only with `var(--echo-*)`.
- Do keep one primary action per form or dialog, and put anything destructive behind a confirmation that names what happens.
- Do: every control has a name: `label`, `aria-label` or `aria-labelledby` (the types require it).
- Do: a form error goes in words, in the field's `error`; never colour alone.
- Do: announce with `toast()` from `useToast()`, under one `<Toaster>`.
- Do: never remove a focus ring, shrink a target below 24×24px, or put `aria-hidden` on something focusable.
- Don't write a colour, a shadow, a spacing or a duration by hand; don't restyle Echo from outside (a `className` it doesn't take, CSS aimed at `.echo-…`); don't show a state with colour alone.
- Don't mix another component library into an Echo screen. After changing UI, run `npx echo-ui-cli check`.
<!-- echo-ui:end -->
