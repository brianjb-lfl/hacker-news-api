'use strict';

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const { DATABASE, PORT } = require('./config');
const knex = require('knex')(DATABASE);

const app = express();

app.use(morgan(':method :url :res[location] :status'));

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('hello world');
});

// ADD YOUR ENDPOINTS HERE
app.post('/api/stories', (req, res) => {
  console.log('running post');
  knex
    .insert({
      title: req.body.title,
      url: req.body.url,
      //votes: 0
    })
    .into('news')
    .returning('title', 'url')
    .then(function(storyTitle) {
      console.log('ready to return');
      res.status(201).send(storyTitle);
    });
});

// app.get('/api/stories', (req, res) => {
//   console.log('running get');
//   knex.select()
//     .from('news')
//     .orderBy('title')
//     .then(results => res.json(results));
// });




app.get('/api/stories', (req, res) => {
  console.log('running get');
  knex.select('news.id', 'title', 'url', 'votes', 'tags.id', 'tag', 'tags_id', 'news_id')
    .from('news')
    .join('news_tags', 'news.id', 'news_tags.news_id')
    .join('tags', 'news_tags.tags_id', 'tags.id')
    .orderBy('news_id')
    .then(results => {
      const hydRes = {};
      results.forEach(row => {
        if( !(row.news_id in hydRes) ){
          hydRes[row.news_id] = {
            news_id: row.news_id,
            title: row.title,
            url: row.url,
            votes: row.votes,
            tags: []
          };
        }
        hydRes[row.news_id].tags.push({
          id: row.tags_id,
          tag: row.tag
        });
      });
      res.json(hydRes);
    });

});


// const hydrated = {};
// people.forEach(row => {
//     if ( !(row.id in hydrated) ) {
//         hydrated[row.id] = {
//             id: row.id,
//             name: row.name,
//             age: row.age,
//             pets: []
//         }
//     }
//     hydrated[row.id].pets.push({
//         name: row.petName,
//         type: row.petType,
//     });
// });
// console.log(hydrated);



// {
//   "id": 1,
//   "title": "Newsflash",
//   "url": "http://allthenews.com/newsflashstory",
//   "votes": 3,
//   "tag": "news",
//   "tags_id": 1,
//   "news_id": 1
// },







app.put('/api/stories/:id', (req, res) => {
  console.log('running put', req.params.id);
  knex('news')
    .where('id', '=', req.params.id)
    .increment('votes', 1)
    .then(res.sendStatus(204));
})

let server;
function runServer(){
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err);
    });
  });
}

function closeServer(){
  return new Promise((resolve, reject) => {
    console.log('closing server');
    server.close(err => {
      if (err){
        reject(err);
        return;
      }
      resolve();
    });
  });
}


/** if (require.main === module) ...
 * Only run this block if file is run using `npm start` or `node server.js`
 * Fixes error: "Trying to open unclosed connection." when running mocha tests
 */


if (require.main === module) {
  const server = app
    .listen(PORT, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error(err);
    });
}

module.exports = { app, runServer, closeServer }; //! export app for testing
