const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./todo.db');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Halaman utama - menampilkan daftar todo
app.get('/', (req, res) => {
  db.all('SELECT * FROM todos', [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.render('index', { todos: rows });
  });
});

// Menambahkan tugas baru
app.post('/add', (req, res) => {
  const task = req.body.task;
  db.run('INSERT INTO todos (task, completed) VALUES (?, ?)', [task, false], (err) => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect('/');
  });
});

// Menandai tugas sebagai selesai
app.post('/complete/:id', (req, res) => {
  const id = req.params.id;
  db.run('UPDATE todos SET completed = ? WHERE id = ?', [true, id], (err) => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect('/');
  });
});

// Menghapus tugas
app.post('/delete/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM todos WHERE id = ?', [id], (err) => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect('/');
  });
});

// Menjalankan server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
