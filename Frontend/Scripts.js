// let left = document.querySelector("#leftbtn")
// let right = document.querySelector("#rightbtn")
// let cards = document.querySelector(".cards")[0]

// right.addEventListener('click',()=>{
//     cards.scrollRight += 260
//     // console.log(right)
// })
// left.addEventListener('click',()=>{
//     cards.scrollLeft -= 140
// })
let snackId;

fetch('http://localhost:8080/viewsnack')
  .then(response => response.json())
  .then(data => {
    const cardsDiv = document.querySelector('.cards');
    data.forEach((snack,index) => {
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('card');
      cardDiv.dataset.id = snack.id;
      const imgWithPriceDiv = document.createElement('div');
      imgWithPriceDiv.classList.add('imgwithprice');
      const img = document.createElement('img');
    //   img.src = 'http://www.warrnamboolrsl.org/__static/static/266/photo-002.png';
    img.src = snack.image;
    console.log(snack.image)
      img.alt = '';
      img.classList.add('dish');
      const priceH4 = document.createElement('h4');
      priceH4.textContent = `₹${snack.price}`;
      imgWithPriceDiv.appendChild(img);
      imgWithPriceDiv.appendChild(priceH4);
      const nameH5 = document.createElement('h5');
      nameH5.textContent = snack.name;
      cardDiv.appendChild(imgWithPriceDiv);
      cardDiv.appendChild(nameH5);
      cardsDiv.appendChild(cardDiv);
      if(index == 0){
        let poster = document.getElementById("poster");
        let title = document.getElementById("title");
        let price_cont = document.getElementsByClassName("price_cont");

        poster.src = snack.image;
        title.innerText = snack.name
        price_cont.innerText = snack.price
        snackId = snack.id
      }
    });

    // Add event listener to each card div
    const cardDivs = document.querySelectorAll('.card');
    cardDivs.forEach(cardDiv => {
      cardDiv.addEventListener('click', handleCardClick);
    });
  });
//   let poster = document.getElementById("poster");
//   let title = document.getElementById("title");
//   let price_cont = document.getElementsByClassName("price_cont");

//   Array.from(document.getElementsByClassName("card")).forEach((ele,i)=>{
//     // console.log(ele)

// ele.addEventListener('click',()=>{
//     poster.src = ele.getElementsByTagName('img')
// })

//   })





  

// Define global variable to store snack ID


// Function to handle card div click event
// Function to handle card div click event
// Function to handle card div click event
function handleCardClick(event) {
    // Get snack data from clicked card div
    const snackName = event.currentTarget.querySelector('h5').textContent;
    const snackPrice = event.currentTarget.querySelector('h4').textContent;
    snackId = event.currentTarget.dataset.id;
    console.log(snackId)
    // Update poster image, title, and price elements
    const posterImg = document.querySelector('#poster');
    posterImg.src = event.currentTarget.querySelector('img').src;
    const titleH1 = document.querySelector('#title');
    titleH1.textContent = snackName;
    const priceH2 = document.querySelector('#price_cont');
    priceH2.textContent = snackPrice;
  }

// // Add event listener to each card div
// const cardDivs = document.querySelectorAll('.card');
// cardDivs.forEach(cardDiv => {
//     console.log(cardDivs)
//   cardDiv.addEventListener('click', handleCardClick);
// });

// // Function to handle order button click event
// function handleOrderClick(event) {
//     alert("working")
//   event.preventDefault();
//   const nameInput = document.querySelector('#name');
//   const customerName = nameInput.value;
//   if (!customerName) {
//     alert('Please enter your name');
//     return;
//   }
//   const data = { name: customerName, id: snackId };
//   const userId = localStorage.getItem('userId');
//   console.log("USSR "+userId)
//   fetch(`/takeorder/${userId}`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data)
//   })
//     .then(response => response.json())
//     .then(data => {
//       alert(data.message);
//       nameInput.value = '';
//     })
//     .catch(error => {
//       console.error(error);
//       alert('An error occurred while placing your order');
//     });
// }

