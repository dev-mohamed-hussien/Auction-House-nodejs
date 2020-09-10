var socket_io = require("socket.io");
var io = socket_io();
var socketApi = {};
var db = require('./database/dbhome');

socketApi.io = io;

socketApi.proudcts = function(backendid) {
   io.once("connection", function(socket) {
     console.log('connected')

socket.on('reqItems',(selectedCat)=>{
   console.log(selectedCat)

if(selectedCat=='all')
{

db.getAllItems().then((allItems)=>{

   socket.emit('resAllItems',allItems)
})

}

else{

   db.getDeterminedItems(selectedCat).then((determinedItems)=>{

      socket.emit('resDeterminedItems',determinedItems)

   })

}

})













//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//set pid

socket.on('setPid',(setPid)=>{


console.table(setPid)

// code here


var sql = "INSERT INTO `bidding`(`idProudct`, `price`, `idUser`) VALUES ("+setPid.id+","+setPid.value+","+backendid+")"
        console.log(sql)
          db.con.query(sql, function(err, result) {
             
     console.log('iam here')
    
     socket.emit('fu')
                
                });
    











})


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
     socket.on("disconnect", () => {
      console.log("disconected", socket.id);

    });
  });
} 



socketApi.deleteP=function (){
   io.once("connection", function(socket) {
      console.log('connected',socket.id)


      socket.on('deleteP',(id)=>{

 var sql = "delete from `proudcts`  where id ="+id
 console.log(sql)
         console.log(sql)
           db.con.query(sql, function(err, result) {
              
      console.log('iam here')
     
      socket.emit('deleteP2')
                 
                 });
     





      })



//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
socket.on("disconnect", () => {
   console.log("disconected", socket.id);

 });

 });
}





module.exports = socketApi;
