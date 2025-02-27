// URL Google Sheets dalam format CSV
const csvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRXZ7qnAE6UjUu2Owvr5V9T5DzdlkJCmwsnb1kYIcfrCjBkbnSHVAVuzaRnpgy_mDvqPUgThI_WGOdQ/pub?output=csv";

// Fungsi untuk mengambil data dari Google Sheets
async function fetchData() {
  try {
    const response = await fetch(csvUrl);
    const data = await response.text();
    const rows = data.split("\n").map((row) => row.split(","));

    const table = document.getElementById("availability-table");
    const thead = table.querySelector("thead tr");
    const tbody = table.querySelector("tbody");
    const dateSelect = document.getElementById("dateSelect");

    // Mengambil semua tanggal unik di kolom pertama (baris ke-1 dilewati)
    let uniqueDates = [...new Set(rows.slice(1).map((row) => row[0].trim()))];

    // Isi dropdown dengan tanggal unik
    dateSelect.innerHTML = "";
    uniqueDates.forEach((date) => {
      let option = document.createElement("option");
      option.value = date;
      option.textContent = date;
      dateSelect.appendChild(option);
    });

    // Saat dropdown berubah, update tabel
    dateSelect.addEventListener("change", () => {
      updateTable(rows, dateSelect.value);
    });

    // Tampilkan data pertama kali dengan tanggal default (tanggal pertama di dropdown)
    updateTable(rows, uniqueDates[0]);
  } catch (error) {
    console.error("Gagal mengambil data:", error);
  }
}

// Fungsi untuk memperbarui tabel berdasarkan tanggal yang dipilih
function updateTable(rows, selectedDate) {
  const table = document.getElementById("availability-table");
  const thead = table.querySelector("thead tr");
  const tbody = table.querySelector("tbody");

  // Kosongkan tabel
  thead.innerHTML = "";
  tbody.innerHTML = "";

  // Isi header tabel
  let headers = rows[0];
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    thead.appendChild(th);
  });

  // Filter data berdasarkan tanggal yang dipilih
  let filteredData = rows
    .slice(1)
    .filter((row) => row[0].trim() === selectedDate);

  // Isi tabel dengan data yang sesuai
  filteredData.forEach((row) => {
    const tr = document.createElement("tr");
    row.forEach((cell, index) => {
      const td = document.createElement("td");
      let value = cell.trim();

      // Konversi angka 1 dan 0 menjadi teks yang lebih jelas
      if (index > 1) {
        // Kolom pertama adalah tanggal, kedua jam
        if (value === "1") {
          td.textContent = "Tersedia";
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

// Jalankan fetchData saat halaman dimuat
document.addEventListener("DOMContentLoaded", fetchData);
