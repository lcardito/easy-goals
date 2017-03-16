const express = require('express');

var knex = require('knex')({
  client: 'mysql2',
  connection: {
    host : 'db',
    user : 'goals',
    password : 'pwd',
    database : 'goals'
  }
});

knex.migrate.latest()
.then(function() {
  console.log('DB migrated');
});

const app = express();
app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}


app.get('/api/goals', (req, res) => {

});

app.get('/api/food', (req, res) => {

});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
