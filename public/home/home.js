// active page here home 

document.getElementById("ho1").classList.add("active");
document.getElementById("ho1i").classList.add("activefont");


// reload
console.log(performance.navigation.type)
if(performance.navigation.type == 2){
  location.reload(true);
}

// function of view item info 

function viewItemInfo(id,name,image1,image2,image3,describ,currentPrice,max,min){

  document.getElementById('viewer').innerHTML=`
  <div style="
  border-bottom: 0px;
"  class="">
<i onclick=" closeEle()" id='closeres' class="closeviewer fas fa-times" ></i>
  <div class="">
    <div class="product-gallery"style='    margin-left: 10px;
    margin-right: 10px;
    margin-top: 10px;
    '>
      <div class="product-image" style='text-align: center;'>
        <img class="active" src="${image1}">
      </div>
      <ul class="image-list">
        <li class="image-item"><img src="${image1}"></li>
        <li class="image-item"><img src="${image2}"></li>
        <li class="image-item"><img src="${image3}"></li>
      </ul>
    </div>
  </div>
  <div style='
  margin-right: 26px;
  margin-left: 26px;
  margin-bottom: 20px;
  'class="">
    <h1 style='
    color: rgb(255, 255, 255);
    margin-bottom: 0px;
    font-size: 21px;
    margin-left: 30px;
    height: 6%;
    margin-top: 4%;
    text-align: center;
    ' >Name : ${name}</h1>
    <h2 style='      text-align: center;
    height: 4%;
    color: rgb(255, 255, 255);
    font-size: 14px;
     margin-left: 30px;
      '  >Max offering : ${max} $</h2>
    <h2 style='   
     height: 4%;
     color: rgb(255, 255, 255);
      font-size: 14px;
       margin-left: 30px;
       text-align: center;

       '  >Min offering  : ${min} $</h2>
    
    <div style='     height: 350px;
    padding-top: 10px;
    text-align: center;
    ' class="scrollbar description">
    <span style="
    font-weight: 700;
    font-size: 14px;
    top: 228px;
">Description : </span>


      <p style='margin-left: 30px;'>${describ}</p>
    </div>


    <div id="offeress" class='scrollbar' style="
    height: 154px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 2%;
    overflow: overlay;
    margin-top: 2%;  
">
<span style="
    font-size: 14px;
    top: 374px;
">Offers : </span>


</div>




    <div class="input-group mb-3" style="
    margin-bottom: 0px!important;
">
    <input id='myBidInput' type="number" class="form-control" placeholder="enter your offer" aria-label="Recipient's username" aria-describedby="basic-addon2">
    <div class="input-group-append">
      <button onclick='bidnow(${id},${max},${min})' class="btn btn-outline-secondary" type="button">Bid now</button>
    </div>
  </div>
    </div>
  </div>
  `
// get offeres to show on viewer
$.post('/biview',{idP:id},function(x){

for (let index = 0; index < x.result.length; index++) {

if(x.result[index].idUser==x.y)
{

  document.getElementById('offeress').innerHTML +=`
  
  <h1 style="    color: white;    font-size: 13px;        margin-left: 30px;    margin-top: 4px;    margin-bottom: 4px;">me offered : ${x.result[index].price} $</h1>

  `
  continue;
}


document.getElementById('offeress').innerHTML +=`
  
<h1 style="    color: white;    font-size: 13px;    margin-left: 30px;    margin-top: 4px;    margin-bottom: 4px;">someone offered : ${x.result[index].price} $</h1>

`
}
  
})

///////////////////////////////


  document.getElementById('viewer').style.display='block';
  // image slide

const activeImage = document.querySelector(".product-image .active");
const productImages = document.querySelectorAll(".image-list img");
const navItem = document.querySelector('a.toggle-nav');

function changeImage(e) {
  activeImage.src = e.target.src;
}

function toggleNavigation(){
  this.nextElementSibling.classList.toggle('active');
}

productImages.forEach(image => image.addEventListener("click", changeImage));
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var socket = io.connect();

socket.once('connect',()=>{
    console.log('Connected from client', Date.now() );
}) ;

//<<>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


cheakCat('all')
function cheakCat(selectedCat){


  socket.emit('reqItems',selectedCat)

  console.log("hi",selectedCat)
}


// item it self


socket.on('resAllItems',(allItems)=>{
  document.getElementById('viewProudcts').innerHTML="<p></p> "

for (let index = 0; index < allItems.length; index++) {
  allItems[index].describ="`'"+allItems[index].describ+"'`";

  document.getElementById('viewProudcts').innerHTML+=`
  
  <div class="col col-12 col-md-6 col-lg-4 col-xl-3">
  <div class="card" style="width: 100%;">
  
  <div style="
  background: white;
  text-align: center;
">

      <img src="${allItems[index].image1}" class="card-img-top" style="height: 200px;    max-width: 284px;">
      </div>
    
      <div style='padding: 0px;' class="card-body">
        <h5 class="card-title">
        </h5>
        <p style=" font-size: 15px; text-align: center;  font-weight: 600; margin-bottom: 2px; margin-top: 2px;">Name :  ${allItems[index].name}</p>
        <p style='margin-bottom: 2px;text-align:center '> Min Bidding Price: ${allItems[index].minPrice} $</p>
        <p style='margin-bottom: 5px;text-align:center '> Max Bidding Price: ${allItems[index].maxPrice} $</p>



        <ul class="profile-options horizontal-list">
        <p></p>
<li style=" width: 100%;    border-left: rgb(253, 245, 230);"><a  onclick="viewItemInfo('${allItems[index].id}','${allItems[index].name}','${allItems[index].image1}','${allItems[index].image2}','${allItems[index].image3}',${allItems[index].describ},'${allItems[index].currentPrice}','${allItems[index].maxPrice}','${allItems[index].minPrice}')"    class="likes" href="#42" style="border-top: 4px solid green;width: 100%;"><p style=" font-size: 14px;"><span class="icon fontawesome-heart-empty scnd-font-color">
</span>View info </p></a></li><p></p>      </ul>

        </div>
    </div>
  </div>
  `
  
}



console.table(allItems)
})

socket.on('resDeterminedItems',(determinedItems)=>{
  document.getElementById('viewProudcts').innerHTML="<p></p> "

  for (let index = 0; index < determinedItems.length; index++) {
    determinedItems[index].describ="`'"+determinedItems[index].describ+"'`";

    document.getElementById('viewProudcts').innerHTML +=`
   
    <div class="col col-12 col-md-6 col-lg-4 col-xl-3">
    <div class="card" style="width: 100%;">
    <div style="
    background: white;
    text-align: center;
  ">
        <img src="${determinedItems[index].image1}" class="card-img-top" style="height: 200px;    max-width: 284px;">
     </div>
        <div style='padding: 0px;' class="card-body">
          <h5 class="card-title">
          </h5>
          <p style=" font-size: 15px; text-align: center;  font-weight: 600; margin-bottom: 2px; margin-top: 2px;">Name :  ${determinedItems[index].name}</p>
          <p style='margin-bottom: 2px;text-align:center '> Min Bidding Price: ${determinedItems[index].minPrice} $</p>
          <p style='margin-bottom: 5px;text-align:center '> Max Bidding Price: ${determinedItems[index].maxPrice} $</p>
  
  
  
          <ul class="profile-options horizontal-list">
          <p></p>
  <li style=" width: 100%;    border-left: rgb(253, 245, 230);"><a   onclick="viewItemInfo('${determinedItems[index].id}','${determinedItems[index].name}','${determinedItems[index].image1}','${determinedItems[index].image2}','${determinedItems[index].image3}',${determinedItems[index].describ},'${determinedItems[index].currentPrice}','${determinedItems[index].maxPrice}','${determinedItems[index].minPrice}')"    class="likes" href="#42" style="border-top: 4px solid green;width: 100%;"><p style=" font-size: 14px;"><span class="icon fontawesome-heart-empty scnd-font-color">
  </span>View info </p></a></li><p></p>      </ul>
  
          </div>
      </div>
    </div>
    `
    
  }

 
console.table(determinedItems)
})








// close viewr 
function closeEle(){
  document.getElementById('viewer').style.display='none'
}
// bidding
function bidnow(id,max,min){
  var xinput = document.getElementById('myBidInput').value;
var input = xinput.replace(/<\/?[^>]+>/ig, " ");

if($.trim(input) === ''||input<=min||input>max){
   return false;
}
else{
  document.getElementById('myBidInput').value='';
console.log('u r bided ',input)
socket.emit('setPid',{
id:id,
max:max,
min:min,
value:input
})



}



}

socket.on('fu',()=>{
  document.getElementById('myBidInput').value=' '
console.log('done')



})


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

var noProudct = `<div class="alert alert-danger">There is No Products</div>`



