const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme_toggler");


menuBtn.addEventListener('click',()=>{
    sideMenu.style.display = 'block';
})

closeBtn.addEventListener('click',()=>{
    sideMenu.style.display = 'none';
})

// change theme
themeToggler.addEventListener('click',()=>{
    document.body.classList.toggle('dark-theme-variable');

    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');

})


// // fill orders in table

// Orders.forEach(order => {
//     const tr = document.createElement('tr');
//     const trContent = `
//     <td>${order.productName}</td>
//     <td>${order.productNumber}</td>
//     <td>${order.paymentStatus}</td>
//     <td class=${order.shipping == 'Declined'?'danger' : order.shipping == 'pending'?'warning':'success'}>${order.shipping}</td>
//     <td class="primary">Details</td>
//     `;

// tr.innerHTML = trContent;
// document.querySelector('table tbody').appendChild(tr);

// })

var snackId;
window.onload = function() {
    // fetch data from the backend using fetch API
    fetch('http://localhost:8080/viewtopsnacks')
      .then(response => response.json())
      .then(data => {
        // fill orders in table
        data.forEach(snack => {
          const tr = document.createElement('tr');
          const trContent = `
            <td>${snack.id}</td>
            <td>${snack.name}</td>
            <td>₹${snack.price}</td>
            <td>
            <button class="delete" data-id="${snack.id}">Delete</button>
            <button class="updatebtn" data-id="${snack.id}">Update</button>
            </td>
          `;
          tr.innerHTML = trContent;
          document.querySelector('table tbody').appendChild(tr);
        });
        // add event listeners to buttons
        const deleteButtons = document.querySelectorAll('.delete');
        deleteButtons.forEach(button => {
          button.addEventListener('click', (event) => {
             snackId = event.target.dataset.id;
            // do something with snackId
            fetch(`http://localhost:8080/deletesnack/${snackId}`, {
                method: 'DELETE'
              })
              .then(response => response.json())
              .then(data => {
                // Handle the response from the backend API
                // alert("Item deleted successfully")
                console.log(data);
                window.location.reload()
              })
              .catch(error => console.error(error));
            
          });
        });
        const updateButtons = document.querySelectorAll('.updatebtn');
        updateButtons.forEach(button => {
          button.addEventListener('click', (event) => {
             snackId = event.target.dataset.id;
             document.getElementById('form-containerupdate').style.display = "block";


             const updateFoodForm = document.getElementById("update-food-form")
    const formContainer = document.getElementById('form-containerupdate');
    formContainer.style.display = "block";

updateFoodForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(updateFoodForm);
    const name = formData.get('name');
    const price = formData.get('price');
    const image_url = formData.get('image_url');
    const availability = formData.get('availability');
    const snackData = { name, price,image_url,availability}
    // Perform the fetch request to the backend API with the form data
    fetch(`http://localhost:8080/updatesnack/${snackId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(snackData)
      })
      .then(response => response.json())
      .then(data => {
        // Handle the response from the backend API
        console.log(data);
        window.location.reload()
      })
      .catch(error => console.error(error));
  });
            // do something with snackId
          });
        });
      })
      .catch(error => console.error(error));
  };





  function ViewAllSnacks(){
    fetch('http://localhost:8080/viewsnack')
      .then(response => response.json())
      .then(data => {
        // fill orders in table
        data.forEach(snack => {
          const tr = document.createElement('tr');
          const trContent = `
            <td>${snack.id}</td>
            <td>${snack.name}</td>
            <td>₹${snack.price}</td>
            <td>
            <button class="delete" data-id="${snack.id}">Delete</button>
            <button class="updatebtn" data-id="${snack.id}">Update</button>
            </td>
          `;
          tr.innerHTML = trContent;
          document.querySelector('table tbody').appendChild(tr);
        });
        // add event listeners to buttons
        const deleteButtons = document.querySelectorAll('.delete');
        deleteButtons.forEach(button => {
          button.addEventListener('click', (event) => {
             snackId = event.target.dataset.id;
            // do something with snackId
            fetch(`http://localhost:8080/deletesnack/${snackId}`, {
                method: 'DELETE'
              })
              .then(response => response.json())
              .then(data => {
                // Handle the response from the backend API
                // alert("Item deleted successfully")
                console.log(data);
                window.location.reload()
              })
              .catch(error => console.error(error));
          });
        });
        const updateButtons = document.querySelectorAll('.updatebtn');
        updateButtons.forEach(button => {
          button.addEventListener('click', (event) => {
             snackId = event.target.dataset.id;
            document.getElementById('form-containerupdate').style.display = "block";
            // do something with snackId
            document.getElementById('form-containerupdate').style.display = "block";


             const updateFoodForm = document.getElementById("update-food-form")
    const formContainer = document.getElementById('form-containerupdate');
    formContainer.style.display = "block";

updateFoodForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(updateFoodForm);
    const name = formData.get('name');
    const price = formData.get('price');
    const snackData = { name, price}
    // Perform the fetch request to the backend API with the form data
    fetch(`http://localhost:8080/updatesnack/${snackId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(snackData)
      })
      .then(response => response.json())
      .then(data => {
        // Handle the response from the backend API
        console.log(data);
        window.location.reload()
      })
      .catch(error => console.error(error));
  });
          });
        });
      })
      .catch(error => console.error(error));
  }



//   Adding Food start

function addFoodBtn(){
    const addFoodForm = document.getElementById("add-food-form")
    const formContainer = document.getElementById('form-container');
    formContainer.style.display = "block";
  const closeBtn = document.getElementById('close-btn');


  closeBtn.addEventListener('click', () => {
    formContainer.classList.add('hidden');
  });

  addFoodForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(addFoodForm);
    const name = formData.get('name');
    const price = formData.get('price');
    const image_url = formData.get('image_url');
    const availability = formData.get('availability');
    
    // Perform the fetch request to the backend API with the form data
    fetch('http://localhost:8080/addsnack', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, price,image_url,availability })
    })
    .then(response => response.json())
    .then(data => {
      // Handle the response from the backend API
      console.log(data);
      const formContainer = document.getElementById('form-container');
    formContainer.style.display = "none";
    alert("Food added Successfully")
      // Hide the form
      formContainer.classList.add('hidden');
    })
    .catch(error => console.error(error));
  });

  }

//  Update form

function addFoodBtn(){
    const addFoodForm = document.getElementById("add-food-form")
    const formContainer = document.getElementById('form-container');
    formContainer.style.display = "block";
  const closeBtn = document.getElementById('close-btn');


  closeBtn.addEventListener('click', () => {
    formContainer.classList.add('hidden');
  });

  addFoodForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(addFoodForm);
    const name = formData.get('name');
    const price = formData.get('price');
    const image_url = formData.get('image_url');
    const availability = formData.get('availability');
    // Perform the fetch request to the backend API with the form data
    fetch('http://localhost:8080/addsnack', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, price,image_url,availability })
    })
    .then(response => response.json())
    .then(data => {
      // Handle the response from the backend API
      const formContainer = document.getElementById('form-container');
    formContainer.style.display = "none";
    alert("Food added Successfully")
      console.log(data);
      // Hide the form
      formContainer.classList.add('hidden');
    })
    .catch(error => console.error(error));
  });

  }


function closeAddForm(){
    // alert("working")
    document.getElementById("form-container").style.display = "none";
}
function closeUpdateForm(){
    // alert("working")
    document.getElementById("form-containerupdate").style.display = "none";
}

function ViewadminOrders(){
  window.location.href = "ordersadmin.html"
}