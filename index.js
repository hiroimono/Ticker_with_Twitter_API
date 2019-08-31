/* eslint-disable indent */
const express = require('express');
const fs = require('fs');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const twitter = require('./twitter');

const app = express();

const myPath = __dirname;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Set static folder
// app.use('/ticker', express.static(path.join(__dirname, 'public')));
app.use('/ticker', express.static('./public/ticker'));

//first version
// app.get('/data.json', (req, res) => {
//     twitter.getToken()
//         .then( token => {
//             twitter.getTweets()
//                 .then( tweets => {
//                     var parsedTweets = [];
//                     for (var i = 0; i < tweets.length; i++) {
//                         console.log(tweets[i].entities.urls);
//                         if ( tweets[i].entities.urls && tweets[i].entities.urls.length == 1 ) {
//                             var full_text = tweets[i].full_text;
//                             var parsedText = "";

//                             for ( let j = 0; j < tweets[i].entities.urls.length; j++) {
//                                 parsedText = full_text.replace(
//                                     tweets[i].entities.urls[j].url,
//                                     ""
//                                     );
//                             }
//                             if (tweets[i].entities.media) {
//                                 for (let j = 0; j < tweets[i].entities.media.length; j++) {
//                                     parsedText = parsedText.replace(
//                                         tweets[i].entities.media[j].url,
//                                         ""
//                                         );
//                                     }
//                             }
//                         }
//                         parsedTweets.push({
//                             href: tweets[i].entities.urls[0].url,
//                             text: parsedText
//                         });
//                     }
//                     res.json(parsedTweets);
//                     console.log(parsedTweets);
//                 });
//         });
// });

// //second version
// app.get("/data.json", (request, response) => {
//     twitter.getToken(function(err, token) {
//         if (err) {
//             console.log(err);
//             response.sendStatus(500);
//         } else {
//             twitter.getTweets(token, function(err, tweets) {
//                 if (err) {
//                     console.log(err);
//                     response.sendStatus(500);
//                 } else {
//                     response.json(tweets);
//                     console.log(tweets);
//                 }
//             });
//         }
//     });
// });

//third version using Promise
app.get("/data.json", (request, response) => {
    twitter.getToken().then (token => {
        twitter.getTweets(token, function(err, tweets) {
            if (err) {
                console.log(err);
                response.sendStatus(500);
            } else {
				fs.writeFileSync(`${myPath}/tweets.json`, JSON.stringify(tweets, null, 4));
                response.json(tweets);
                console.log(tweets);
            }
        });
    });
});

//routing
app.use('/', require('./routes/route'));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Port ${PORT} is listening...`));
