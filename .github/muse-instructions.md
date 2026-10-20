# Copilot Instructions — CMS IMBS (dibaca otomatis oleh Muse Chat)

Ikuti `AGENTS.md` sebagai kontrak utama.

- Sumber kebenaran: `blueprint/`, `tasks/TODO_INDEX.md`, `tasks/T-*.md`, `docs/`, `prisma/schema.prisma`.
- Stack: Next.js 14 App Router + TS + Tailwind + Prisma (SQLite dev/Postgres prod) + NextAuth Credentials + TipTap + Zod + xlsx.
- Roles: SUPERADMIN, OPERATOR_BERITA, OPERATOR_SPMB, GURU, WALI_READONLY. Guard semua `/admin/*` + API mutasi.
- UI: Golden Ratio (φ=1.618) + referensi reactbits.dev. Lihat `docs/UI_GUIDE.md`. Bahasa UI Indonesia.
- Cara kerja: 1 task = 1 branch `feat/T-XXX-slug`. Update `status` + `Log Agen` di file task. Jangan kerjakan di luar Scope IN.
- Validasi: `npx prisma validate` bila ubah schema; `npm run build` untuk task besar; cantumkan hasil di Log Agen.
- Jangan buat file di luar `Files` yang tertera di task kecuali util kecil yang dibutuhkan (catat di log).
- Jangan ubah `blueprint/`. Jangan hardcode secret — pakai `.env`.
