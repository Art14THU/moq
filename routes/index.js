var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
//By default, we forward the / path to index.html automatically.
var options = {
  root: __dirname + '/../web-mobile/',
  dotfiles: 'deny',
  headers: {
    'x-timestamp': Date.now(),
    'x-sent': true
  }
};
  res.sendFile('/index.html', options, function(err) {
    if (err) {
      console.log(err);
    }
  });
});

module.exports = router;
