const express = require('express');
const app = express();
const path = require('path');

// sets the 'view engine' configuration for the 'app' object.
app.set('view engine', 'ejs'); // it means, that we'll use the ejs templating engine to render dynamic content.
// sets the 'views' configuration for the 'app' object
app.set('views', path.join(__dirname, 'views')); // views => ejs templates are located. path.join() -> join the current dir name with 'views' dir

const port = 3000;

app.get('/', (req, res) => {
  res.render('home'); // renders the 'home' view using the EJS templating
});

app.listen(3000, () => {
  console.log(`Serving on port ${port}`);
});
