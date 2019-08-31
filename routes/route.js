const express = require('express');
const url = require('url');
const router = express.Router();

const tweets = require('../tweets');

// const tweets = { ...tweetss };

console.log('tweets.json: ', tweets);

// Listing projects
router.get('/', (req, res) => {
    res.render('ticker', {
        layout: 'main',
        tweets: tweets
    });
});

module.exports = router;
