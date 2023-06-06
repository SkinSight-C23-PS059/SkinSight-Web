const express = require('express');
const mysql = require('mysql');
const path = require('path');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { v4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('assets'));

const connection = mysql.createConnection({
  host: '34.101.135.207',
  user: 'root',
  password: '123456',
  database: 'skinsight_db',
});

connection.connect((error) => {
  if (error) {
    console.error('Error connecting to the database:', error);
  } else {
    console.log('Connected to the database');
  }
});

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Get Access Back-End API',
  });
});

app.post('/register', (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    console.log('Email, username, and password are required');
    return res.status(400).json({ message: 'Email, username, and password are required' });
  }

  connection.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
    if (error) {
      console.error('Error:', error);
      console.log('Internal server error');
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length > 0) {
      console.log('Email already exists');
      return res.status(409).json({ message: 'Email already exists' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        console.log('Internal server error');
        return res.status(500).json({ message: 'Internal server error' });
      }

      const userId = v4();
      connection.query(
        'INSERT INTO users (id, email, username, password) VALUES (?, ?, ?, ?)',
        [userId, email, username, hashedPassword],
        (error) => {
          if (error) {
            console.error('Error:', error);
            console.log('Internal server error');
            return res.status(500).json({ message: 'Internal server error' });
          }

          console.log('User registered successfully');
          return res.status(200).json({ message: 'User registered successfully' });
        }
      );
    });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';
  connection.query(query, [email], (error, results) => {
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
      bcrypt.compare(password, results[0].password, (err, match) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          console.log('Failed to log in');
          res.setHeader('Content-Type', 'application/json');
          res.status(500).json({ error: 'Failed to log in' });
        } else if (match) {
          console.log('Login successful');
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json({ message: 'Login successful' });
        } else {
          console.log('Invalid email or password');
          res.setHeader('Content-Type', 'application/json');
          res.status(401).json({ error: 'Invalid email or password' });
        }
      });
    }
  });
});

app.post('/save-bookmark', (req, res) => {
  const { image, result } = req.body;

  if (!image || !result) {
    console.log('Image and result are required');
    return res.status(400).json({ message: 'Image and result are required' });
  }

  // You should implement the authentication logic here to ensure the user is logged in before saving a bookmark
  // Example code:
  // if (!req.isAuthenticated()) {
  //   return res.status(401).json({ message: 'You must be logged in to save a bookmark' });
  // }

  const userId = v4();
  connection.query(
    'INSERT INTO bookmark (user_id, image, disease_name, description, treatment) VALUES (?, ?, ?, ?, ?)',
    [userId, image, result.name, result.description, result.treatment],
    (error, results) => {
      if (error) {
        console.error('Error:', error);
        console.log('Internal server error');
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ message: 'Internal server error' });
      } else {
        console.log('Bookmark saved successfully');
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ message: 'Bookmark saved successfully' });
      }
    }
  );
});

app.get('/save-bookmark', (req, res) => {
  const sql = 'SELECT * FROM bookmark';
  connection.query(sql, (err, fields) => {
    res.status(200).json({
      message: 'GET ALL BOOKMARK',
      data: fields
    });
  });
});

app.get('/articles', (req, res) => {
  connection.query('SELECT * FROM articles', (error, results) => {
    if (error) {
      console.error('Error:', error);
      console.log('Internal server error');
      res.setHeader('Content-Type', 'application/json');
      res.status(500).json({ message: 'Internal server error' });
    } else {
      if (results.length === 0) {
        res.send('<p>Maaf, saat ini artikel belum tersedia</p>');
      } else {
        const articlesHTML = results
          .map(
            (article) => `
              <article>
                <img src="${article.image_url}" alt="Article Image" />
                <h2>${article.title}</h2>
                <p>${article.description}</p>
                <a href="${article.article_url}">Read More</a>
              </article>
            `
          )
          .join('');

        res.send(`<section id="articles">${articlesHTML}</section>`);
      }
    }
  });
});

app.get('/index', (req, res) => {
  const filePath = path.join(__dirname, 'assets', 'index.html');
  res.sendFile(filePath);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
