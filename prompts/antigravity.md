# Prompt Siap-Pakai — Antigravity

## Cara import
1. Buka Antigravity → Import workspace → pilih folder `e:/CMS IMBS`.
2. Pastikan file terlihat: `AGENTS.md`, `tasks/TODO_INDEX.md`, `tasks/_SCHEMA.md`, `prisma/schema.prisma`.
3. Paste prompt di bawah ke Antigravity Agent.

## Prompt utama

```
Ikuti AGENTS.md sebagai kontrak kerja.
Buka tasks/TODO_INDEX.md dan pilih 1 task TODO fase terkecil (P0 dulu).
Baca file task T-XXX-*.md + docs terkait + prisma/schema.prisma.
Buat Artifacts Plan berisi: files to create/edit, API contract, AC checklist.
Eksekusi hanya scope IN. Setiap selesai subtask, update checklist di file task.
Validasi: npx prisma validate (bila ubah schema) + npm run build.
Tutup dengan: ringkasan, file diubah, hasil validasi, dan status task (DOING/DONE/BLOCKED) + Log Agen.
Jangan ubah folder blueprint/.
```

## Prompt desainer UI (khusus T-010/T-012)

```
Kerjakan task UI sesuai file T-XXX. Ikuti docs/UI_GUIDE.md (Golden Ratio φ=1.618 + referensi reactbits.dev).
Gunakan CSS variables tema + dark mode. Pastikan kontras, skeleton loading, empty/error state.
Sertakan screenshot/deskripsi visual per halaman di Log Agen.
```
