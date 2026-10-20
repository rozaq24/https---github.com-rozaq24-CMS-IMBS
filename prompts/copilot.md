# Prompt Siap-Pakai — Copilot (VS Code)

1. Buka folder `e:/CMS IMBS` di VS Code.
2. File `.github/muse-instructions.md` otomatis dibaca Copilot Chat — tidak perlu paste tiap kali.
3. Gunakan prompt di bawah di Copilot Chat (Ask/Agent mode).

## Lanjut task berikutnya

```
Baca AGENTS.md + tasks/TODO_INDEX.md + tasks/_SCHEMA.md.
Pilih 1 task TODO fase terkecil dan kerjakan sesuai file T-XXX-*.md (hanya scope IN + AC).
Update status + Log Agen di file task. Validasi prisma/build dan cantumkan hasilnya.
```

## Perintah cepat

- `/explain src/lib/auth.ts` — jelaskan guard RBAC sebelum ubah.
- `Kerjakan T-009 Menu Builder drag-drop 3 level, buat dnd-kit UI + API validasi depth, ikuti UI_GUIDE` — task spesifik.
- `/tests Buatkan test untuk POST /api/spmb` — setelah T-011.
- `/fix Build error pada ...` — tempel error build.
