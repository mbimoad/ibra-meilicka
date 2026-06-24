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



// Gantilah variabel URL di script websitemu dengan URL yang baru kamu dapatkan ini:
// URL Web App Google Apps Script milikmu
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzOtvQOW8s7TemrgSCFzjv2AiZHk3xeY9rABRd8fNzLw_XbaUG5hc00xkjT9b7LzLHdSg/exec"; 

  const form = document.getElementById('commentForm');
  const btnKirim = document.getElementById('btnKirim');

  // ========================================================
  // 1. FUNGSI UNTUK MENGIRIM DATA KE GOOGLE SHEET (POST)
  // ========================================================
  form.addEventListener('submit', function(e) {
    e.preventDefault(); // Mencegah halaman reload saat submit
    
    // Mengubah status tombol saat loading
    btnKirim.innerText = "Mengirim...";
    btnKirim.disabled = true;

    // Mengambil data dari inputan HTML
    const data = {
      nama: document.getElementById('nama').value,
      komentar: document.getElementById('komentar').value
    };

    // Kirim data menggunakan Fetch API ke Google Apps Script
    fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors", // Mengabaikan kendala CORS dari sisi Google
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(() => {
      alert("Ucapan dan doa restu berhasil dikirim!");
      form.reset(); // Mengosongkan form kembali
      btnKirim.innerText = "Kirim Ucapan";
      btnKirim.disabled = false;
      
      // Ambil ulang data terbaru agar ucapan yang baru dikirim langsung muncul
      muatKomentar(); 
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Gagal mengirim ucapan, coba lagi nanti.");
      btnKirim.innerText = "Kirim Ucapan";
      btnKirim.disabled = false;
    });
  });

  // ========================================================
  // 2. FUNGSI UNTUK MENGAMBIL DATA DARI GOOGLE SHEET (GET)
  // ========================================================
  function muatKomentar() {
    const container = document.getElementById('daftarKomentar');

    fetch(WEB_APP_URL)
    .then(response => response.json())
    .then(data => {
      container.innerHTML = ""; // Bersihkan teks "Memuat ucapan..."
      
      if (data.length === 0) {
        container.innerHTML = "<p style='color: #888; font-style: italic;'>Belum ada ucapan. Jadilah yang pertama!</p>";
        return;
      }
      
      // Loop data dan masukkan ke dalam HTML area daftar komentar
      data.forEach(item => {
        const itemKomentar = document.createElement('div');
        itemKomentar.style.borderBottom = "1px solid #f3f3f3";
        itemKomentar.style.padding = "10px 0";
        itemKomentar.style.marginBottom = "5px";
        
        itemKomentar.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
            <strong style="color: #333; font-size: 0.95rem;">${item.nama}</strong>
            <small style="color: #999; font-size: 0.75rem;">${item.tanggal}</small>
          </div>
          <p style="margin: 0; color: #555; font-size: 0.9rem; line-height: 1.4;">${item.komentar}</p>
        `;
        container.appendChild(itemKomentar);
      });
    })
    .catch(error => {
      console.error("Error ambil data:", error);
      container.innerHTML = "<p style='color: red; font-size: 0.9rem;'>Gagal memuat ucapan.</p>";
    });
  }

  // Jalankan fungsi muatKomentar secara otomatis saat halaman web selesai dimuat
  window.onload = muatKomentar;

function doPost(e) {
  try {
    // Membuka spreadsheet menggunakan ID milikmu
    var box = SpreadsheetApp.openById("1Wij9MKhR2_xNVEr4ZMJ45XD5RMflj57uwL-d82Y9GfE");
    var sheet = box.getSheets()[0];
    
    // Mengambil data JSON yang dikirim dari JavaScript website
    var data = JSON.parse(e.postData.contents);
    var nama = data.nama;
    var komentar = data.komentar;
    
    // Mengatur format tanggal Indonesia (WIB) untuk penanda waktu
    var tanggal = Utilities.formatDate(new Date(), "GMT+7", "dd-MM-yyyy HH:mm");
    
    // Memasukkan data ke baris baru di Google Sheets
    sheet.appendRow([nama, komentar, tanggal]);
    
    // Mengembalikan respon sukses ke website
    return ContentService.createTextOutput(JSON.stringify({"status": "success", "message": "Komentar berhasil disimpan"}))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    // Mengembalikan respon jika terjadi eror
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": error.toString()}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
function doGet() {
  try {
    var box = SpreadsheetApp.openById("1Wij9MKhR2_xNVEr4ZMJ45XD5RMflj57uwL-d82Y9GfE");
    var sheet = box.getSheets()[0];
    var rows = sheet.getDataRange().getValues();
    var data = [];
    
    // Cek jika sheet masih kosong atau hanya ada header saja
    if (rows.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify([]))
                           .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Mengambil data dari sheet mulai dari baris ke-2 (melewati header)
    for (var i = 1; i < rows.length; i++) {
      var tglData = rows[i][2];
      var tglFormatted = "";
      
      // Memastikan format tanggal aman dikonversi menjadi teks
      if (tglData instanceof Date) {
        tglFormatted = Utilities.formatDate(tglData, "GMT+7", "dd-MM-yyyy HH:mm");
      } else {
        tglFormatted = tglData ? tglData.toString() : "";
      }

      data.push({
        "nama": rows[i][0] ? rows[i][0].toString() : "",
        "komentar": rows[i][1] ? rows[i][1].toString() : "",
        "tanggal": tglFormatted
      });
    }
    
    // Mengembalikan daftar komentar ke website
    return ContentService.createTextOutput(JSON.stringify(data))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": error.toString()}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}