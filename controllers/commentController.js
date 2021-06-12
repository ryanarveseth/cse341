const fetch = require('node-fetch');
const messages = require('../model/messages.json');
const Comment = require('../model/Comment');
const mongoose = require('mongoose');

const ITEMS_PER_PAGE = 20;


const getComments = (page, res) =>
  Comment.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .then(comments => {
      return res.render('pages/store/comments', {
        title: 'Finding your dream car. Made easier.',
        path: '/comments',
        messages: messages,
        page: page,
        pageCount: 500 / ITEMS_PER_PAGE + 1,
        comments: comments
      });
    });

module.exports.getCommentsPage = (req, res, next) => {
  let page = 1;

  if (req.params && req.params.page) {
    page = parseInt(req.params.page);
  }

  Comment.countDocuments().then(count =>
    (count > 0) ?
      getComments(page, res) :
      // if we don't have any comments, fetch them from this free API
      fetch("https://jsonplaceholder.typicode.com/comments")
        .then(res => res.json())
        .then(comments => {
          Comment.insertMany(comments.map(comment => ({
            subject: comment.name,
            body: comment.body,
            email: comment.email
          }))).then(() => {
            return getComments(page, res);
          });
        })
  );
}