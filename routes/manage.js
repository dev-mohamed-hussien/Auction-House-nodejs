var express = require('express');
var router = express.Router();
var socketApi = require('../bin/socketApi');
var db = require('../bin/database/dbhome');
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/')  },
    filename: function (req, file, cb) {  cb(null, Date.now()+file.originalname)   }
  })
  const fileFilter=(req, file, cb)=>{
   if(file.mimetype ==='image/jpeg' || file.mimetype ==='image/jpg' || file.mimetype ==='image/png'){
       cb(null,true);
   }else{ cb(null, false);  }  }
var upload = multer({ 
    storage:storage,
    limits:{  fileSize: 1024 * 1024 * 5 }, fileFilter:fileFilter
 });

/* GET manage page. */
router.get('/manage', function(req, res, next) {

if(!req.session.myid){

res.redirect('/login')

}


else{

  var sql = 'SELECT id,  username ,phone ,img ,email FROM `users` WHERE id='+req.session.myid;
  db.con.query(sql, function(err, result) {
    var onsaleSql = 'SELECT * FROM `proudcts` WHERE idWhoAdded='+req.session.myid+' AND sold='+0
    db.con.query(onsaleSql, function(err, result_onsaleSql) {
      var soldSql = 'SELECT bidding.idProudct  FROM bidding INNER JOIN proudcts ON bidding.idProudct=proudcts.id AND proudcts.idWhoAdded='+ req.session.myid +' AND proudcts.sold=1 AND proudcts.maxPrice=bidding.price INNER JOIN users ON bidding.idUser=users.id'
      db.con.query(soldSql, function(err, result_soldSql) {

        var wonSql = 'SELECT  bidding.idProudct FROM proudcts INNER JOIN users on proudcts.idWhoWin='+req.session.myid +' AND proudcts.idWhoAdded=users.id INNER JOIN bidding ON bidding.idProudct=proudcts.id AND bidding.price=proudcts.maxPrice WHERE proudcts.sold=1'
        db.con.query(wonSql, function(err, result_wonSql) {






          res.render('manage', { title: 'managment',img:result[0].img,email: result[0].email,phone:result[0].phone ,user:result[0].username ,idPRO:result[0].id ,sold: result_soldSql.length+'%'  ,won: result_wonSql.length+'%'  ,onsale:result_onsaleSql.length+'%' 
          ,soldd: result_soldSql.length  ,wonn: result_wonSql.length ,onsalee:result_onsaleSql.length
        });






        });
      });
    });
               });

              }

});



//#############################################################################################
//##################################     add proudct     ######################################
//#############################################################################################
/* post proudct page. */
router.post('/add',upload.fields([{name:'file1'},{name:'file2'},{name:'file3'}]),function(req, res, next) {
  if(!req.session.myid){

    res.redirect('/login'); 
  }
  else{  
  if (!req.files) {
   return res.status(400).send('No files were uploaded.');
   }
    else{
      console.log('iam here')
      req.session.idd =5
 var sql = "INSERT INTO  `proudcts`  (`name`, `describ`, `image1`, `image2`, `image3`, `minPrice`, `maxPrice`, `idWhoAdded`, `cate`, `sold`) VALUES ('" + req.body.namep + "','" + req.body.desc + "','" + req.files.file1[0].path.slice(6) + "','" + req.files.file2[0].path.slice(6) + "','" + req.files.file3[0].path.slice(6) + "','" + req.body.min + "','" + req.body.max + "','" + req.session.myid + "','" + req.body.slct + "'," + 0 + ")";
    console.log(sql)
      db.con.query(sql, function(err, result) {
        console.log(result)
 console.log('iam here')
 res.json({re:result});     
            });
   }
  }
  });
//########################################################################################################
//########################################################################################################
//########################################################################################################

  
//########################################################################################################
//##################################       on sale       #################################################
//########################################################################################################

/* post onsale page. */
 // view item of user

