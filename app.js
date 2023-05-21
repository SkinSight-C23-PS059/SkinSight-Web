const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();

const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('assets'));

// Koneksi ke Cloud SQL
const connection = mysql.createConnection({
  host: '34.101.199.121',
  user: 'root',
  password: '123456',
  database: 'test_login_db',
});

connection.connect((error) => {
  if (error) {
    console.error('Error connecting to the database:', error);
  } else {
    console.log('Connected to the database');
  }
});

// Endpoint untuk registrasi
app.post('/register', (req, res) => {
  const { email, username, password } = req.body;

  // Periksa apakah email, username, dan password kosong
  if (!email || !username || !password) {
    console.log('Email, username, and password are required');
    return res
      .status(400)
      .json({ message: 'Email, username, and password are required' });
  }

  // Periksa apakah email sudah ada di database
  connection.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (error, results) => {
      if (error) {
        console.error('Error:', error);
        console.log('Internal server error');
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ message: 'Internal server error' });
      } else {
        switch (true) {
          case results.length > 0:
            console.log('Email already exists');
            res.setHeader('Content-Type', 'application/json');
            res.status(409).json({ message: 'Email already exists' });
            break;
          default:
            connection.query(
              'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
              [email, username, password],
              (error, results) => {
                if (error) {
                  console.error('Error:', error);
                  console.log('Internal server error');
                  res.setHeader('Content-Type', 'application/json');
                  res.status(500).json({ message: 'Internal server error' });
                } else {
                  console.log('User registered successfully');
                  res.setHeader('Content-Type', 'application/json');
                  res
                    .status(200)
                    .json({ message: 'User registered successfully' });
                }
              }
            );
        }
      }
    }
  );
});

// Endpoint untuk login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  connection.query(query, [email, password], (error, results) => {
    if (error) {
      console.error('Error logging in:', error);
      console.log('Failed to log in');
      res.setHeader('Content-Type', 'application/json');
      res.status(500).json({ error: 'Failed to log in' });
    } else if (results.length === 0) {
      console.log('Invalid email or password');
      res.setHeader('Content-Type', 'application/json');
      res.status(401).json({ error: 'Invalid email or password' });
    } else {
      console.log('Login successful');
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ message: 'Login successful' });
    }
  });
});

// Routing untuk halaman register
app.get('/register', (req, res) => {
  const filePath = path.join(__dirname, 'assets', 'register.html');
  res.sendFile(filePath);
});

// Routing untuk halaman login
app.get('/login', (req, res) => {
  const filePath = path.join(__dirname, 'assets', 'login.html');
  res.sendFile(filePath);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
