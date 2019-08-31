const {consumerKey, consumerSecret} = require('./secret');
const https = require('https');
const {promisify} = require('util');

const authorization = `Basic ` + Buffer.from(consumerKey + ":" + consumerSecret).toString("base64");


exports.getToken = callback => new Promise((resolve, reject) => {
    const request = https.request(
        {
            method: "POST",
            host: "api.twitter.com",
            path: "/oauth2/token",
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded;charset=UTF-8",
                Authorization: authorization
            }
        },
        response => {
            if (response.statusCode != 200) {
                callback(response.statusCode);
            } else {
                let body = "";
                response.on("data", chunk => {
                    body += chunk;
                })
                    .on("end", () => {
                        // try {
                        //     console.log(body);
                        JSON.parse(body).access_token ? resolve(JSON.parse(body).access_token) : reject(new Error('Token could not be obtained!!!'));
                        // } catch (err) {
                        //     callback(err);
                        // }
                    })
                    .on("error", err => callback(err));
            }
        }
    );
    request.on("error", err => callback(err));
    request.end(`grant_type=client_credentials`);
});

/*exports.getToken(function(err, token) {
    console.log(token);
});*/


exports.getTweets = (token, callback) => new Promise ( (resolve, reject) => {
    const authorization = 'Bearer ' + token;
    const request = https.request(
        {
            method: "GET",
            host: "api.twitter.com",
            path: `/1.1/statuses/user_timeline.json?screen_name=nytimes&count=2&tweet_mode=extended`,
            headers: {Authorization: authorization}
        },
        response => {
            if (response.statusCode != 200) {
                console.log(response.statusCode);
                callback(response.statusCode);
            } else {
                let body = "";
                response.on("data", chunk => {
                    body += chunk;
                })
                    .on("end", () => {
                        try {
                            var tweets = JSON.parse(body);
                            var parsedTweets = [];
                            for (var i = 0; i < tweets.length; i++) {
                                // console.log(tweets[i].entities.urls);

                                if (tweets[i].entities.urls && tweets[i].entities.urls.length == 1) {
                                    var full_text = tweets[i].full_text;
                                    var parsedText = "";

                                    for (let j = 0; j < tweets[i].entities.urls.length; j++) {
                                        parsedText = full_text.replace(
                                            tweets[i].entities.urls[j].url,
                                            ""
                                        );
                                    }
                                    if (tweets[i].entities.media) {
                                        for (let j = 0; j < tweets[i].entities.media.length; j++) {
                                            parsedText = parsedText.replace(
                                                tweets[i].entities.media[j].url,
                                                ""
                                            );
                                        }
                                    }
                                    parsedTweets.push({
                                        href: encodeURI(tweets[i].entities.urls[0].url),
                                        text: parsedText
                                    });
                                }
                            }
                            // console.log(parsedTweets);
                            parsedTweets ? resolve(callback(null, parsedTweets)) : reject (new Error('Tweets did not get!!!'));
                        } catch (err) {
                            callback(err);
                        }
                    })
                    .on("error", err => callback(err));
            }
        }
    );
    request.on("error", err => callback(err));
    request.end(`grant_type=client_credentials`);
});
