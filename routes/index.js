var express = require('express');
var router = express.Router();
var socketApi = require('../bin/socketApi');
var db = require('../bin/database/dbhome');



/* GET home page. */
router.get('/', function(req, res, next) {
if(!req.session.myid){


  res.render('index', { title: 'home',img:'x' });
  socketApi.proudcts(req.session.myid);

}
else{

  var sql = 'SELECT username ,phone ,img ,email FROM `users` WHERE id='+req.session.myid;
  db.con.query(sql, function(err, result) {
 
    res.render('index', { title: 'home',img:result[0].img,email: result[0].email,phone:result[0].phone ,user:result[0].username });
    socketApi.proudcts(req.session.myid);
               });



}

});







module.exports = router;
