const sign_in_btn = document.querySelector('#sign-in-btn');
const sign_up_btn = document.querySelector('#sign-up-btn');
const container = document.querySelector('.container');

sign_up_btn.addEventListener('click', () => {
  container.classList.add('sign-up-mode');
});

sign_in_btn.addEventListener('click', () => {
  container.classList.remove('sign-up-mode');
});

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

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('logemail').value;
  const password = document.getElementById('logpassword').value;

  if (!email || !password) {
    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: 'Email and password are required',
    });
    return;
  }

  try {
    const response = await axios.post('/login', {
      email,
      password,
    });

    if (response.status === 200) {
      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'You have successfully logged in.',
      }).then(() => {
        // Redirect to home.html after successful login
        window.location.href = 'home.html';
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: response.data.error || 'Invalid email or password',
      });
    }
  } catch (error) {
    console.error('Error:', error);

    if (error.response && error.response.data && error.response.data.error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response.data.error,
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Login failed. Please try again.',
      });
    }
  }
});
