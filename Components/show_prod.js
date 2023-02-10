// Getting Value for Item Editing
var pname = document.getElementById("name");
var pqty = document.getElementById("pqty");
var price = document.getElementById("price");
var pdesc = document.getElementById("pdesc");
// console.log(pname, pqty, price, pdesc);
var img = document.getElementById("img");
New_url = "";
var save = document.getElementById("save");
// console.log(pqty, price, pdesc, save);

// Form
var form = document.getElementById("form");
// console.log(form);
var showProd = document.getElementById("showProd");
// console.log(showProd);
firebase
  .database()
  .ref("Items")
  .once("value", async (items) => {
    var data = Object.values(items.toJSON());
    console.log(data);
    data.map((getData) => {
      console.log(getData);
      showProd.innerHTML += `
      <div class="col col-lg-3 col-md-4 col-sm-6 col-12 m-2">
      <div class="card" style="width: 18rem;">
        <img src=${getData.Item_Img} class="card-img-top" alt="..." style="height:200px">
          <div class="card-body">
            <h3 class="card-title">${getData.Item_Name}        </h3>
            <p class="card-text" style='font-size:20px'><strong>Product Price:</strong> <br>Rs.${getData.Item_Price} </p>
            <p class="card-text"><strong>Porduct Quantity:</strong><br> ${getData.Item_Quantity} </p>
            <p class="card-text"><strong>Product Description:</strong> <br>${getData.Item_Desc} </p>
            <button class="btn btn-primary btn-sm btn_card"  onclick='edit(this)' id=${getData.Item_UID}>Edit Product</button>
            <button class="btn btn-danger text-right btn-sm btn_card" onclick='deletefunc(this)' id=${getData.Item_UID}>Delete Product</button>
            
          </div>
      </div>
    </div>
        `;
    });
  });

const deletefunc = (e) => {
  console.log("Click");
  console.log(e.id);
  firebase.database().ref("Items").child(e.id).remove();
  window.location.reload();
  alert("Product deleted");
};



const edit = (e) => {
  form.style.display = "block";
  console.log("Click");
  console.log(e.id);

  firebase
    .database()
    .ref("Items")
    .child(e.id)
    .once("value", (data) => {
      var item = Object.values(data.toJSON());
      console.log(item);
      pname.value = item[5];
      pqty.value = item[7];
      price.value = item[6];
      pdesc.value = item[3];
      oldUrl = item[4];
    });
  // Getting Image from Form
  img_flag = false;
  img.onchange = (e) => {
    console.log("Click");
    file = e.target.files;
    imgreader = new FileReader();
    imgreader.onload = (e) => {};
    imgreader.readAsDataURL(file[0]);
    console.log(file[0]);
    // Uplpoading Image Flag
    img_flag = true;
  };
  // Edit Flag
  save.addEventListener("click", async (event) => {
    event.preventDefault();
    console.log("Click");
    console.log(e.id);
    // console.log(file[0])
    console.log(img_flag);
    if (img_flag == true) {
      var uploadImg = firebase
        .storage()
        .ref("Images")
        .child(file[0].name)
        .put(file[0]);
      await uploadImg.snapshot.ref.getDownloadURL().then((url) => {
        console.log(url);
        New_url = url;
        console.log(New_url);
      });
      console.log("Upload ");
    }
    console.log(New_url);
    await firebase
      .database()
      .ref("Items")
      .child(e.id)
      .update({
        Item_Name: pname.value,
        Item_Price: price.value,
        Item_Quantity: pqty.value,
        Item_Desc: pdesc.value,
        Item_Img: New_url == "" ? oldUrl : New_url
      });
      window.location.reload()
    });

};
