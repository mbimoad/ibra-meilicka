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
    
    // Cek jika sheet masih kosong (hanya ada header atau kosong sama sekali)
    if (rows.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify([]))
                           .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Mengambil data dari sheet mulai dari baris ke-2 (melewati header)
    for (var i = 1; i < rows.length; i++) {
      var tglData = rows[i][2];
      var tglFormatted = "";
      
      // Memastikan konversi format tanggal aman jika bertipe Date object
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