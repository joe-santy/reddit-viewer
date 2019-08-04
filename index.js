const express = require('express');
const fetch = require('fetch');
const path = require('path');
const app = express();
const port = 8080;

function getRedditData(req, res){
    let body = '';
    req.on('data', function(chunk){
        body += chunk.toString();
    });
    req.on('end', function(){
        console.log(body);
        let subreddit = JSON.parse(body).sr;
        let after = JSON.parse(body).after;
        let redditUrl = after ? 'https://www.reddit.com/r/' + subreddit + '.json?after=' + after : 'https://www.reddit.com/r/'+subreddit+'.json';

        fetch.fetchUrl(redditUrl, function(err, meta, body){
            if (err) {
                console.error(err);
            } else {
                let rData = JSON.parse(body.toString('utf8'));
                console.log(rData);
                let pics = [];
                let pageData = rData.data.children.map(c => {
                    console.log(c.data.url);
                    if (c.data.url.match(/.jpg/) || c.data.url.match(/.gif/)) {
                        pics.push({url: c.data.url, title: c.data.title});
                    }
                });
                res.send({pics: pics, after: rData.data.after});
            }
        });
    });
}


app.use(express.static(path.join(__dirname, 'site', 'www')));

app.post('/', getRedditData);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