router.get('/onSale',function(req, res, next) {
  if(!req.session.myid){

    res.redirect('/login'); 
  }
  else{
  var sql = 'SELECT * FROM `proudcts` WHERE idWhoAdded='+req.session.myid+' AND sold='+0
  db.con.query(sql, function(err, result) {
         
    res.json(result);                 
               });
              }
});

 // delete from viewed item of user
router.post('/onsaledelete',function(req, res, next) {
  if(!req.session.myid){
    res.redirect('/login'); 
    
  }
  else{
  var sql = "delete from `proudcts`  where id ="+req.body.idP
db.con.query(sql, function(err, result) {         

  res.json({msg:"succ"})
             });
            }
});

// view offers on item 
router.post('/onsaleview',function(req, res, next) {
  if(!req.session.myid){
    res.redirect('/login'); 
    
  }
  else{
  var sql = "SELECT * FROM `bidding` WHERE idProudct="+req.body.idP
db.con.query(sql, function(err, result) {         
  res.json(result)
             });
            }
});

// sell item item 
router.post('/sellitem',function(req, res, next) {
  if(!req.session.myid){
    res.redirect('/login'); 
    
  }
  else{
  // convert string to array
  var info = req.body.sell.match(/\w+/g);
console.log(info[0],info[1],info[2])

if(req.body.sell==undefined){
  res.json({fail:'fail'})
}

else{
  var sql = "UPDATE proudcts SET sold=1 , minPrice ="+info[1]+  ",maxPrice ="+info[1]  +  ",idWhoWin ="+info[2]  +" WHERE id="+info[0]
 console.log(sql)
 
  db.con.query(sql, function(err, result) {         
    res.json(result)

    console.log(result,'from formedia')
               });
}
}
});

//########################################################################################################
//########################################################################################################
//########################################################################################################




//########################################################################################################
//##################################      sold main      #################################################
//########################################################################################################
router.get('/sold',function(req, res, next) {
  if(!req.session.myid){
    res.redirect('/login'); 
    
  }
  else{
  var sql = 'SELECT bidding.idProudct,bidding.price,proudcts.name,proudcts.image1,users.id,users.username,users.phone,users.img,users.email FROM bidding INNER JOIN proudcts ON bidding.idProudct=proudcts.id AND proudcts.idWhoAdded='+ req.session.myid +' AND proudcts.sold=1 AND proudcts.maxPrice=bidding.price INNER JOIN users ON bidding.idUser=users.id'
  
    db.con.query(sql, function(err, result) {if(err){console.log(err)}
         
    res.json(result);                 
               });
              }
});


// buyer adde proudcts and sold
router.post('/buyerInfo',function(req, res, next) {
  if(!req.session.myid){

    res.redirect('/login'); 
  }
  else{
  // var sql = 'SELECT bidding.idProudct,bidding.price,proudcts.name,proudcts.image1,users.id,users.username,users.phone,users.img,users.email FROM bidding INNER JOIN proudcts ON bidding.idProudct=proudcts.id AND proudcts.idWhoAdded='+ req.session.myid +' AND proudcts.sold=1 AND proudcts.maxPrice=bidding.price INNER JOIN users ON bidding.idUser=users.id'
  
    // db.con.query(sql, function(err, result) {if(err){console.log(err)}
         
    // res.json(result);                 
    //            });

console.log(req.body.ide)
  }
});


//########################################################################################################
//########################################################################################################
//########################################################################################################



//########################################################################################################
//##################################      won      #################################################
//########################################################################################################
router.get('/won',function(req, res, next) {
  if(!req.session.myid){

    res.redirect('/login'); 
  }
  else{
  var sql = 'SELECT  bidding.idProudct,proudcts.maxPrice,proudcts.name,proudcts.image1 ,users.id,users.username,users.phone,users.img,users.email  FROM proudcts INNER JOIN users on proudcts.idWhoWin='+req.session.myid +' AND proudcts.idWhoAdded=users.id INNER JOIN bidding ON bidding.idProudct=proudcts.id AND bidding.price=proudcts.maxPrice WHERE proudcts.sold=1'
  
    db.con.query(sql, function(err, result) {if(err){console.log(err)}
         
    res.json(result);                 
               });
              }
});


