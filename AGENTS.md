# AGENTS.md — CMS IMBS (Agent-Agnostic Workspace)

> File ini adalah **kontrak kerja** untuk SEMUA AI agent: Codex, Antigravity, Copilot, Cline, Cursor, dll.
> Tujuannya: user bisa pindah-pindah agent tanpa kehilangan konteks.

## 1. Sumber Kebenaran (Source of Truth)

1. `blueprint/blueprint fitur admin.md` — fitur Admin (5 modul).
2. `blueprint/blueprint fitur front end.md` — fitur Front-End (5 kategori + UI rules).
3. `tasks/TODO_INDEX.md` — daftar tugas resmi + urutan eksekusi.
4. `tasks/_SCHEMA.md` — skema/format file todo. JANGAN ubah format tanpa diskusi.
5. `docs/` — arsitektur, data model, UI guide.
6. `prisma/schema.prisma` — skema database resmi.

Aturan: kalau ada konflik, urutan prioritas: blueprint > TODO_INDEX > docs > kode.

## 2. Tech Stack (Jangan Ganti Tanpa Izin)

- **Framework:** Next.js 14 App Router + TypeScript + React 18
- **Styling:** TailwindCSS + CSS variables untuk tema (10 warna + dark mode)
- **DB:** Prisma ORM + SQLite (dev) / Postgres (prod via `DATABASE_URL`)
- **Auth:** NextAuth.js (Credentials) + Role: `SUPERADMIN, OPERATOR_BERITA, OPERATOR_SPMB, GURU, WALI_READONLY`
- **Editor:** TipTap (visual editor) untuk Post & Custom Pages
- **Upload:** `/public/uploads` (dev), siap pindah ke S3
- **UI Ref:** https://reactbits.dev/components + Golden Ratio untuk button/table/warna/font
- **Validasi:** Zod. **Import Excel:** xlsx. **Log:** SystemLog (login, IP, MAC, aktivitas).

## 3. Cara Kerja Wajib (Semua Agent)

1. **Baca dulu sebelum coding:**
   - `tasks/TODO_INDEX.md` → pilih 1 task `TODO` paling prioritas.
   - File task `tasks/T-XXX-*.md` → pahami Acceptance Criteria + Files.
   - File terkait di `docs/` + `prisma/schema.prisma`.
2. **Satu task = satu branch + satu PR:**
   - Branch: `feat/T-XXX-slug` atau `fix/T-XXX-slug`.
   - Jangan kerjakan 2 task sekaligus dalam 1 branch.
3. **Update status task di file-nya:**
   - `TODO` → `DOING` saat mulai, → `DONE` + bukti test saat selesai.
   - Tulis `Log Agen` di bawah file task: nama agent, tanggal, ringkasan.
4. **Validasi sebelum DONE:**
   - `npm run lint` (atau `npx tsc --noEmit` bila lint belum ada)
   - `npx prisma validate` bila ubah schema
   - `npm run build` untuk task UI/API besar
   - Cantumkan hasil di Log Agen.
5. **Jangan:**
   - Menghapus/rename folder `blueprint/`, `tasks/`, `docs/`, `prompts/`.
   - Membuat stack baru (mis. ganti ke Laravel/Vue) tanpa persetujuan user.
   - Hardcode secret. Gunakan `.env` (`DATABASE_URL`, `NEXTAUTH_SECRET`).

## 4. Konvensi Kode

- App Router: `src/app/(public)/...` untuk publik, `src/app/admin/...` untuk admin (guard role).
- Komponen: `src/components/ui/*` (Button, Table, Card, Badge — ikut Golden Ratio).
- Lib: `src/lib/db.ts`, `src/lib/auth.ts`, `src/lib/theme.ts`, `src/lib/validators.ts`.
- API: `src/app/api/.../route.ts` (REST, return JSON + Zod).
- Bahasa UI: Indonesia. Komentar kode: Indonesia singkat.
- Golden Ratio: gunakan variabel `--ratio: 1.618` dan utilitas di `src/app/globals.css`.

## 5. Cara Lanjut di Tiap Agent

- **Codex CLI:** `codex "Lanjutkan T-002 sesuai tasks/T-002-*.md, baca AGENTS.md dulu"` atau lihat `prompts/codex.md`.
- **Antigravity:** import workspace ini, pilih task di `tasks/TODO_INDEX.md`, ikuti Artifacts Plan. Lihat `prompts/antigravity.md`.
- **Copilot (VS Code):** buka repo, baca `.github/muse-instructions.md` + `prompts/copilot.md`, lalu `/fix` atau Chat: "kerjakan T-00X".

## 6. Definition of Done Global

Task dianggap DONE jika: Acceptance Criteria terpenuhi, tidak merusak build, status + log diupdate, dan file yang dijanjikan ada.

<!-- echo-ui:start -->
<!-- written by echo-ui-cli 0.3.2 -->
## Echo UI

This project's UI is built with Echo: tactile React components copied into `src\components\echo/` (see `echo.json`), on the grammar in the `echo-ui-core` package.

- Use Echo's component for every job it has. Never imitate one with raw elements or its classes.
- Before using a component, ask: `npx echo-ui-cli which "<the job>"`, then `npx echo-ui-cli docs <name>`. Add one with `npx echo-ui-cli add <name>`.
- Set up once: import `src\components\echo/echo-theme.css` from the root layout or global CSS, give `body` `background: var(--echo-well); color: var(--echo-text); font-family: var(--echo-font-sans)`, wrap the app in `SoundProvider` from `echo-ui-core/sound`, and put `<EchoCheck />` from `echo-ui-core/check` in the root layout.
- Style only with `var(--echo-*)`. Never write a colour value: the theme sets them all.
- The packages are `echo-ui-cli` and `echo-ui-core`. There is no `echo-ui` or `echoui` package: never install one.
- Accessibility: every control has a name: `label`, `aria-label` or `aria-labelledby` (the types require it).
- Accessibility: a form error goes in words, in the field's `error`; never colour alone.
- Accessibility: announce with `toast()` from `useToast()`, under one `<Toaster>`.
- Accessibility: never remove a focus ring, shrink a target below 24×24px, or put `aria-hidden` on something focusable.
- Building a screen? Read `DESIGN.md` (its look and decisions), then follow `.claude/skills/echo-ui/SKILL.md`. Every choice comes from a decision, Echo's default or the builder: when unsure, ask the builder.
- A look of its own: a moodboard becomes a style with `.claude/skills/echo-design-eye/SKILL.md`, Style Fit picks one with `.claude/skills/echo-style-fit/SKILL.md`; `npx echo-ui-cli style set <setting> <value>` moves one setting.
- After changing UI, run `npx echo-ui-cli check`, then `npx echo-ui-cli test` with the app running, and fix what they find. Only the builder keeps a slop-police finding.
<!-- echo-ui:end -->
