# Prompt Siap-Pakai — Codex CLI

Copy-paste ke terminal Codex dari root repo `e:/CMS IMBS`:

```bash
codex "Baca AGENTS.md, tasks/TODO_INDEX.md, dan tasks/_SCHEMA.md. Lanjutkan 1 task TODO prioritas tertinggi (fase terkecil). Ubah status jadi DOING + isi Log Agen. Ikuti Acceptance Criteria dan Files di file task. Jangan ubah blueprint/. Validasi: npx prisma validate (jika ubah schema) dan npm run build. Update checklist + status DONE bila lolos."
```

## Lanjut task spesifik

```bash
codex "Kerjakan T-003 sesuai tasks/T-003-post-crud.md. Baca AGENTS.md dulu. Buat branch feat/T-003-post-crud. Hanya scope IN. Update Log Agen."
```

## Review silang (Codex sebagai reviewer)

```bash
codex "Review diff branch aktif terhadap tasks/T-XXX dan docs/. Cek: AC terpenuhi? RBAC aman? Zod dipakai? Golden Ratio diikuti? Tulis temuan sebagai checklist di REVIEW.md, jangan auto-commit."
```
