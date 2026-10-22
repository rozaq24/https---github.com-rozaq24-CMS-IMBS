import { db } from "../src/lib/db";
import { FAQ } from "../src/lib/faq";
import { DEFAULT_PUBLIC_MENU } from "../src/lib/menus";
import bcrypt from "bcryptjs";
import { stat } from "fs/promises";
import { join } from "path";

async function main() {
  const passwordHash = await bcrypt.hash("ImbsDemo!2026", 10);
  const users = [
    ["admin@sekolah.sch.id", "Super Admin", "SUPERADMIN"],
    ["operator.berita@sekolah.sch.id", "Operator Berita", "OPERATOR_BERITA"],
    ["operator.spmb@sekolah.sch.id", "Operator SPMB", "OPERATOR_SPMB"],
    ["guru@sekolah.sch.id", "Guru Demo", "GURU"],
    ["wali@sekolah.sch.id", "Wali Demo", "WALI_READONLY"],
  ] as const;
  const admin = await db.user.upsert({ where: { email: users[0][0] }, update: { name: users[0][1], role: users[0][2], passwordHash, active: true }, create: { email: users[0][0], name: users[0][1], role: users[0][2], passwordHash } });
  for (const [email, name, role] of users.slice(1)) await db.user.upsert({ where: { email }, update: { name, role, passwordHash, active: true }, create: { email, name, role, passwordHash } });

  const settings = [
    ["site.theme", "emerald"],
    ["site.identity", JSON.stringify({ siteTitle: "CMS IMBS", description: "Informasi profil, berita, dan layanan sekolah IMBS.", keywords: "IMBS, sekolah, pendidikan", logo: "", favicon: "", address: "", phone: "", email: "", mapUrl: "", facebook: "", instagram: "", youtube: "" })],
    ["site.faq", JSON.stringify(FAQ)],
  ];
  for (const [key, value] of settings) await db.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } });

  const demoGreeting = "Selamat datang di ruang digital IMBS. Di sini, keluarga sekolah dapat mengenal perjalanan belajar, karya, dan kegiatan murid.\n\nKami percaya pendidikan tumbuh melalui ilmu, adab, rasa ingin tahu, dan kepedulian. Setiap hari adalah kesempatan untuk mencoba, bertanya, lalu belajar dari prosesnya.\n\nMari berjalan bersama membangun lingkungan yang mendukung setiap murid bertumbuh. Contoh sambutan ini disediakan untuk meninjau tampilan dan perlu disesuaikan dengan pesan resmi sekolah.";
  await db.greeting.upsert({ where: { id: 1 }, update: {}, create: { id: 1, title: "Sambutan Kepala Sekolah", body: demoGreeting, principalName: "Kepala Sekolah" } });
  const greeting = await db.greeting.findUnique({ where: { id: 1 } });
  if (greeting?.body === "Selamat datang di website resmi sekolah IMBS. Mari belajar, berkarya, dan tumbuh bersama." || greeting?.body === "Selamat datang.") {
    await db.greeting.update({ where: { id: 1 }, data: { body: demoGreeting } });
  }
  const pages = [
    ["visi-misi", "Visi dan Misi", "<h2>Visi</h2><p>Mewujudkan peserta didik yang berilmu, berkarakter, dan siap berkontribusi.</p><h2>Misi</h2><p>Menyelenggarakan pembelajaran yang aman, terarah, dan mendorong potensi setiap murid.</p>"],
    ["sejarah", "Sejarah Sekolah", "<p><strong>Materi demo untuk evaluasi desain.</strong> Kronologi berikut adalah contoh struktur cerita, bukan catatan sejarah resmi IMBS.</p><h2>Berangkat dari cita-cita pendidikan</h2><p>Sebuah sekolah tumbuh dari harapan keluarga dan pendidik: menghadirkan ruang belajar yang merawat ilmu, adab, dan rasa ingin tahu. Bab pembuka ini dapat diisi dengan kisah pendirian serta nilai yang menjadi pijakan sekolah.</p><h2>Belajar bersama masyarakat</h2><p>Perjalanan sekolah juga dibentuk oleh murid, guru, keluarga, dan lingkungan sekitar. Tambahkan peristiwa penting, perubahan program, serta cerita kebersamaan yang telah diverifikasi.</p><h2>Melangkah ke masa depan</h2><p>Gunakan bagian ini untuk menjelaskan arah pengembangan sekolah dan cita-cita yang ingin dicapai bersama. Lengkapi dengan tahun, nama, dan dokumentasi resmi sebelum dipublikasikan.</p>"],
    ["kontak", "Kontak", "<p>Hubungi sekolah melalui informasi kontak resmi pada footer atau kirim pesan melalui formulir pengaduan.</p>"],
    ["budaya-belajar", "Budaya Belajar", "<p><strong>Contoh konten:</strong> kebiasaan belajar yang hidup hadir lewat rasa ingin tahu, percakapan yang saling menghargai, dan keberanian mencoba.</p><h2>Membaca dengan rasa ingin tahu</h2><p>Murid memilih bacaan, mengajukan pertanyaan, dan berbagi bagian yang mengubah cara pandangnya.</p><h2>Membuat gagasan menjadi karya</h2><p>Diskusi, eksperimen, dan proyek kelompok membantu murid menguji ide serta menjelaskan prosesnya.</p><h2>Belajar dari refleksi</h2><p>Di akhir kegiatan, murid meninjau hal yang berhasil dan menentukan langkah berikutnya. Sesuaikan contoh ini dengan praktik belajar resmi sekolah.</p>"],
    ["fasilitas-sekolah", "Fasilitas Sekolah", "<p><strong>Data demo untuk review:</strong> susunan ruang berikut menunjukkan cara fasilitas dapat diperkenalkan. Nama, foto, akses, dan jadwal wajib diperiksa oleh pengelola sekolah.</p><h2>Perpustakaan</h2><p>Ruang membaca dan mencari referensi untuk mendukung rasa ingin tahu murid.</p><h2>Ruang belajar dan laboratorium</h2><p>Tempat untuk berdiskusi, mengerjakan proyek, dan mengamati konsep secara langsung.</p><h2>Ruang bersama</h2><p>Area kegiatan untuk presentasi, latihan, dan pertemuan warga sekolah. Tambahkan petunjuk akses dan jam penggunaan yang sudah dikonfirmasi.</p>"],
    ["layanan-murid", "Layanan Murid", "<p>Ringkasan contoh layanan yang membantu murid dan keluarga menemukan informasi sekolah.</p><ul><li>Informasi kegiatan dan agenda sekolah.</li><li>Pusat unduhan formulir dan dokumen.</li><li>Formulir pesan untuk pertanyaan atau masukan.</li></ul><p>Konten ini adalah data demo dan perlu ditinjau sebelum digunakan sebagai informasi resmi.</p>"],
  ] as const;
  const previousDemoCopy: Record<string, string> = {
    sejarah: "<p>Halaman demo ini menunggu riwayat resmi sekolah dari pengelola. Ganti konten contoh melalui menu halaman di admin.</p>",
    "budaya-belajar": "<p>Contoh halaman untuk meninjau informasi kegiatan belajar, kebiasaan membaca, dan kerja kelompok. Ganti seluruh isi dengan kebijakan resmi sekolah sebelum situs dipublikasikan.</p><h2>Belajar bersama</h2><p>Murid berlatih menyampaikan gagasan, bertanya, dan menyelesaikan tugas secara bertahap. Guru mendampingi proses belajar sesuai kebutuhan kelas.</p><h2>Ruang yang mendukung</h2><p>Perpustakaan, ruang kelas, dan kegiatan bersama menjadi contoh ruang belajar yang dapat diperkenalkan pada halaman ini.</p>",
    "fasilitas-sekolah": "<p>Halaman contoh fasilitas sekolah untuk kebutuhan review tampilan. Sesuaikan nama ruang, foto, dan jam penggunaan berdasarkan data resmi.</p><h2>Ruang belajar</h2><p>Informasi ruang kelas, laboratorium, perpustakaan, dan fasilitas pendukung dapat dijelaskan di sini.</p><h2>Layanan murid</h2><p>Tambahkan petunjuk akses, jadwal layanan, serta narahubung yang sudah diverifikasi oleh pengelola.</p>",
  };
  for (const [slug, title, content] of pages) {
    const page = await db.customPage.upsert({ where: { slug }, update: {}, create: { slug, title, content, showInMenu: true } });
    if (previousDemoCopy[slug] === page.content) await db.customPage.update({ where: { id: page.id }, data: { content } });
  }

  const posts = [
    ["kegiatan-belajar", "Kegiatan Belajar di Sekolah", "Berita", "Murid mengikuti kegiatan pembelajaran dan diskusi di kelas."],
    ["pengumuman-akademik", "Pengumuman Akademik", "Pengumuman", "Periksa informasi akademik terbaru melalui kanal resmi sekolah."],
    ["agenda-kegiatan", "Agenda Kegiatan Sekolah", "Agenda", "Jadwal kegiatan sekolah akan diperbarui pada halaman agenda."],
    ["karya-murid", "Karya dan Kreativitas Murid", "Artikel", "Sekolah mendukung murid untuk terus berkarya dan berbagi."],
    ["kegiatan-literasi", "Mendorong Budaya Literasi", "Berita", "Kegiatan literasi menjadi bagian dari pengalaman belajar murid."],
    ["informasi-layanan", "Informasi Layanan Sekolah", "Pengumuman", "Gunakan halaman layanan untuk menemukan informasi yang tersedia."],
    ["belajar-bersama", "Belajar dan Tumbuh Bersama", "Artikel", "Lingkungan belajar yang baik membantu murid mengembangkan potensinya."],
    ["kabar-sekolah", "Kabar Sekolah IMBS", "Berita", "Berita demo ini dapat diganti oleh operator berita melalui admin."],
    ["kelas-kolaboratif", "Belajar Lewat Proyek Kolaboratif", "Berita", "Contoh kegiatan kelas untuk melihat tampilan berita dengan ringkasan yang lebih lengkap. Murid menyusun gagasan, membagi tugas, lalu mempresentasikan hasilnya bersama."],
    ["pekan-literasi", "Pekan Literasi dan Karya Murid", "Artikel", "Contoh artikel tentang kebiasaan membaca, diskusi buku, dan karya tulis murid. Konten ini disediakan untuk review layout dan dapat diganti dari dashboard admin."],
    ["informasi-spmb-2027", "Informasi Penerimaan Murid Baru", "Pengumuman", "Informasi penerimaan untuk tahun ajaran berikutnya masih berupa contoh. Periksa jadwal, persyaratan, dan kontak resmi sebelum mengumumkannya kepada calon keluarga."],
    ["agenda-kelas-terbuka", "Kelas Terbuka untuk Keluarga", "Agenda", "Contoh agenda pertemuan keluarga dan guru. Waktu dan lokasi final akan diumumkan oleh sekolah melalui kanal resminya."],
  ] as const;
  const demoPostCovers = [
    ["kegiatan-belajar", "photo-1509062522246-3755977927d7", "/brand/stories/ruang-belajar.svg"],
    ["pengumuman-akademik", "photo-1523050854058-8df90110c9f1", "/brand/stories/karya-murid.svg"],
    ["agenda-kegiatan", "photo-1505373877841-8d25f7d46678", "/brand/stories/kolaborasi.svg"],
    ["karya-murid", "photo-1516321318423-f06f85e504b3", "/brand/stories/karya-murid.svg"],
    ["kegiatan-literasi", "photo-1507842217343-583bb7270b66", "/brand/stories/perpustakaan.svg"],
    ["informasi-layanan", "photo-1524178232363-1fb2b075b655", "/brand/stories/ruang-belajar.svg"],
    ["belajar-bersama", "photo-1427504494785-3a9ca7044f45", "/brand/stories/kolaborasi.svg"],
    ["kabar-sekolah", "photo-1523240795612-9a054b0db644", "/brand/stories/ruang-belajar.svg"],
    ["kelas-kolaboratif", "photo-1531482615713-2afd69097998", "/brand/stories/kolaborasi.svg"],
    ["pekan-literasi", "photo-1516979187457-637abb4f9353", "/brand/stories/perpustakaan.svg"],
    ["informasi-spmb-2027", "photo-1503676260728-1c00da094a0b", "/brand/stories/karya-murid.svg"],
    ["agenda-kelas-terbuka", "photo-1517486808906-6ca8b3f04846", "/brand/stories/menulis.svg"],
  ] as const;
  const postCoverBySlug = new Map(demoPostCovers.map(([slug, , cover]) => [slug, cover]));
  for (let index = 0; index < posts.length; index++) {
    const [slug, title, type, excerpt] = posts[index];
    const publishedAt = index < 8
      ? new Date(Date.UTC(2026, 0, 5 + index))
      : new Date(Date.UTC(2026, 9, 5 + index - 8));
    await db.post.upsert({
      where: { slug },
      update: index >= 8 ? { publishedAt } : {},
      create: { slug, title, type: type.toUpperCase(), excerpt, content: `<p>${excerpt}</p>`, cover: postCoverBySlug.get(slug) || "/brand/stories/ruang-belajar.svg", status: "PUBLISHED", publishedAt, authorId: admin.id },
    });
  }

  for (const [slug, oldImageId, cover] of demoPostCovers) {
    const post = await db.post.findUnique({ where: { slug }, select: { id: true, cover: true } });
    if (post?.cover?.startsWith("https://picsum.photos/seed/imbs-") || post?.cover?.startsWith(`https://images.unsplash.com/${oldImageId}?`)) {
      await db.post.update({ where: { id: post.id }, data: { cover } });
    }
  }

  const demoArticles = {
    "kelas-kolaboratif": "<p>Contoh liputan untuk melihat bagaimana berita kegiatan dapat dibaca dengan nyaman di layar besar maupun ponsel. Murid membentuk kelompok kecil, memilih pertanyaan, lalu menyepakati cara untuk mencari jawabannya.</p><h2>Belajar dari proses</h2><p>Setiap kelompok membagi peran, membuat catatan, dan membandingkan temuan. Guru mendampingi diskusi agar setiap anggota mendapat ruang untuk menyampaikan gagasan.</p><h2>Membagikan hasil</h2><p>Di akhir kegiatan, murid mempresentasikan proses dan hasil kerja mereka. Naskah ini merupakan data demo untuk evaluasi desain dan perlu diganti dengan liputan resmi sekolah.</p>",
    "pekan-literasi": "<p>Contoh artikel untuk meninjau tampilan berita panjang. Pekan Literasi mengajak murid menikmati buku, berdiskusi, dan merayakan karya tulis yang lahir dari rasa ingin tahu.</p><h2>Membaca dengan tujuan</h2><p>Murid memilih bacaan, menandai bagian yang menarik, lalu berbagi pertanyaan dengan teman. Percakapan sederhana membantu mereka melihat satu cerita dari sudut pandang berbeda.</p><h2>Karya tumbuh dari cerita</h2><p>Setelah membaca, murid mencoba menulis ulasan, puisi, atau cerita pendek. Naskah dan agenda ini bersifat demo; tanggal, tempat, serta dokumentasi harus disesuaikan dengan kegiatan resmi.</p>",
    "informasi-spmb-2027": "<p>Contoh pengumuman untuk menampilkan materi informasi penerimaan. Informasi berikut belum menjadi ketentuan pendaftaran resmi.</p><h2>Yang perlu disiapkan</h2><p>Calon keluarga dapat menyiapkan identitas calon murid, dokumen pendukung, dan pertanyaan untuk tim penerimaan. Daftar dokumen dan jadwal final akan ditetapkan oleh sekolah.</p><h2>Ikuti kanal resmi</h2><p>Perbarui tanggal pendaftaran, biaya, kuota, persyaratan, dan kontak dari pengelola sebelum pengumuman ini dipublikasikan.</p>",
  } as const;
  for (const [slug, content] of Object.entries(demoArticles)) {
    const post = await db.post.findUnique({ where: { slug }, select: { id: true, excerpt: true, content: true } });
    if (post && post.content === `<p>${post.excerpt}</p>`) await db.post.update({ where: { id: post.id }, data: { content } });
  }

  const major = await db.major.upsert({ where: { code: "DEMO" }, update: {}, create: { code: "DEMO", name: "Program Contoh", desc: "Ganti informasi demo ini dengan program resmi sekolah." } });
  const teacher = await db.teacher.upsert({ where: { nip: "DEMO-GURU-001" }, update: { position: "Guru Pendamping", subjects: "Pendampingan belajar dan pengembangan karakter", education: "S.Pd. · data demo", experience: "Mendampingi proyek belajar lintas bidang · data demo", photo: "/brand/faculty/guru-demo.svg" }, create: { nip: "DEMO-GURU-001", name: "Guru Demo", position: "Guru Pendamping", subjects: "Pendampingan belajar dan pengembangan karakter", education: "S.Pd. · data demo", experience: "Mendampingi proyek belajar lintas bidang · data demo", photo: "/brand/faculty/guru-demo.svg" } });
  const classroom = await db.classRoom.upsert({ where: { name: "Kelas Contoh" }, update: {}, create: { name: "Kelas Contoh", year: "2026/2027", majorId: major.id, homeroomTeacherId: teacher.id } });
  const student = await db.student.upsert({ where: { nis: "DEMO-001" }, update: {}, create: { nis: "DEMO-001", name: "Murid Demo", gender: "L", classId: classroom.id, year: "2026/2027", status: "AKTIF" } });
  if (!await db.achievement.findFirst({ where: { title: "Prestasi Contoh" } })) await db.achievement.create({ data: { title: "Prestasi Contoh", level: "Sekolah", year: "2026", desc: "Ganti dengan prestasi resmi.", studentId: student.id } });
  await db.extracurricular.upsert({ where: { name: "Kegiatan Contoh" }, update: {}, create: { name: "Kegiatan Contoh", schedule: "Jadwal diumumkan sekolah", desc: "Informasi demo kegiatan ekstrakurikuler." } });
  if (!await db.agenda.findFirst({ where: { title: "Agenda Contoh" } })) await db.agenda.create({ data: { title: "Agenda Contoh", desc: "Perbarui dengan jadwal resmi sekolah.", location: "Sekolah", startAt: new Date("2026-12-01T02:00:00.000Z") } });

  const demoMajors = await Promise.all([
    db.major.upsert({ where: { code: "DEMO-ACADEMIC-01" }, update: {}, create: { code: "DEMO-ACADEMIC-01", name: "Sains Terapan", desc: "Contoh program sains untuk menampilkan kartu akademik. Ganti dengan program resmi." } }),
    db.major.upsert({ where: { code: "DEMO-ACADEMIC-02" }, update: {}, create: { code: "DEMO-ACADEMIC-02", name: "Bahasa dan Literasi", desc: "Contoh program bahasa dan literasi untuk review halaman publik." } }),
  ]);
  const demoTeachers = await Promise.all([
    db.teacher.upsert({ where: { nip: "DEMO-GURU-002" }, update: { position: "Guru Sains", subjects: "Eksperimen sains · literasi data", education: "S.Pd. Pendidikan IPA · data demo", experience: "Proyek laboratorium dan eksplorasi lingkungan · data demo", photo: "/brand/faculty/ahmad-hidayat.svg" }, create: { nip: "DEMO-GURU-002", name: "Ahmad Hidayat", position: "Guru Sains", subjects: "Eksperimen sains · literasi data", education: "S.Pd. Pendidikan IPA · data demo", experience: "Proyek laboratorium dan eksplorasi lingkungan · data demo", photo: "/brand/faculty/ahmad-hidayat.svg" } }),
    db.teacher.upsert({ where: { nip: "DEMO-GURU-003" }, update: { position: "Guru Bahasa", subjects: "Bahasa Indonesia · literasi dan menulis", education: "S.Pd. Pendidikan Bahasa · data demo", experience: "Klub baca dan penerbitan karya murid · data demo", photo: "/brand/faculty/siti-rahmah.svg" }, create: { nip: "DEMO-GURU-003", name: "Siti Rahmah", position: "Guru Bahasa", subjects: "Bahasa Indonesia · literasi dan menulis", education: "S.Pd. Pendidikan Bahasa · data demo", experience: "Klub baca dan penerbitan karya murid · data demo", photo: "/brand/faculty/siti-rahmah.svg" } }),
    db.teacher.upsert({ where: { nip: "DEMO-GURU-004" }, update: { position: "Pembina Kegiatan", subjects: "Kepemimpinan · kegiatan murid", education: "S.Pd. Pendidikan Olahraga · data demo", experience: "Pembinaan kegiatan dan kolaborasi murid · data demo", photo: "/brand/faculty/fadli-hakim.svg" }, create: { nip: "DEMO-GURU-004", name: "Fadli Hakim", position: "Pembina Kegiatan", subjects: "Kepemimpinan · kegiatan murid", education: "S.Pd. Pendidikan Olahraga · data demo", experience: "Pembinaan kegiatan dan kolaborasi murid · data demo", photo: "/brand/faculty/fadli-hakim.svg" } }),
  ]);
  const demoClasses = await Promise.all([
    db.classRoom.upsert({ where: { name: "Kelas 10 Demo" }, update: {}, create: { name: "Kelas 10 Demo", year: "2026/2027", majorId: demoMajors[0].id, homeroomTeacherId: demoTeachers[0].id } }),
    db.classRoom.upsert({ where: { name: "Kelas 11 Demo" }, update: {}, create: { name: "Kelas 11 Demo", year: "2026/2027", majorId: demoMajors[1].id, homeroomTeacherId: demoTeachers[1].id } }),
  ]);
  const demoStudents = [
    ["DEMO-002", "Murid Contoh 02", "P", demoClasses[0].id],
    ["DEMO-003", "Murid Contoh 03", "L", demoClasses[0].id],
    ["DEMO-004", "Murid Contoh 04", "P", demoClasses[1].id],
    ["DEMO-005", "Murid Contoh 05", "L", demoClasses[1].id],
  ] as const;
  for (const [nis, name, gender, classId] of demoStudents) {
    await db.student.upsert({ where: { nis }, update: {}, create: { nis, name, gender, classId, year: "2026/2027", status: "AKTIF" } });
  }
  for (const title of ["Literasi dan Menulis", "Klub Sains", "Kepemimpinan Murid"]) {
    await db.extracurricular.upsert({ where: { name: title }, update: {}, create: { name: title, schedule: "Jadwal contoh", desc: "Contoh kegiatan untuk review. Sesuaikan jadwal dan informasi dengan data sekolah." } });
  }
  for (const [title, level] of [["Pameran Karya Murid", "Sekolah"], ["Lomba Literasi", "Wilayah"]]) {
    if (!await db.achievement.findFirst({ where: { title } })) await db.achievement.create({ data: { title, level, year: "2026", desc: "Contoh prestasi untuk meninjau tampilan halaman publik." } });
  }
  for (const [title, desc, date] of [
    ["Pekan Literasi", "Contoh agenda diskusi buku dan pameran karya tulis murid.", "2026-11-05T02:00:00.000Z"],
    ["Pertemuan Keluarga dan Guru", "Contoh agenda komunikasi sekolah dan keluarga murid.", "2026-11-14T02:00:00.000Z"],
    ["Pameran Proyek Kelas", "Murid memperlihatkan hasil proyek belajar kepada pengunjung.", "2026-12-12T02:00:00.000Z"],
  ] as const) {
    if (!await db.agenda.findFirst({ where: { title } })) await db.agenda.create({ data: { title, desc, location: "Sekolah (contoh)", startAt: new Date(date) } });
  }

  const demoDownloads = [
    { title: "Panduan Penerimaan Murid (Contoh)", category: "SPMB", fileName: "panduan-penerimaan-demo.pdf", desc: "Format contoh untuk meninjau Pusat Unduhan. Jadwal dan syarat bukan informasi resmi." },
    { title: "Kalender Kegiatan (Contoh)", category: "Agenda", fileName: "kalender-kegiatan-demo.pdf", desc: "Contoh ringkasan kegiatan. Periksa halaman Agenda untuk jadwal yang diperbarui." },
    { title: "Pengenalan Program (Contoh)", category: "Akademik", fileName: "lembar-pengenalan-program-demo.pdf", desc: "Contoh pengenalan program, perlu disesuaikan dengan data resmi sekolah." },
  ] as const;
  await db.downloadFile.deleteMany({ where: { fileUrl: { in: demoDownloads.map((file) => `/uploads/downloads/demo/${file.fileName}`) } } });
  for (const file of demoDownloads) {
    const fileUrl = `/brand/downloads/demo/${file.fileName}`;
    const size = (await stat(join(process.cwd(), "public", fileUrl.slice(1)))).size;
    const existing = await db.downloadFile.findFirst({ where: { fileUrl }, select: { id: true } });
    const data = { title: file.title, category: file.category, desc: file.desc, fileUrl, size, public: true };
    if (existing) await db.downloadFile.update({ where: { id: existing.id }, data });
    else await db.downloadFile.create({ data });
  }

  const demoAlbums = [
    {
      title: "Ruang untuk Bertumbuh", oldTitle: "Kegiatan Contoh", category: "Akademik", photos: [
        ["ruang-belajar.svg", "Belajar dimulai dari rasa ingin tahu."],
        ["perpustakaan.svg", "Mencari jawaban di antara halaman buku."],
        ["kolaborasi.svg", "Berbagi gagasan, menyusun pemahaman."],
        ["karya-murid.svg", "Ruang kelas menjadi ruang bertanya."],
      ],
    },
    {
      title: "Mencoba dan Menemukan", oldTitle: "Literasi Contoh", category: "Eksplorasi", photos: [
        ["laboratorium.svg", "Eksperimen kecil membuka pertanyaan baru."],
        ["ruang-belajar.svg", "Belajar sains lewat pengamatan langsung."],
        ["menulis.svg", "Mencatat proses sama pentingnya dengan hasil."],
        ["karya-murid.svg", "Ide tumbuh saat dikerjakan bersama."],
      ],
    },
    {
      title: "Karya yang Dibuat Bersama", oldTitle: "Proyek Kelas Contoh", category: "Karya Murid", photos: [
        ["kolaborasi.svg", "Setiap murid membawa sudut pandang."],
        ["menulis.svg", "Dari catatan sederhana menjadi cerita."],
        ["perpustakaan.svg", "Merawat kebiasaan membaca."],
        ["karya-murid.svg", "Berani berbagi hasil dan proses."],
      ],
    },
  ] as const;
  const albums = [];
  for (const demo of demoAlbums) {
    const album = await db.album.findFirst({ where: { title: { in: [demo.title, demo.oldTitle] } } });
    const saved = album
      ? await db.album.update({ where: { id: album.id }, data: { title: demo.title, category: demo.category } })
      : await db.album.create({ data: { title: demo.title, category: demo.category } });
    albums.push(saved);
    const legacyPhotoIds = [
      "photo-1509062522246-3755977927d7", "photo-1507842217343-583bb7270b66", "photo-1427504494785-3a9ca7044f45", "photo-1524178232363-1fb2b075b655",
      "photo-1532094349884-543bc11b234d", "photo-1581093458791-9d15482442f2", "photo-1453738773917-9c3eff1db985", "photo-1516321318423-f06f85e504b3",
      "photo-1523240795612-9a054b0db644", "photo-1455390582262-044cdead277a", "photo-1516979187457-637abb4f9353", "photo-1517486808906-6ca8b3f04846",
    ];
    await db.photo.deleteMany({ where: { albumId: saved.id, OR: [{ url: { startsWith: "https://picsum.photos/seed/imbs-" } }, ...legacyPhotoIds.map((id) => ({ url: { startsWith: `https://images.unsplash.com/${id}?` } }))] } });
    for (const [imageName, caption] of demo.photos) {
      const url = `/brand/stories/${imageName}`;
      const photo = await db.photo.findFirst({ where: { albumId: saved.id, url } });
      if (photo) await db.photo.update({ where: { id: photo.id }, data: { caption } });
      else await db.photo.create({ data: { albumId: saved.id, url, caption } });
    }
  }
  await db.sPMBPeriod.upsert({ where: { id: "demo-spmb-2026" }, update: {}, create: { id: "demo-spmb-2026", name: "Periode Demo", year: "2026", quota: 100, openAt: new Date("2026-01-01T00:00:00.000Z"), closeAt: new Date("2026-12-31T23:59:59.000Z"), terms: "Periode demo. Perbarui persyaratan resmi sebelum digunakan.", active: true } });

  for (const { id, label, href, parentId, order, visible, target, pageSlug } of DEFAULT_PUBLIC_MENU) {
    await db.menuItem.upsert({ where: { id }, update: {}, create: { id, label, href, parentId, order, visible, target, pageSlug } });
  }
  console.log(`Seed demo selesai: ${users.length} akun, ${posts.length} berita, ${albums.length} album, ${demoTeachers.length + 1} guru, ${demoStudents.length + 1} murid, halaman profil, agenda, SPMB, dan FAQ. Login demo: ${users.map(([email]) => email).join(", ")} / ImbsDemo!2026`);
}

main().finally(() => db.$disconnect());
