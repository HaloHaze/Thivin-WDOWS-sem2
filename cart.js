document.addEventListener("DOMContentLoaded", () => {
    const orderTableBody = document.querySelector("#order-table tbody");
    const grandTotalSpan = document.getElementById("grand-total");
    const payButton = document.getElementById("pay-button");
    const paymentSelect = document.getElementById("payment");
    const creditCardForm = document.getElementById("credit-card-form");
    const proceedButton = document.getElementById("proceed-button");

    // Get cart data from localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Function to render the order table
    function renderOrderTable() {
        let grandTotal = 0;

        orderTableBody.innerHTML = ""; // Clear table content
        
        cart.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.title}</td>
                <td>$${item.price}</td>
                <td>${item.quantity}</td>
                <td>$${item.total}</td>
            `;
            grandTotal += item.total;
            orderTableBody.appendChild(row);
        });

        grandTotalSpan.textContent = `Grand Total: $${grandTotal.toFixed(2)}`;
    }

    // Render the order table on page load
    renderOrderTable();

    // Handle Payment Method Selection
    paymentSelect.addEventListener("change", () => {
        if (paymentSelect.value === "credit") {
            creditCardForm.style.display = "block"; // Show the credit card form
        } else {
            creditCardForm.style.display = "none"; // Hide the credit card form
        }
    });

    // Handle the Pay button click (for PayPal or no credit card)
    payButton.addEventListener("click", () => {
        const name = document.getElementById("name").value.trim();
        const address = document.getElementById("address").value.trim();
        const paymentMethod = paymentSelect.value;

        if (!name || !address || !paymentMethod) {
            alert("Please fill in all fields correctly.");
            return;
        }

        // Generate a delivery date (3 days from today)
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3);
        const formattedDate = deliveryDate.toLocaleDateString();

        // Display a thank you message
        alert(`Thank you for your purchase, ${name}!
Your order will be delivered to ${address} by ${formattedDate}.`);

        // Clear the cart data from localStorage
        localStorage.removeItem("cart");
        window.location.href = "pharmacy.html"; // Redirect to the home page or another page
    });

    // Handle the Proceed button click (for Credit Card)
    if (proceedButton) {
        proceedButton.addEventListener("click", () => {
            const name = document.getElementById("name").value.trim();
            const address = document.getElementById("address").value.trim();
            const paymentMethod = paymentSelect.value;

            if (!name || !address || !paymentMethod) {
                alert("Please fill in all fields correctly.");
                return;
            }

            // Validate Credit Card info
            const cardNumber = document.getElementById("card-number").value.trim();
            const cardExpiry = document.getElementById("card-expiry").value.trim();
            const cardCVC = document.getElementById("card-cvc").value.trim();

            if (!/^[0-9]{16}$/.test(cardNumber)) {
                alert("Card number must be 16 numeric digits.");
                return;
            }

            if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(cardExpiry)) {
                alert("Expiry date must be in MM/YY format.");
                return;
            }

            if (!/^[0-9]{3,4}$/.test(cardCVC)) {
                alert("CVC must be 3 or 4 numeric digits.");
                return;
            }

            // Generate a delivery date (3 days from today)
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + 3);
            const formattedDate = deliveryDate.toLocaleDateString();

            // Display a thank you message after Credit Card payment
            alert(`Thank you for your purchase, ${name}!
Your order will be delivered to ${address} by ${formattedDate}.`);

            // Clear the cart data from localStorage
            localStorage.removeItem("cart");
            window.location.href = "pharmacy.html"; // Redirect to the home page or another page
        });
    }
});
