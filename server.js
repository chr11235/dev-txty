const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost', // Replace with your MySQL host
  user: 'root',      // Replace with your MySQL username
  password: 'Se7en1992',  // Replace with your MySQL password
  database: 'txty_schema'  // Replace with your MySQL database name
});

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'dev-txty', 'template', 'register.html');
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('404 Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    }
  });
});

app.post('/register', (req, res) => {
  const { username, email, password, passwordConfirm } = req.body;

  if (password !== passwordConfirm) {
    res.status(400).send('Passwords do not match');
    return;
  }

  const sql = 'INSERT INTO reg_table (username, email, password) VALUES (?, ?, ?)';
  const values = [username, email, password];

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error during registration:', err);
      res.status(500).send('An error occurred during registration');
    } else {
      console.log('Registration successful');
      res.status(200).send('Registration successful');
    }
  });
});

const port = 5506;
app.listen(port, () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});
