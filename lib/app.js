var app = require("express")();

app.get('/', function (req, res) {
  res.send('c\'est ne une jsbin');
});

app.listen(3000);
