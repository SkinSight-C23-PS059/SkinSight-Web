const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!email || !password) {
    swal('Error', 'Email and password are required', 'error');
    return;
  }

  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok) {
    // Login successful, redirect to home.html
    window.location.href = 'home.html';
  } else {
    // Login failed, display error message
    swal('Error', data.error, 'error');
  }
});
