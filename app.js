document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  const cartTableBody = document.querySelector("#cart-table tbody");
  const grandTotalSpan = document.getElementById("grand-total");
  let cart = [];

  // Fetch products data from the JSON file
  fetch("products.json")
    .then(response => response.json())
    .then(data => {
      // Loop through categories and display products
      data.products.forEach(product => {
        const card = document.createElement("div");
        card.className = "display-card";
        card.innerHTML = `
          <img src="${product.img}" alt="${product.title}">
          <h2>${product.title}</h2>
          <p>${product.details}</p>
          <p>${product.category}</p>
          <p class="price">$${product.price}</p>
          <button class="addtocart" data-title="${product.title}" data-price="${product.price}">Add to cart</button>
        `;
        container.appendChild(card);
      });

      // Add event listeners to "Add to Cart" buttons
      document.querySelectorAll(".addtocart").forEach(button => {
        button.addEventListener("click", event => {
          const productTitle = event.target.getAttribute("data-title");
          const productPrice = parseInt(event.target.getAttribute("data-price"));
          addToCart(productTitle, productPrice);
        });
      });
    });

  // Function to add a product to the cart
  function addToCart(productTitle, productPrice) {
    const existingItem = cart.find(item => item.title === productTitle);

    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.total = existingItem.quantity * existingItem.price;  // Recalculate total
    } else {
      cart.push({
        title: productTitle,
        price: productPrice,
        quantity: 1,
        total: productPrice
      });
    }
    updateCartTable();
  }

  // Function to update the cart table with the current items
  function updateCartTable() {
    cartTableBody.innerHTML = "";  // Clear current table rows
    cart.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.title}</td>
        <td>$${item.price}</td>
        <td>
          <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-index="${index}">
        </td>
        <td>$${item.total}</td>
        <td>
          <button class="delete-btn" data-index="${index}">Delete</button>
        </td>
      `;
      cartTableBody.appendChild(row);
    });

    // Add event listeners to update quantity and delete items
    document.querySelectorAll(".quantity-input").forEach(input => {
      input.addEventListener("input", event => {
        const index = event.target.getAttribute("data-index");
        const newQuantity = Math.max(1, parseInt(event.target.value));  // Ensure the number is greater than 0
        const price = cart[index].price;
        cart[index].quantity = newQuantity;
        cart[index].total = newQuantity * price;  // Recalculate total based on updated quantity
        updateCartTable();
      });
    });

    // Add event listeners for delete button
    document.querySelectorAll(".delete-btn").forEach(button => {
      button.addEventListener("click", event => {
        const index = event.target.getAttribute("data-index");
        cart.splice(index, 1); // Remove the item from the cart
        updateCartTable();
      });
    });

    // Update the grand total
    const grandTotal = cart.reduce((sum, item) => sum + item.total, 0);
    grandTotalSpan.textContent = `$${grandTotal.toFixed(2)}`; // Display the grand total with 2 decimal points
  }

  // Add to Favourites functionality
  document.querySelector("#add-to-favourites").addEventListener("click", () => {
    if (cart.length === 0) {
      alert("No items in the cart to add to favourites!");
      return;
    }
    localStorage.setItem("favourites", JSON.stringify(cart)); // Save cart as favourites in localStorage
    alert("Items added to favourites!");
  });

  // Apply Favourites functionality
  document.querySelector("#apply-favourites").addEventListener("click", () => {
    const favourites = JSON.parse(localStorage.getItem("favourites"));
    if (favourites && favourites.length > 0) {
      cart = favourites.map(item => ({ ...item, quantity: 1, total: item.price }));  // Reset quantity to 1 for all items
      updateCartTable();
      alert("Favourites applied!");
    } else {
      alert("No favourites saved!");
    }
  });

  // Redirect to cart page when "Buy Now" is clicked
  document.querySelector("#buy-now").addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty! Please add items before proceeding.");
      return;
    }

    // Save the cart to localStorage to make it accessible on the cart page
    localStorage.setItem("cart", JSON.stringify(cart));

    // Redirect to the cart page (update "cart.html" to your cart page's actual path)
    window.location.href = "cart.html";
  });
});
