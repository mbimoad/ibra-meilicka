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
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzOtvQOW8s7TemrgSCFzjv2AiZHk3xeY9rABRd8fNzLw_XbaUG5hc00xkjT9b7LzLHdSg/exec";

// Fungsi untuk mengirim data saat tombol diklik / form di-submit
function kirimUcapan() {
  const data = {
    nama: document.getElementById('nama').value,
    komentar: document.getElementById('komentar').value
  };

  fetch(WEB_APP_URL, {
    method: "POST",
    mode: "no-cors", // Mengindari block CORS dari Google
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(() => {
    alert("Ucapan dan doa restu berhasil dikirim!");
    document.getElementById('commentForm').reset(); // Reset form
  })
  .catch(error => {
    console.error("Error:", error);
  });
}


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