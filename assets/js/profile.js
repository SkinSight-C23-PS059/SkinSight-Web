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

window.addEventListener('scroll', function () {
    var nav = document.querySelector('nav');
    nav.classList.toggle('sticky', window.scrollY > 0);
});

// Menggunakan JavaScript untuk mengambil data profil pengguna dan bookmark menggunakan Fetch API
fetch('/profile', { method: 'GET' })
    .then((response) => response.json())
    .then((data) => {
        const emailElement = document.getElementById('email');
        const usernameElement = document.getElementById('username');
        emailElement.textContent = data.email;
        usernameElement.textContent = data.username;
    })
    .catch((error) => {
        console.error('Error fetching profile data:', error);
    });

fetch('/profile/bookmarks', { method: 'GET' })
    .then((response) => response.json())
    .then((data) => {
        const bookmarkList = document.getElementById('bookmark-list');
        const tbody = bookmarkList.querySelector('tbody');
        const noDataMessage = document.getElementById('no-data-message');

        if (data.bookmarks.length === 0) {
            noDataMessage.style.display = 'block';
        } else {
            data.bookmarks.forEach((bookmark) => {
                const row = document.createElement('tr');

                // Konversi format waktu
                const createdAt = new Date(bookmark.created_at);
                const formattedDate = `${createdAt.getDate()}/${createdAt.getMonth() + 1}/${createdAt.getFullYear()}`;

                row.innerHTML = `
                    <td>${bookmark.disease_name}</td>
                    <td>${bookmark.description}</td>
                    <td>${bookmark.treatment}</td>
                    <td>${formattedDate}</td>
                `;
                tbody.appendChild(row);
            });
        }
    })
    .catch((error) => {
        console.error('Error fetching bookmarks:', error);
    });
