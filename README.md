# CMS IMBS — Website Sekolah (Next.js + Prisma)

Ikuti **`AGENTS.md`** dulu sebelum coding. Semua task resmi ada di **`tasks/TODO_INDEX.md`**.

## Status Sekarang
- ✅ T-001 scaffold (fondasi) dibuat — status DOING, tinggal `npm install` + validasi.
- ▶️ Berikutnya: **T-002 RBAC + Users + SystemLog**.

## Mulai (5 menit)
```bash
npm install
cp .env.example .env   # Windows: copy .env.example .env
npx prisma db push
npx prisma db seed     # setelah T-013 (sekarang seed minimal sudah ada)
npm run dev            # buka http://localhost:3000 dan /admin
```

## Struktur Penting
- `blueprint/` — acuan fitur (jangan diubah)
- `tasks/` — 13 file todo lintas-agent (T-001..T-013) + `_SCHEMA.md`
- `prompts/` — prompt siap-pakai Codex / Antigravity / Copilot
- `docs/` — ARCHITECTURE, DATA_MODEL, UI_GUIDE
- `prisma/schema.prisma` — 18 tabel (User..SystemLog)
- `src/app/(public)` — halaman publik, `src/app/admin` — area admin (guard middleware)

## Lanjut dengan Agent Lain
- **Codex:** lihat `prompts/codex.md`
- **Antigravity:** lihat `prompts/antigravity.md`
- **Copilot:** `.github/muse-instructions.md` + `prompts/copilot.md`