//########################################################################################################
//########################################################################################################
//########################################################################################################




//########################################################################################################
//##################################      bidded      #################################################
//########################################################################################################
router.get('/bidded',function(req, res, next) {
  if(!req.session.myid){

    res.redirect('/login'); 
  }
  else{
  var sql = 'SELECT DISTINCT proudcts.id,proudcts.name,proudcts.image1 FROM `proudcts` INNER JOIN bidding on bidding.idProudct=proudcts.id WHERE proudcts.sold=0 AND bidding.idUser='+req.session.myid;
  
    db.con.query(sql, function(err, result) {if(err){console.log(err)}
         
    res.json(result);                 
               });
              }
});


router.post('/biview',function(req, res, next) {
  if(!req.session.myid){
    res.redirect('/login'); 
    
  }
  else{


  var sql = "SELECT * FROM `bidding` WHERE idProudct="+req.body.idP
  
    db.con.query(sql, function(err, result) {if(err){console.log(err)}
         
    res.json({result:result,y:req.session.myid});                 
               });
              }
});

//bid here
router.post('/addMoreBid',function(req, res, next) {
  if(!req.session.myid){

    res.redirect('/login'); 
  }
  else{
  var sql = "INSERT INTO `bidding`(`idProudct`, `price`, `idUser`) VALUES ("+req.body.idP+","+req.body.Oprice+","+req.session.myid+")"
  
    db.con.query(sql, function(err, result) {if(err){console.log(err)}
         
    res.json(result);                 
               });
              }
});



//########################################################################################################
//########################################################################################################
//########################################################################################################





//########################################################################################################
//############################################   signup   ############################################
//########################################################################################################

/* post signup page. */
router.post('/signup',upload.single('pho'),function(req, res, next) {
  if (!req.file ||req.body.us==''||req.body.ph==''||req.body.em=='' ||req.body.pa1!=req.body.pa2) {
return res.status(400).send('No files were uploaded.');
}
else{
var sql = "INSERT INTO `users`( `username`, `phone`, `img`, `email`, `password`) VALUES ('" + req.body.us + "','" + req.body.ph + "','" + req.file.path.slice(6) + "','" + req.body.em + "','"+ req.body.pa1 + "')";
console.log(sql)
  db.con.query(sql, function(err, result) {
res.json({re:result});     
        });
        
}
});





// login post



router.post('/login', function(req, res, next) {

  var username = req.body.username;       var password = req.body.password;
 console.log(username,password)
  if (username && password) {
      db.con.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
        console.log(results)
        if (results.length > 0) {
              req.session.loggedin = true;
              req.session.username = username;
              req.session.myid = results[0].id;
              console.log(req.session.username)
              if(req.session.profile){
                res.json({re:req.session.profile}); 
              }
              else{
              res.json({re:"done"}); 
            }
            }
               else {
                 
                res.status(400).send('login fail.');              
              }			
      });
  }
});




router.get('/logout',function(req,res){    
  req.session.destroy(function(err){  
      if(err){  
          console.log(err);  
      }  
      else  
      {  
          res.redirect('/login');  
      }  
  });  

}); 
 








/* post signup page. */
router.post('/changePhotoProfile',upload.single('imgPRO'),function(req, res, next) {
  if(!req.session.myid){

    res.redirect('/login'); 
  }
  else{
console.log(req.file)


 var sql = "UPDATE users SET img='"+ req.file.path.slice(6) +"' WHERE id="+req.session.myid


console.log(sql)
  db.con.query(sql, function(err, result) {

    console.log('inside',sql)

res.redirect('/manage')


  });
}    

});













//########################################################################################################
//########################################################################################################
//########################################################################################################








module.exports = router;
