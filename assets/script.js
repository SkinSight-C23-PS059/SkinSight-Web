const registrationForm = document.getElementById('registrationForm');

registrationForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Periksa apakah email, username, dan password kosong
  if (!email || !username || !password) {
    console.log('Email, username, and password are required');
    Swal.fire({
      icon: 'error',
      title: 'Registration Failed',
      text: 'Email, username, and password are required',
    });
    return;
  }

  try {
    const response = await axios.post('/register', {
      email,
      username,
      password,
    });
    console.log(response.data);

    if (response.status === 200) {
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: response.data.message,
      }).then(() => {
        // Mengosongkan isi formulir setelah berhasil mendaftar
        document.getElementById('email').value = '';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        window.location.assign("login.html");
      });
    } else if (response.status === 409) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: response.data.message,
      });
    }
  } catch (error) {
    console.error('Error:', error);
    if (error.response && error.response.status === 400) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: 'Email, username, and password are required',
      });
    } else if (error.response && error.response.status === 409) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.response.data.message,
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: 'Registration failed. Please try again.',
      });
    }
  }
});
