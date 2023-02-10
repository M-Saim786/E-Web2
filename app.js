console.log(firebase.auth());

var Uname = document.getElementById("name");
var email = document.getElementById("email");
var password = document.getElementById("password");
var role = document.getElementsByName("role");
console.log(role);
console.log(name, email, password);
// Loader
var spinner = document.getElementById("spinner");
console.log(spinner);

// Getting ALerts
var success = document.getElementById("success");
console.log(success);
var warning = document.getElementById("warning");
console.log(warning);
var smsg = document.getElementById("smsg");
var wmsg = document.getElementById("wmsg");
console.log(smsg, wmsg);

var signUp = document.getElementById("signUp");
console.log(signUp);
signUp.addEventListener("click", (e) => {
  e.preventDefault();
  var getrole = "";
  for (let i = 0; i < role.length; i++) {
    // const element = array[i];
    if (role[i].checked) {
      getrole = role[i].value;
      console.log(getrole);
    }
  }

  firebase
    .auth()
    .createUserWithEmailAndPassword(email.value, password.value)
    .then((user) => {
      console.log(user.user.uid);
      uid = user.user.uid;
      localStorage.setItem("uid", user.user.uid);
      console.log(uid);
      var obj = {
        Name: Uname.value,
        Email: email.value,
        Password: password.value,
        Role: getrole,
        UID: user.user.uid,
      };
      if (getrole == "") {
        alert("No role found");
      } else if (getrole == "admin") {
        firebase.database().ref("Admin").child(uid).set(obj);
        console.log(getrole);
        window.location = "./Components/admin.html";

        alert("Account Created as  Admin");
      } else if (getrole == "user") {
        firebase.database().ref("User").child(uid).set(obj);

        console.log(getrole);
        alert("Account Created as  User");
        window.location.reload();
      }
    })
    .catch((error) => {
      console.log(error);
      alert(error.message);
    });
});

// taking login form values
var lname = document.getElementById("lname");
var lemail = document.getElementById("lemail");
var lpassword = document.getElementById("lpassword");
// Sign In Function
var signIn = document.getElementById("signIn");

console.log(signIn);
signIn.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Sign In");
  get_role = "";
  role.forEach((element) => {
    if (element.checked) {
      get_role = element.value;
    }
  });
  console.log(get_role);

  firebase
    .auth()
    .signInWithEmailAndPassword(lemail.value, lpassword.value)
    .then((user) => {
      console.log(user.user.uid);
      localStorage.setItem("uid", user.user.uid);


      if (get_role == "") {
        alert("No role found");
      } else if (get_role == "admin") {
        console.log(get_role);
        alert("Sign In as Admin");
        window.location = "./Components/admin.html";
        var date = new Date();
        curr_time =
          date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        localStorage.setItem("time", curr_time);
      } 
      else if (get_role == "user") {
        console.log(get_role);
        alert("Sign In as User");
        // window.location.reload();
    
      }


    })
    .catch((error) => {
      console.log(error);
      alert(error.message);
    });

});


// Show Cardssss

var show = document.getElementById("show");

firebase
  .database()
  .ref("Items")
  .once("value", (snap) => {
    var data = Object.values(snap.toJSON());
    // console.log(data);

    data.map((item) => {
      console.log(item);
      show.innerHTML += `
      <div class="col col-lg-3 col-md-4 col-sm-6 col-12 mx-3 my-2">
      <div class="card" style="width: 18rem;">
          <img src=${item.Item_Img} class="card-img-top" alt="..." style="height:200px">
          <div class="card-body">
              <h4 class="card-title ">${item.Item_Name} </h4>
              <p class="card-text"><b>Product Price</b> "${item.Item_Price}" </p>
              <p class="card-text"><b>Product Quantity</b> "${item.Item_Quantity}" </p>
              <p class="card-text"><b>Product Description</b> "${item.Item_Desc}" </p>
              <a href="#" class="btn btn-primary order_btn" onclick='order(this)' id=${item.Item_UID}>Order Now</a>
          </div>
      </div>
  </div>
    `;
    });
  });

const order = async (e) => {
  // console.log("Order");

  // console.log(e.id);
  UserId = localStorage.getItem("uid");
  console.log(UserId);
  if (UserId == null) {
    // alert("Login Or Register Your-Self before Order");
    warning.classList.remove("hide");
    wmsg.innerText = "Please Login or Register";
    setTimeout(() => {
      warning.classList.add("hide");
    }, 3000);
  } else {
    Orderkey = firebase.database().ref("Orders").push().getKey();
    console.log(Orderkey);
    loading = false;
    var inpQty = parseInt(prompt("Enter Quantity for Order"));
    firebase
      .database()
      .ref("Items")
      .child(e.id)
      .once("value", async (item) => {
        var data = Object.values(item.toJSON());
        console.log(data);
        await firebase.database().ref("Orders").child(Orderkey).set({
          Order_ID: Orderkey,
          Order_NAME: data[5],
          Order_Price: data[6],
          Order_Quantity: inpQty,
          Order_Img: data[4],
          Item_UID: data[8],
          Order_Status: "Ordered",
          Order_Description: data[3],
          User_ID: UserId,
        });

        // Insert In MyOrderS
        await firebase
          .database()
          .ref("User")
          .child(UserId)
          .child("MyOrders")
          .child(Orderkey)
          .set({
            Order_ID: Orderkey,
            Order_NAME: data[5],
            Order_Price: data[6],
            Order_Quantity: data[7],
            Order_Img: data[4],
            Item_UID: data[8],
            Order_Status: "Ordered",
            Order_Description: data[3],
            User_ID: UserId,
          });
        loading = true;
        spinner.classList.remove("hide");
        console.log(loading);
        if (loading == true) {
          success.classList.remove("hide");
          setTimeout(()=>{
            spinner.classList.add("hide");
            success.classList.add("hide")
          },2000);
          smsg.innerText = "Order.! Placed ";
          // window.location ='./Components/order.html'
        }
      });
  }
};
