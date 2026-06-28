 // 1. KONFIGURASI SUPABASE
        // Ganti dengan URL dan Anon Key dari Project Supabase milikmu sendiri
        const SUPABASE_URL = "https://subnqxnworyzkqhwlfox.supabase.co";
        const SUPABASE_ANON_KEY = "sb_publishable_Au0rkT8ncB5-NqdwV-lDPw_MkC9fvci";
        
        const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        const commentForm = document.getElementById('commentForm');
        const commentIdInput = document.getElementById('commentId');
        const namaInput = document.getElementById('nama');
        const ucapanInput = document.getElementById('komentar');
        const submitBtn = document.getElementById('submitBtn');
        const commentList = document.getElementById('commentList');

        // 2. READ: Mengambil data komentar dari Supabase
        async function ambilKomentar() {
            const { data, error } = await sb
                .from('undangan') // Nama tabel di Supabase kamu
                .select('*')
                .order('created_at', { ascending: false });

            console.log(data, error)

            if (error) {
                console.error("Gagal mengambil data:", error);
                commentList.innerHTML = "<p style='color:red;'>Gagal memuat komentar.</p>";
                return;
            }

            if (data.length === 0) {
                commentList.innerHTML = "<p style='text-align:center; color:#888;'>Belum ada komentar.</p>";
                return;
            }

            // Render ke HTML
            commentList.innerHTML = data.map(item => {
                const tanggal = new Date(item.created_at).toLocaleString('id-ID');
                return `
                    <div class="komentar-item" style="
                        display: flex; flex-direction: column; gap: 5px;">
                        <div class="info" style="display:flex; align-items: center; justify-content: space-between">
                            <div class="nama">${item.nama}</div>
                            <div class="waktu">${tanggal}</div>
                        </div>
                        <div>${item.komentar}</div>

                        <div class="aksi-btn bmohide">
                            <button class="bmohide btn-edit" onclick="isiFormEdit('${item.id}', '${item.nama}', '${item.komentar}')">Edit</button>
                            <button class="bmohide btn-hapus" onclick="hapusKomentar('${item.id}')">Hapus</button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // 3. CREATE & UPDATE: Handle Submit Form
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const id = commentIdInput.value;
            const nama = namaInput.value;
            const komentar = ucapanInput.value;

            submitBtn.disabled = true;
            submitBtn.innerText = "Memproses...";

            if (id) {
                // Mode UPDATE
                const { error } = await sb
                    .from('undangan')
                    .update({ nama, komentar })
                    .eq('id', id);
                
                if (error) alert("Gagal mengupdate komentar");
            } else {
                // Mode CREATE
                const { error } = await sb
                    .from('undangan')
                    .insert([{ nama, komentar }]);
                
                if (error) alert("Gagal mengirim komentar");
            }

            // Reset Form & Refresh Data
            commentForm.reset();
            commentIdInput.value = '';
            submitBtn.innerText = "Kirim Ucapan";
            submitBtn.disabled = false;
            ambilKomentar();
        });

        // 4. DELETE: Menghapus komentar
        async function hapusKomentar(id) {
            if (confirm("Apakah Anda yakin ingin menghapus komentar ini?")) {
                const { error } = await sb
                    .from('undangan')
                    .delete()
                    .eq('id', id);

                if (error) alert("Gagal menghapus");
                else ambilKomentar();
            }
        }

        // Helper untuk memindahkan data ke form saat tombol Edit ditekan
        function isiFormEdit(id, nama, komentar) {
            commentIdInput.value = id;
            namaInput.value = nama;
            ucapanInput.value = komentar;
            submitBtn.innerText = "Simpan Perubahan";
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

  
        // Jalankan fungsi ambil data saat halaman pertama kali dibuka
        ambilKomentar();