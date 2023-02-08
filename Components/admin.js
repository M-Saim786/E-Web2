var showAdmin = document.getElementById("showAdmin");
var getUId = localStorage.getItem("uid");
var date =new Date()
curr_date = date.getDate()+'-' +(date.getMonth()+1)+ '-'+date.getFullYear()
curr_time  =localStorage.getItem("time");
console.log(date)
firebase
  .database()
  .ref("Admin")
  .child(getUId)
  .once("value", (adminData) => {
    var data = Object.values(adminData.toJSON());
    console.log(data);
    showAdmin.innerHTML = `
<tr>
<th>Admin Name</th>
<th>Admin Email</th>
<th>Admin Password</th>
<th>Admin UID</th>
<th>Login Date & Time</th>
</tr>
<tr>
<td>${data[1]}</td>
<td> ${data[0]}</td>
<td> ${data[2]}</td>
<td>${data[4]}</td>
<td>${curr_date} <br> ${curr_time}</td>

</tr>
`;
  });
