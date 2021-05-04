//TA03 PLACEHOLDER
const express = require('express');
const router = express.Router();
const https = require('https');

let items = [];
let searchValue = '';

router.post('/search', (req, res, next) => {
    searchValue = req.body.searchValue;
    res.redirect('/ta03/', 302);
});

router.get('/', (req, res, next) => {
    https.get('https://byui-cse.github.io/cse341-course/lesson03/items.json', (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            items = (JSON.parse(data));
            res.render('pages/ta03', {
                title: 'Team Activity 03',
                path: '/ta03', // For pug, EJS
                activeTA03: true, // For HBS
                contentCSS: true, // For HBS
                items: items,
                searchValue: searchValue
            });
        });
    });
});

module.exports = router;