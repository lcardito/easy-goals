const express = require('express');
var mysql = require('mysql');

const app = express();

var connection = mysql.createConnection({
  host     : 'db',
  user     : 'goals',
  password : 'pwd',
  database : 'goals'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});

connection.end();


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
