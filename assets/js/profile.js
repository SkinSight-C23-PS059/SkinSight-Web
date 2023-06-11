// Menggunakan JavaScript untuk mengambil data profil pengguna dan bookmark menggunakan Fetch API
fetch('/profile', { method: 'GET' })
    .then((response) => response.json())
    .then((data) => {
        const profileData = document.getElementById('profile-data');
        profileData.innerHTML = `
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Username:</strong> ${data.username}</p>
          `;
    })
    .catch((error) => {
        console.error('Error fetching profile data:', error);
    });

fetch('/profile/bookmarks', { method: 'GET' })
    .then((response) => response.json())
    .then((data) => {
        const bookmarkList = document.getElementById('bookmark-list');
        data.bookmarks.forEach((bookmark) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
              <strong>Disease Name:</strong> ${bookmark.disease_name}<br>
              <strong>Description:</strong> ${bookmark.description}<br>
              <strong>Treatment:</strong> ${bookmark.treatment}<br>
            `;
            bookmarkList.appendChild(listItem);
        });
    })
    .catch((error) => {
        console.error('Error fetching bookmarks:', error);
    });