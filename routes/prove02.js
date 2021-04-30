const express = require('express');
const router = express.Router();

const books = [];
let showForm = true;

router.get('/', (req, res) => {
  showForm = true;
  res.render('pages/prove02', {
    books: books,
    path: '/prove02',
    title: 'Add a Book',
    showForm: showForm
  });
});

router.post('/add-book', (req, res) => {
  const {bookTitle, bookSummary} = req.body;
  bookTitle && bookSummary && books.push({bookTitle: bookTitle, bookSummary: bookSummary});
  showForm = false;

  res.render('pages/prove02', {
    books: books,
    title: `New Book: ${bookTitle}`,
    path: '/prove02',
    showForm: showForm
  });
});

router.use((req, res) => {
  res.status(404)
    .send('<h1>404 - Not Found</h1>')
});

module.exports = router;

