var cards = document.getElementById("cards");
console.log(cards);
firebase
  .database()
  .ref("Orders")
  .once("value", async (data) => {
    var data = Object.values(data.toJSON());
    console.log(data);
    data.map((value) => {
      console.log(value);
      cards.innerHTML += `
  <tr>
    <td >${value.User_ID}</td>
    <td >${value.Order_NAME}</td>
    <td >${value.Order_Price}</td>
    <td >${value.Order_Quantity}</td>
    <td >${value.Order_Description}</td>
    <td >${value.Order_Status}</td>
    <td id=${value.User_ID}>
<select name="" id=${value.Order_ID} onchange='order_res(this)'>
    <option disabled selected>Select Order Response</option>
    <option value="Ordered">Ordered</option>
    <option value="Deleted">Deleted</option>
    <option value="Reject">Reject</option>
    <option value="Delievered">Delievered</option>
</select>
</td>
</tr>
  </div>
</div>
`;
    });
  });


  const order_res =(e)=>{
    console.log('Cgange')
    console.log(e.id)
    console.log(e.parentNode.id)
    console.log(e.value)
firebase.database().ref('Orders').child(e.id).update({
  Order_Status : e.value
})


firebase.database().ref('User').child(e.parentNode.id).child('MyOrders').child(e.id).update({
  Order_Status : e.value
})
window.location.reload()
  }