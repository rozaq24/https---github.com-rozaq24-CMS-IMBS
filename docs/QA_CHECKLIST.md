# QA Checklist (diisi penuh di T-013 — template awal)

- [ ] Login SUPERADMIN / OPERATOR_BERITA / OPERATOR_SPMB / GURU
- [ ] Guard /admin/* redirect saat belum login; 403 saat role tidak cocok
- [ ] CRUD Post + publish + tampil di /berita
- [ ] Import Excel 100 baris (5 error) → preview benar
- [ ] SPMB daftar → verifikasi → statistik + CSV
- [ ] Menu drag-drop depth max 3 ditolak bila level 4
- [ ] 10 tema + dark mode persist
- [ ] Lighthouse homepage ≥ 85
