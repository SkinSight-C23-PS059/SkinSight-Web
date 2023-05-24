
const body = document.querySelector('body');
const nav = document.querySelector('nav');
const modeToggle = document.querySelector('.dark-light');
const searchToggle = document.querySelector('.searchToggle');
const sidebarOpen = document.querySelector('.sidebarOpen');
const sidebarClose = document.querySelector('.siderbarClose');



let getMode = localStorage.getItem('mode');
if (getMode && getMode === 'dark-mode') {
  body.classList.add('dark');
}

// js code to toggle dark and light mode
modeToggle.addEventListener('click', () => {
  modeToggle.classList.toggle('active');
  body.classList.toggle('dark');

  // js code to keep user selected mode even page refresh or file reopen
  if (!body.classList.contains('dark')) {
    localStorage.setItem('mode', 'light-mode');
  } else {
    localStorage.setItem('mode', 'dark-mode');
  }
});

// js code to toggle search box
searchToggle.addEventListener('click', () => {
  searchToggle.classList.toggle('active');
});

// js code to toggle sidebar
sidebarOpen.addEventListener('click', () => {
  nav.classList.add('active');
});

body.addEventListener('click', (e) => {
  let clickedElm = e.target;

  if (
    !clickedElm.classList.contains('sidebarOpen') &&
    !clickedElm.classList.contains('menu')
  ) {
    nav.classList.remove('active');
  }
});

const selectImage = document.querySelector('.select-image');
const inputFile = document.querySelector('#file');
const imgArea = document.querySelector('.img-area');
const checkResultBtn = document.querySelector('.check-result');
const resetBtn = document.querySelector('.reset');

selectImage.addEventListener('click', function () {
  inputFile.click();
});

inputFile.addEventListener('change', function () {
  const image = this.files[0];
  const allowedFormats = ['image/png', 'image/jpeg', 'image/jpg']; // List of allowed image formats

  if (allowedFormats.includes(image.type)) {
    if (image.size < 2000000) {
      const reader = new FileReader();
      reader.onload = () => {
        const allImg = imgArea.querySelectorAll('img');
        allImg.forEach((item) => item.remove());
        const imgUrl = reader.result;
        const img = document.createElement('img');
        img.src = imgUrl;
        imgArea.appendChild(img);
        imgArea.classList.add('active');
        imgArea.dataset.img = image.name;
      };
      reader.readAsDataURL(image);
      checkResultBtn.style.display = 'block'; // Menampilkan tombol Check Result
      resetBtn.style.display = 'none'; // Menyembunyikan tombol Reset
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Image size exceeds 2MB!',
      });
      // Reset file input
      this.value = '';
    }
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please upload a valid image file (PNG, JPEG, JPG)!',
    });
    // Reset file input
    this.value = '';
  }
});

function processImage() {
  // Ambil file gambar yang diunggah
  const fileInput = document.getElementById('file');
  const file = fileInput.files[0];

  if (!file) {
    Swal.fire({
      icon: 'warning',
      title: 'No Image Uploaded',
      text: 'Please upload an image before checking the result.',
    });
    return;
  }

  // Buat objek URL untuk gambar
  const imageURL = URL.createObjectURL(file);

  // Tampilkan gambar di dalam popup
  const resultContainer = document.getElementById('resultContainer');
  resultContainer.innerHTML = '';

  if (file.size < 2000000) {
    resultContainer.innerHTML = `<img src="${imageURL}" alt="Uploaded Image" />`;

    // Ambil data penyakit berdasarkan gambar (contoh: data penyakit herpes)
    const diseaseData = getDiseaseData(file);

    // Tampilkan data penyakit di dalam popup
    const diseaseContainer = document.createElement('div');
    diseaseContainer.innerHTML = `
      <h3>Hasil Penyakit Kulit</h3>
      <p>Nama Penyakit: ${diseaseData.name}</p>
      <p>Deskripsi: ${diseaseData.description}</p>
      <p>Pengobatan: ${diseaseData.treatment}</p>
    `;
    resultContainer.appendChild(diseaseContainer);

    checkResultBtn.style.display = 'none'; // Menyembunyikan tombol Check Result
    resetBtn.style.display = 'block'; // Menampilkan tombol Reset
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'No image uploaded or image size exceeds 2MB!',
    });
  }

  // Tampilkan kontainer popup
  const popupContainer = document.getElementById('popupContainer');
  popupContainer.classList.add('active');
}

function reset() {
  const resultContainer = document.getElementById('resultContainer');
  resultContainer.innerHTML = '';

  const fileInput = document.getElementById('file');
  fileInput.value = ''; // Reset file input

  const imgArea = document.querySelector('.img-area');
  imgArea.innerHTML = `
      <i class="bx bxs-cloud-upload icon"></i>
      <h3>Upload Image</h3>
      <p>Image size must be less than <span>2MB</span></p>
    `;

  imgArea.classList.remove('active'); // Hapus class 'active' untuk menghilangkan CSS '.img-area.active:hover::before'

  const checkResultBtn = document.querySelector('.check-result');
  const resetBtn = document.querySelector('.reset');
  checkResultBtn.style.display = 'block'; // Menampilkan tombol Check Result
  resetBtn.style.display = 'none'; // Menyembunyikan tombol Reset
}

function closePopup() {
  // Sembunyikan kontainer popup
  const popupContainer = document.getElementById('popupContainer');
  popupContainer.classList.remove('active');
}

// Fungsi untuk mendapatkan data penyakit berdasarkan gambar
function getDiseaseData(image) {
  // Contoh data penyakit herpes
  const diseaseData = {
    name: 'Herpes',
    description:
      'Herpes is a viral infection characterized by painful blisters on the skin.',
    treatment:
      'Antiviral medications can help manage and reduce symptoms of herpes outbreaks.',
  };

  // Simulasikan pemrosesan data berdasarkan gambar di sini
  // ...

  // Mengembalikan data penyakit
  return diseaseData;
}

function saveToBookmark() {
  // Ambil token otentikasi dari cookie
  

  const bookmarkItem = {
    image: imgArea.dataset.img, // Nama gambar
    result: getDiseaseData(inputFile.files[0]), // Hasil deteksi
  };

  

  // Kirim data bookmark ke server (backend)
  fetch('/save-bookmark', {
    // Ubah URL endpoint ke '/save-bookmark'
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookmarkItem),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data !== null) { // updated condition
        Swal.fire({
          icon: 'success',
          title: 'Bookmark Saved',
          text: 'The result has been saved to your bookmark.',
        });
        console.log('Bookmark saved:', bookmarkItem);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to save bookmark.',
        });
        console.error('Failed to save bookmark:', data.error);
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'An error occurred while saving bookmark.',
      });
      console.error('Error while saving bookmark:', error);
    });
  }
