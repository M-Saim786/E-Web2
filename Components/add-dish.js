var pname = document.getElementById("Pname");
var Pprice = document.getElementById("Pprice");
var Pqty = document.getElementById("qty");
var Pdesc = document.getElementById("Pdesc");
// console.log(pname, Pprice, Pqty);

var imageBtn = document.getElementById("imageBtn");
// console.log(imageBtn);

var image = document.getElementById("image");
// console.log(image);
image.addEventListener("click", function () {
  image.onchange = (e) => {
    file = e.target.files;
    var ImgRead = new FileReader();
    ImgRead.onload = function () {};
    ImgRead.readAsDataURL(file[0]);
    console.log(file[0]);
    console.log(file[0].name);
    // console.log(ImgRead.result)
  };
});

var submit = document.getElementById("submit");
console.log(submit);
submit.addEventListener("click", async function (e) {
  e.preventDefault();

  // Uploading Image And Getting URL
  var Img_Up = firebase
    .storage()
    .ref("Images/")
    .child(file[0].name)
    .put(file[0]);

  await Img_Up.snapshot.ref.getDownloadURL().then((getUrl) => {
    imgurl = getUrl;
    console.log(imgurl);
  });
  // getting date
  var date = new Date();
  curr_date = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
  curr_time =
    date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds();

  admin_ID = localStorage.getItem("uid");
  // console.log(admin_ID);
  var item_key = firebase.database().ref("Items").push().getKey();
  // console.log(item_key);
  console.log(Pqty.value)
  await firebase.database().ref("Items").child(item_key).set({
    Item_Name: pname.value,
    Item_Price: Pprice.value,
    Item_Quantity: Pqty.value,
    Item_Desc: Pdesc.value,
    Item_Img: imgurl,
    Item_UID: item_key,
    Item_Add_Date: curr_date,
    Item_Add_Time: curr_time,
    Admin_UID: admin_ID,
  });

  // setTimeout((
  window.location = "show_prod.html";
  // ), 5000);
});
