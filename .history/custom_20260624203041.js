// Get the current URL's search parameters
const params = new URLSearchParams(window.location.search);

// Get the specific 'inv' value
const invValue = params.get('inv'); 
const malePria = params.get('fam'); 

if(malePria != null) {
    if(malePria.toLowerCase() == "true") {
        document.querySelectorAll('#male_pria').forEach(item => item.innerHTML = 'Adam')
    }
}

if(invValue != null) document.getElementById('nmtamu').innerHTML = invValue; 


setTimeout(() => {
    document.querySelector('.bmoloader').classList.add('hiding')
}, 1000);


// GANTI dengan URL Web App yang kamu dapatkan setelah Deploy di Google Apps Script
  const WEB_APP_URL = "https://script.google.com/macros/s/XXXXX/exec"; 

  const form = document.getElementById('commentForm');
  const btnKirim = document.getElementById('btnKirim');

  // 1. FUNGSI UNTUK MENGIRIM DATA (POST)
  form.addEventListener('submit', function(e) {
    e.preventDefault(); // Mencegah reload halaman
    
    btnKirim.innerText = "Mengirim...";
    btnKirim.disabled = true;

    const data = {
      nama: document.getElementById('nama').value,
      komentar: document.getElementById('komentar').value
    };

    // Mengirim data ke Google Apps Script menggunakan fetch
    fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors", // Penting: GAS memerlukan mode no-cors jika tidak diatur redirect-nya
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(() => {
      alert("Ucapan berhasil dikirim!");
      form.reset();
      btnKirim.innerText = "Kirim Ucapan";
      btnKirim.disabled = false;
      muatKomentar(); // Refresh daftar komentar setelah kirim data
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Gagal mengirim ucapan.");
      btnKirim.innerText = "Kirim Ucapan";
      btnKirim.disabled = false;
    });
  });

  // 2. FUNGSI UNTUK MENGAMBIL DATA (GET)
  function muatKomentar() {
    const container = document.getElementById('daftarKomentar');
    container.innerHTML = "<p>Memuat ucapan...</p>";

    fetch(WEB_APP_URL)
    .then(response => response.json())
    .then(data => {
      container.innerHTML = ""; // Bersihkan container
      if (data.length === 0) {
        container.innerHTML = "<p>Belum ada ucapan.</p>";
        return;
      }
      
      // Tampilkan data ke dalam HTML
      data.forEach(item => {
        const div = document.createElement('div');
        div.style.borderBottom = "1px solid #eee";
        div.style.padding = "10px 0";
        div.innerHTML = `<strong>${item.nama}</strong> <small style="color:#888;">(${item.tanggal})</small><br><p>${item.komentar}</p>`;
        container.appendChild(div);
      });
    })
    .catch(error => {
      console.error("Error mengambil data:", error);
      container.innerHTML = "<p>Gagal memuat ucapan.</p>";
    });
  }

  // Panggil fungsi muat data saat halaman pertama kali dibuka
  window.onload = muatKomentar;