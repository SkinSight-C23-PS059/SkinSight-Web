const express = require('express');
const mysql = require('mysql');
const path = require('path');
const bcrypt = require('bcrypt');
const cors = require('cors');
const {v4} = require('uuid'); // updated user_id generate fixing multi primary 
let myuuid = v4();// updated user_id generate fixing multi primary

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('assets'));

// Masuk ke home url
// app.get('/', (req, res) => {
//   res.header('Content-Type' , 'text/html');
//   const filePath = path.join(__dirname, 'assets', 'login.html');
//   res.sendFile(filePath);
// });


app.get('/' , (req , res)=>{
  res.status(200).json({
    message : 'Get Access Back-End API'
  })
});





// Koneksi ke Cloud SQL
const connection = mysql.createConnection({
  host: '34.101.168.179',
  user: 'root',
  password: '123456',
  database: 'skinsight',
});

connection.connect((error) => {
  if (error) {
    console.error('Error connecting to the database:', error);
  } else {
    console.log('Connected to the database');
  }
});

// Endpoint untuk registrasi dan login
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
            // Enkripsi password menggunakan bcrypt
            bcrypt.hash(password, 10, (err, hashedPassword) => {
              if (err) {
                console.error('Error hashing password:', err);
                console.log('Internal server error');
                res.setHeader('Content-Type', 'application/json');
                res.status(500).json({ message: 'Internal server error' });
              } else {
                // Simpan hashedPassword ke dalam database
                connection.query(
                  'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
                  [email, username, hashedPassword],
                  (error, results) => {
                    if (error) {
                      console.error('Error:', error);
                      console.log('Internal server error');
                      res.setHeader('Content-Type', 'application/json');
                      res
                        .status(500)
                        .json({ message: 'Internal server error' });
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
            });
        }
      }
    }
  );
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
      // Bandingkan password yang dimasukkan dengan password terenkripsi dalam database
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
  const { image, result} = req.body;
  console.log(result);

  // Periksa apakah image dan result tersedia
  if (!image || !result) {
    console.log('Image and result are required');
    return res.status(400).json({ message: 'Image and result are required' });
  }

  if(myuuid === null) {
    return res.status(404).json({message : "User id not found"});
  }

  // Periksa apakah user telah terautentikasi dan user object-nya terdefinisi


  // Lakukan operasi INSERT ke tabel bookmark di database
  connection.query(
    'INSERT INTO bookmark (image, disease_name, description, treatment) VALUES (?, ?, ?, ?)',
    [image, result.name, result.description, result.treatment], // updated user_id object
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

app.get('/save-bookmark' , (req , res)=>{
  const sql = "SELECT * FROM bookmark";
  connection.query(sql , (err , fields)=>{
    res.status(200).json({
      message : "GET ALL BOOKMARK",
      data : [{
        fields
      }]
    })
  })
})

// app.get('/index', (req, res) => {
//   const filePath = path.join(__dirname, 'assets', 'index.html');
//   res.sendFile(filePath);
// });


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});


