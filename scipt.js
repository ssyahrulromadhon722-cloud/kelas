const defaultData = {
  siswa: [
    {id:1, nama:'Ahmad Fauzi', nis:'12001', jk:'Laki-laki'},
    {id:2, nama:'Siti Nurhaliza', nis:'12002', jk:'Perempuan'},
    {id:3, nama:'Budi Santoso', nis:'12003', jk:'Laki-laki'},
    {id:4, nama:'Dewi Lestari', nis:'12004', jk:'Perempuan'},
    {id:5, nama:'Rina Marlina', nis:'12005', jk:'Perempuan'}
  ],
  jadwal: [
    {id:1, hari:'Senin', jam:'07:00 - 08:30', mapel:'Matematika'},
    {id:2, hari:'Senin', jam:'08:30 - 10:00', mapel:'B. Indonesia'},
    {id:3, hari:'Selasa', jam:'07:00 - 08:30', mapel:'B. Inggris'},
    {id:4, hari:'Rabu', jam:'07:00 - 08:30', mapel:'Fisika'}
  ],
  pengumuman: [
    {id:1, judul:'Ujian Tengah Semester', isi:'UTS minggu depan. Persiapkan diri seperti Ranger menghadapi Zurg!', tanggal:'2026-08-18'},
    {id:2, judul:'Piket Kelas', isi:'Jadwal piket diperbarui. Cek mading kelas ya, kawan!', tanggal:'2026-08-15'}
  ],
  tugas: [
    {id:1, mapel:'Matematika', judul:'Latihan Soal Integral', deadline:'2026-12-25', status:'aktif'},
    {id:2, mapel:'B. Indonesia', judul:'Essay Tentang Pahlawan', deadline:'2026-12-22', status:'aktif'}
  ],
  galeri: [
    {id:1, judul:'Study Tour', icon:'🚌'},
    {id:2, judul:'Class Meeting', icon:'🏆'},
    {id:3, judul:'17 Agustus', icon:'🇮'}
  ],
  struktur: [
    {jabatan:'Wali Kelas', nama:'Bpk. Surya Wijaya', icon:'👨‍🏫'},
    {jabatan:'Ketua Kelas', nama:'Ahmad Fauzi', icon:'🤠'},
    {jabatan:'Wakil Ketua', nama:'Siti Nurhaliza', icon:'👩‍🚀'},
    {jabatan:'Sekretaris', nama:'Dewi Lestari', icon:'📝'},
    {jabatan:'Bendahara', nama:'Rina Marlina', icon:'💰'}
  ]
};

let data;
try {
  const saved = localStorage.getItem('kelasDataTS');
  data = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(defaultData));
  if (!saved) localStorage.setItem('kelasDataTS', JSON.stringify(data));
} catch(e) { data = JSON.parse(JSON.stringify(defaultData)); }

function saveData() { localStorage.setItem('kelasDataTS', JSON.stringify(data)); }

document.querySelectorAll('.nav-item').forEach(function(item) {
  item.addEventListener('click', function() {
    document.querySelectorAll('.nav-item').forEach(function(i) { i.classList.remove('active'); });
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    item.classList.add('active');
    document.getElementById(item.getAttribute('data-page')).classList.add('active');
    document.getElementById('pageTitle').textContent = item.textContent.trim();
    if (window.innerWidth <= 768) {
      document.getElementById('sidebar').classList.remove('active');
      document.getElementById('sidebarOverlay').classList.remove('active');
    }
  });
});

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('active');
  document.getElementById('sidebarOverlay').classList.toggle('active');
}

function toggleTheme() {
  var cur = document.documentElement.getAttribute('data-theme');
  var next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  document.getElementById('themeBtn').textContent = next === 'dark' ? '☀️' : '🌙';
}

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

function animateCounter(id, target) {
  var el = document.getElementById(id);
  var cur = 0;
  var step = Math.max(1, target / 30);
  var t = setInterval(function() {
    cur += step;
    if (cur >= target) { el.textContent = target; clearInterval(t); }
    else el.textContent = Math.floor(cur);
  }, 40);
}

function renderAll() {
  renderSiswa(); renderJadwal(); renderPengumuman();
  renderTugas(); renderGaleri(); renderStruktur(); renderDashboard();
}

function renderSiswa() {
  var tb = document.getElementById('siswaTable');
  if (!data.siswa.length) { tb.innerHTML = '<tr><td colspan="5" style="text-align:center">Belum ada data</td></tr>'; return; }
  var h = '';
  data.siswa.forEach(function(s, i) {
    h += '<tr><td>' + (i+1) + '</td><td>' + s.nama + '</td><td>' + s.nis + '</td><td>' + s.jk + '</td><td><button class="btn btn-danger btn-sm" onclick="deleteSiswa(' + s.id + ')">HAPUS</button></td></tr>';
  });
  tb.innerHTML = h;
}

function addSiswa(e) {
  e.preventDefault();
  data.siswa.push({id: Date.now(), nama: document.getElementById('siswaNama').value, nis: document.getElementById('siswaNis').value, jk: document.getElementById('siswaJk').value});
  saveData(); renderAll(); closeModal('modalSiswa'); e.target.reset();
}

function deleteSiswa(id) {
  if (confirm('Hapus siswa ini?')) { data.siswa = data.siswa.filter(function(s){return s.id!==id;}); saveData(); renderAll(); }
}

