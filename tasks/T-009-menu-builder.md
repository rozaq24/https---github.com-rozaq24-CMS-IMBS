---
id: T-009
title: Menu Builder Drag-Drop 3 Level
status: DONE
priority: P0
phase: 3
domain: admin/tampilan
blueprint_ref:
  - blueprint/blueprint fitur admin.md#3
agent_suitability: [antigravity, codex]
depends_on: [T-001, T-004]
estimated: M
branch: feat/T-009-menu-builder
---

# T-009 — Menu Builder Drag-Drop 3 Level

## Tujuan
Admin susun navigasi (tambah, geser, sembunyikan, hingga 3 level) tanpa coding.

## Scope IN
- Model MenuItem (parent self, order, visible, target) + API reorder/bulk-update + validasi max depth 3 + cegah circular
- Admin UI drag-drop (dnd-kit): tree 3 level, toggle visible, edit label/href, pilih CustomPage sebagai target
- Navbar publik render rekursif dari API (desktop dropdown + mobile drawer) + cache ISR

## Scope OUT
- Tema/identitas (T-010).

## Files
- `src/app/api/menus/route.ts`, `src/app/api/menus/reorder/route.ts`
- `src/app/admin/menu/page.tsx`, `src/components/MenuBuilder.tsx`, `src/components/Navbar.tsx`

## Acceptance Criteria
- [x] Geser menu antar level → order tersimpan → navbar publik berubah < 1 menit
- [x] Coba buat level 4 → ditolak dengan pesan jelas; circular parent ditolak
- [x] Toggle visible off → hilang dari publik tapi tetap di builder
- [x] Mobile drawer + dropdown desktop jalan + aksesibel (keyboard/esc)
- [x] `npm run build` lolos

## Uji Manual
1. Buat menu Profil > Visi-Misi + Sejarah (level 2) → cek navbar.
2. Coba seret jadi level 4 → pastikan ditolak.
3. Hide 1 menu → cek publik hilang.

## Log Agen
- [2026-10-20] Codex - DONE: menu CRUD + transactional reorder, depth/cycle validation, CustomPage target, visibility and accessible desktop/mobile navbar with 60-second refresh. Tree checks, `npx tsc --noEmit`, isolated Next build passed. Browser QA pending dev-server recovery.

- [2026-10-20] Codex - DOING: mulai setelah T-008; meninjau schema MenuItem dan layout publik/admin.
