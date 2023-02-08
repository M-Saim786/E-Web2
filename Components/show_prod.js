var showProd = document.getElementById("showProd");
console.log(showProd);

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
            <h5 class="card-title">${getData.Item_Name}        </h5>
            <p class="card-text">${getData.Item_Price} </p>
            <p class="card-text">${getData.Item_Quantity} </p>
            <p class="card-text">${getData.Item_Desc} </p>

          </div>
      </div>
    </div>
        `;
    });
  });
