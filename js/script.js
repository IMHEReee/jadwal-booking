// ✅ Nomor WhatsApp Admin (Ganti dengan nomor yang sesuai)
const adminWhatsApp = "6281344374965"; // Format internasional tanpa "+"

// ✅ URL Google Sheets dalam format CSV
const csvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRXZ7qnAE6UjUu2Owvr5V9T5DzdlkJCmwsnb1kYIcfrCjBkbnSHVAVuzaRnpgy_mDvqPUgThI_WGOdQ/pub?output=csv";

// ✅ Fungsi untuk mengambil data dari Google Sheets menggunakan Fetch API (AJAX)
async function fetchData() {
  try {
    const response = await fetch(csvUrl, { cache: "no-store" }); // Pastikan tidak menggunakan cache
    const data = await response.text();
    const rows = data.split("\n").map((row) => row.split(","));

    const table = document.getElementById("availability-table");
    const thead = table.querySelector("thead tr");
    const tbody = table.querySelector("tbody");
    const dateSelect = document.getElementById("dateSelect");

    // ✅ Mengambil semua tanggal unik di kolom pertama (baris pertama dilewati)
    let uniqueDates = [...new Set(rows.slice(1).map((row) => row[0].trim()))];

    // ✅ Isi dropdown dengan tanggal unik
    dateSelect.innerHTML = "";
    uniqueDates.forEach((date) => {
      let option = document.createElement("option");
      option.value = date;
      option.textContent = date;
      dateSelect.appendChild(option);
    });

    // ✅ Event Listener saat dropdown berubah, update tabel sesuai tanggal yang dipilih
    dateSelect.addEventListener("change", () => {
      updateTable(rows, dateSelect.value);
    });

    // ✅ Tampilkan data pertama kali dengan tanggal default (tanggal pertama di dropdown)
    updateTable(rows, uniqueDates[0]);
  } catch (error) {
    console.error("❌ Gagal mengambil data:", error);
  }
}

// ✅ Fungsi untuk memperbarui tabel berdasarkan tanggal yang dipilih
function updateTable(rows, selectedDate) {
  const table = document.getElementById("availability-table");
  const thead = table.querySelector("thead tr");
  const tbody = table.querySelector("tbody");

  // ✅ Kosongkan tabel sebelum diisi ulang
  thead.innerHTML = "";
  tbody.innerHTML = "";

  // ✅ Isi header tabel
  let headers = rows[0];
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    thead.appendChild(th);
  });

  // ✅ Filter data berdasarkan tanggal yang dipilih
  let filteredData = rows
    .slice(1)
    .filter((row) => row[0].trim() === selectedDate);

  // ✅ Isi tabel dengan data yang sesuai
  filteredData.forEach((row) => {
    const tr = document.createElement("tr");
    row.forEach((cell, index) => {
      const td = document.createElement("td");
      let value = cell.trim();

      // ✅ Ambil nama room dari header
      let roomName = headers[index];
      let bookingTime = row[1]; // Kolom kedua adalah jam

      // ✅ Konversi angka 1 dan 0 menjadi tombol WhatsApp atau status booked
      if (index > 1) {
        if (value === "1") {
          let bookingDate = row[0]; // Kolom pertama adalah tanggal
          // ✅ Buat pesan otomatis untuk WhatsApp
          let bookingMessage = `Halo Kak, saya ingin memesan ${roomName} pada tanggal ${bookingDate} jam ${bookingTime}.`;

          // ✅ Pastikan pesan dienkode dengan benar agar tidak kacau
          let whatsappLink = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(
            bookingMessage
          )}`;

          // ✅ Buat tombol WhatsApp
          td.innerHTML = `<a href="${whatsappLink}" target="_blank" class="whatsapp-button">Tersedia</a>`;
          td.classList.add("available");
        } else if (value === "0") {
          td.textContent = "Dibooking";
          td.classList.add("booked");
        } else {
          td.textContent = value;
        }
      } else {
        td.textContent = value;
      }

      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

// ✅ Jalankan fetchData saat halaman dimuat
document.addEventListener("DOMContentLoaded", fetchData);

// ✅ Auto-refresh data setiap 30 detik tanpa reload halaman
setInterval(() => {
  fetchData();
}, 30000);