// // Add event listener to order button
// const orderButton = document.querySelector('#OrderNow');
// orderButton.addEventListener('click', handleOrderClick);  


// const orderButton = document.querySelector('#OrderNow');
// orderButton.addEventListener('click', function(event) {
//   event.preventDefault();
//   const nameForm = document.createElement('form');
//   const nameLabel = document.createElement('label');
//   nameLabel.textContent = 'Enter your name:';
//   const nameInput = document.createElement('input');
//   nameInput.type = 'text';
//   nameInput.id = 'nameInput';
//   const submitButton = document.createElement('button');
//   submitButton.type = 'submit';
//   submitButton.textContent = 'Submit';
//   nameForm.appendChild(nameLabel);
//   nameForm.appendChild(nameInput);
//   nameForm.appendChild(submitButton);
//   document.body.appendChild(nameForm);
//   nameForm.addEventListener('submit', function(event) {
//     event.preventDefault();
//     const customerName = nameInput.value;
//     if (!customerName) {
//       alert('Please enter your name');
//       return;
//     }
//     const data = { name: customerName, id: snackId };
//     const userId = localStorage.getItem('userId');
//     console.log("USSR "+userId)
//     fetch(`http://localhost:8080/takeorder/${userId}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(data)
//     })
//       .then(response => response.json())
//       .then(data => {
//         alert(data.message);
//         nameForm.remove();
//       })
//       .catch(error => {
//         console.error(error);
//         alert('An error occurred while placing your order');
//       });
//   });
// });


const orderButton = document.querySelector('#OrderNow');
orderButton.addEventListener('click', function(event) {
  event.preventDefault();
  const orderFormContainer = document.getElementById('form-containerorder');
  orderFormContainer.style.display = 'block';
});

const orderForm = document.getElementById('order-food-form');
orderForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const nameInput = document.getElementById('name');
  const customerName = nameInput.value;
  if (!customerName) {
    alert('Please enter your name');
    return;
  }
  const data = { name: customerName, id: snackId };
  const userId = localStorage.getItem('userId');
  console.log("User ID: " + userId);
  fetch(`http://localhost:8080/takeorder/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      alert(data.message);
      nameInput.value = '';
      const orderFormContainer = document.getElementById('form-containerorder');
      orderFormContainer.style.display = 'none';
    })
    .catch(error => {
      console.error(error);
      alert('An error occurred while placing your order');
    });
});

function ViewOrders(){
    window.location.href = 'Orders.html';
}

const ordersLink = document.querySelector('#ViewOrders');
ordersLink.addEventListener('click', function(event) {
  event.preventDefault();
  const ordersContainer = document.getElementById('orders-container');
  ordersContainer.style.display = 'block';
  const ordersTableBody = document.querySelector('#orders-table tbody');
  ordersTableBody.innerHTML = '';
  const userId = localStorage.getItem('userId');
  fetch(`http://localhost:8080/vieworders/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      alert("viewing orders")
      data.orders.forEach(order => {
        const row = document.createElement('tr');
        const idCell = document.createElement('td');
        idCell.textContent = order.id;
        const customerNameCell = document.createElement('td');
        customerNameCell.textContent = order.customer_name;
        const itemNameCell = document.createElement('td');
        itemNameCell.textContent = order.item_name;
        const statusCell = document.createElement('td');
        statusCell.textContent = order.status;
        row.appendChild(idCell);
        row.appendChild(customerNameCell);
        row.appendChild(itemNameCell);
        row.appendChild(statusCell);
        


        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel Order';
        cancelButton.dataset.id = order.id;
        row.appendChild(cancelButton);
        cancelButton.addEventListener('click', function(event) {
          event.preventDefault();
          const orderId = event.target.dataset.id;
          fetch(`http://localhost:8080/deleteorder/${userId}/${orderId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          })
            .then(response => response.json())
            .then(data => {
              alert(data.message);
            //   window.location.reload();
            })
        })  


        ordersTableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error(error);
      alert('An error occurred while fetching orders');
    });
});

function Logout(){
    window.location.href = "login.html"
}