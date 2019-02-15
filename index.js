let HttpClient = function(){
  this.get = function(url, callback){
    let request = new XMLHttpRequest();
    request.onreadystatechange = function(){
      if(request.readyState == 4 && request.status == 200){
        callback(request.responseText);
      }
    }

    request.open("GET", url, true);
    request.send();
  }
}

//let url = "https://www.westelm.com/services/catalog/v4/category/shop/new/all-new/index.json";
//got CORS error so read directly from the json file
let url = "products.json";
let client = new HttpClient();
let products= [];

client.get(url,function(res){
  products = JSON.parse(res);
  console.log(products.groups);
  renderProducts(products.groups);
});

let renderProducts = function(products=[]){
  if(products.length == 0){
    let message = document.getElementById("message");
    message.innerHTML = `<h3>No product found</h3>`;
  }else{
    let list = document.getElementById("list");

    let dialog = document.createElement('DIALOG');
    dialog.setAttribute('id','myDialog');
    dialog.setAttribute('class','dialog');
    document.body.appendChild(dialog);

    for(let product of products){
      let div = document.createElement("DIV");
      div.setAttribute("class","col-4 product");
      div.innerHTML = `
          <h3>${product.name}</h3>
          <img onclick="popup('${product.id}')" src="${product.hero.href}" alt="${product.name}" />
          <p>
            Price range: ${product.priceRange.selling.high}-${product.priceRange.selling.low}
          </p>
        `;

      list.appendChild(div);
    }
  }

}


// popup to show the dialog
let popup = function(id){

  images = products.groups.filter(i=> i.id==id).map(p=>p.images)[0] || [];
  currentImageIndex = 0;
  console.log(images);
  let dialog = document.getElementById('myDialog');

  if(images.length == 0){
    dialog.innerHTML = `
    <p>Product Id - ${id}</p>
    <p>There is additional images</p>
    <div class="row" style="text-align: center">
        <button onclick="closeDialog()">Close</button>
    </div>
    `;
  }else{
    dialog.innerHTML = `
    <p>Product id - ${id}</p>
    <img id="imageOnShow"/>
    <div class="row" style="display: inline-block">
        <button style="float: left" onclick="showPreviousImage()">Previous</button>
        <button style="float: right" onclick="showNextImage()">Next</button>
    </div>
    <div class="row" style="text-align: center">
        <button onclick="closeDialog()">Close</button>
    </div>
    `;

    loadImage();
  }

  dialog.showModal();
}

let closeDialog = function(){
  document.getElementById('myDialog').close();
}


//this section is handle all image related functions
let images = [];
let currentImageIndex = 0;
let showPreviousImage = function(){
  currentImageIndex++;

  if(currentImageIndex >= images.length){ // assume that carousal will go round and round
    currentImageIndex = 0;
  }

  loadImage();
}

let showNextImage = function(){
  currentImageIndex--;

  if(currentImageIndex < 0){ // assume that carousal will go round and round
    currentImageIndex = images.length-1;
  }

  loadImage();
}

let loadImage = function(){
  document.getElementById('imageOnShow').src = images[currentImageIndex].href;
}
