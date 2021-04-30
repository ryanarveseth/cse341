const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const books = [];
let showForm = true;

router.get('/', (req, res) => {
  showForm = true;
  res.render('prove02', {
    books: books,
    path: '/prove02',
    title: 'Add a Book',
    showForm: showForm
  });
});

router.post('/add-book', (req, res) => {

  const {bookTitle, bookSummary} = req.body;
  console.log('request.body', req.body);
  books.push({bookTitle: bookTitle, bookSummary: bookSummary});
  showForm = false;

  res.render('prove02', {
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

