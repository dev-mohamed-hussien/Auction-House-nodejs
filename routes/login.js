var express = require('express');
var router = express.Router();
var db = require('../bin/database/dbhome');

/* GET login listing. */
router.get('/login', function(req, res, next) {
  if(req.session.myid){

    res.redirect('/')
  }
  else{
  res.render("login", {
    pageTitle: "Login"
  });
  }

});


module.exports = router;
