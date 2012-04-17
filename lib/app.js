var express = require('express'),
    path    = require('path'),
    app     = express();

app.root = path.join(__dirname, '..', 'public');

app.use(express.logger());
app.use(express.static(app.root));

app.get('/', function (req, res) {
  res.send('c\'est ne une jsbin');
});

module.exports = app;

// Run a local development server if this file is called directly.
if (require.main === module) {
  app.listen(3000);
}
