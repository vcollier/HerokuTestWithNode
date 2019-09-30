const express = require('express');
const path = require('path'); // path lets us navigate the file system / folders
const hbs = require('hbs');

// require sql connection file
const sql = require('./utils/sql');

// heroku assigns a port when it deploys via the process (environment varables - coming)
// locally this will run @ port 3000; remotely it'll run wherever heroku tells it to run
const port = process.env.PORT || 3000; // a double pipe - || - means "or"

const app = express();

app.use(express.static('public'));

// tell express to use the handlebars engine to render data
app.set('view engine', 'hbs');

// tell express to use the views folder to find its templates
app.set('views', __dirname + '/views');


// a forward slash is the home route (same as index.html)
app.get('/', (req, res) => {
  console.log('at the home route');
  //res.sendFile(path.join(__dirname + '/views/index.html'));

  res.render('home', { message: "hi there!", anothermessage: "This is easy!"});
  // this builds localhost:3000/views/index.html
})

app.get('/contact', (req, res) => {
  //res.sendFile(path.join(__dirname + '/views/contact.html'));
  res.render('contact', { message: "what is your name?" })
})

app.get('/users', (req, res) => {
  sql.getConnection((err, connection) => {
    if (err) {
      return console.log(err.message);
    }

    let query = `SELECT * FROM tbl_card`;

    sql.query(query, (err, rows) => {
      connection.release();

      if (err) { return console.log(err.message) }

      console.log(rows);

      res.render('user', rows[0]);
    })
  })
})

app.get('/portfolio', (req, res) => {
  res.send('on the portfolio page!');
})

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});