function renderJadwal() {
  var grid = document.getElementById('scheduleGrid');
  var days = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  var h = '';
  days.forEach(function(day) {
    var items = data.jadwal.filter(function(j){return j.hari===day;});
    h += '<div class="day-card"><h4>📅 ' + day + '</h4>';
    if (items.length) {
      items.forEach(function(j) { h += '<div class="schedule-item"><div class="time">⏰ ' + j.jam + '</div><strong>' + j.mapel + '</strong></div>'; });
    } else h += '<p style="color:var(--text-light);font-size:13px">Libur main! 🎈</p>';
    h += '</div>';
  });
  grid.innerHTML = h;
}

function addJadwal(e) {
  e.preventDefault();
  data.jadwal.push({id: Date.now(), hari: document.getElementById('jadwalHari').value, jam: document.getElementById('jadwalJam').value, mapel: document.getElementById('jadwalMapel').value});
  saveData(); renderAll(); closeModal('modalJadwal'); e.target.reset();
}

function renderPengumuman() {
  var list = document.getElementById('pengumumanList');
  if (!data.pengumuman.length) { list.innerHTML = '<p>Belum ada pengumuman</p>'; return; }
  var h = '';
  data.pengumuman.forEach(function(p) {
    h += '<div class="announcement-item"><h4>📌 ' + p.judul + '</h4><div class="date">📅 ' + p.tanggal + '</div><p>' + p.isi + '</p><button class="btn btn-danger btn-sm" style="margin-top:10px" onclick="deletePengumuman(' + p.id + ')">HAPUS</button></div>';
  });
  list.innerHTML = h;
}

function addPengumuman(e) {
  e.preventDefault();
  data.pengumuman.unshift({id: Date.now(), judul: document.getElementById('pengumumanJudul').value, isi: document.getElementById('pengumumanIsi').value, tanggal: new Date().toISOString().split('T')[0]});
  saveData(); renderAll(); closeModal('modalPengumuman'); e.target.reset();
}

function deletePengumuman(id) {
  if (confirm('Hapus?')) { data.pengumuman = data.pengumuman.filter(function(p){return p.id!==id;}); saveData(); renderAll(); }
}

function renderTugas() {
  var tb = document.getElementById('tugasTable');
  if (!data.tugas.length) { tb.innerHTML = '<tr><td colspan="5" style="text-align:center">Belum ada tugas</td></tr>'; return; }
  var h = '';
  var now = new Date();
  data.tugas.forEach(function(t) {
    var st = new Date(t.deadline) < now ? 'selesai' : 'aktif';
    var b = st === 'aktif' ? 'badge-warning' : 'badge-success';
    h += '<tr><td>' + t.mapel + '</td><td>' + t.judul + '</td><td>' + t.deadline + '</td><td><span class="badge ' + b + '">' + st + '</span></td><td><button class="btn btn-danger btn-sm" onclick="deleteTugas(' + t.id + ')">HAPUS</button></td></tr>';
  });
  tb.innerHTML = h;
}

function addTugas(e) {
  e.preventDefault();
  data.tugas.push({id: Date.now(), mapel: document.getElementById('tugasMapel').value, judul: document.getElementById('tugasJudul').value, deadline: document.getElementById('tugasDeadline').value, status:'aktif'});
  saveData(); renderAll(); closeModal('modalTugas'); e.target.reset();
}

function deleteTugas(id) {
  if (confirm('Hapus?')) { data.tugas = data.tugas.filter(function(t){return t.id!==id;}); saveData(); renderAll(); }
}

function renderGaleri() {
  var grid = document.getElementById('galleryGrid');
  if (!data.galeri.length) { grid.innerHTML = '<p>Belum ada foto</p>'; return; }
  var h = '';
  data.galeri.forEach(function(g) {
    h += '<div class="gallery-item"><span>' + g.icon + '</span><div class="caption">' + g.judul + '</div></div>';
  });
  grid.innerHTML = h;
}

function addGaleri(e) {
  e.preventDefault();
  data.galeri.push({id: Date.now(), judul: document.getElementById('galeriJudul').value, icon: document.getElementById('galeriIcon').value});
  saveData(); renderAll(); closeModal('modalGaleri'); e.target.reset();
}

function renderStruktur() {
  var grid = document.getElementById('orgGrid');
  var h = '';
  data.struktur.forEach(function(s) {
    h += '<div class="org-card"><div class="org-avatar">' + s.icon + '</div><h4>' + s.nama + '</h4><p>' + s.jabatan + '</p></div>';
  });
  grid.innerHTML = h;
}

function renderDashboard() {
  animateCounter('statSiswa', data.siswa.length);
  animateCounter('statPengumuman', data.pengumuman.length);
  animateCounter('statTugas', data.tugas.filter(function(t){return new Date(t.deadline)>=new Date();}).length);
  animateCounter('statGaleri', data.galeri.length);
  var h = '';
  data.pengumuman.slice(0,3).forEach(function(p) {
    h += '<div class="announcement-item"><h4>📌 ' + p.judul + '</h4><div class="date">📅 ' + p.tanggal + '</div><p>' + p.isi.substring(0,100) + (p.isi.length>100?'...':'') + '</p></div>';
  });
  document.getElementById('recentAnnouncements').innerHTML = h || '<p>Belum ada</p>';
}

renderAll();