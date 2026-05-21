/* ============================================================
   cart.js — DECORUM Shopping Cart Logic
   ============================================================
   Sections:
     1. Load cart data from localStorage
     2. Render cart items (or show empty state)
     3. Remove an item from the cart
     4. Navigation helpers (checkout / continue shopping)
   ============================================================ */


/* ============================================================
   SECTION 1 — LOAD CART DATA

   The cart is stored in localStorage as a JSON string by
   addToCart() and buyNow() in script.js.
   We parse it back into an array, defaulting to [] if empty.
   ============================================================ */

let cart  = JSON.parse(localStorage.getItem('cart')) || [];
let total = 0; /* Running price total, built in Section 2 */

/* DOM references used across multiple sections */
const cartDiv  = document.getElementById('cartItems');
const emptyMsg = document.getElementById('emptyMessage');


/* ============================================================
   SECTION 2 — RENDER CART ITEMS

   If the cart is empty  → show the empty-state message
                           and hide the summary + checkout row.
   If the cart has items → build an HTML card for each item
                           and display the formatted total.
   ============================================================ */

if (cart.length === 0) {
    /* Show the "Your cart is empty" message */
    emptyMsg.style.display = 'block';
    document.getElementById('cartSummary').style.display      = 'none';
    document.querySelector('.checkout-section').style.display = 'none';

} else {
    /* Loop through every item and inject its HTML card */
    cart.forEach((item, index) => {
        cartDiv.innerHTML += `
            <div class="cart-item">
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <!-- Price formatted as Indian number (e.g. ₹45,000) -->
                    <div class="item-price">₹${item.price.toLocaleString('en-IN')}</div>
                </div>
                <!-- Calls removeItem() with this item's index in the array -->
                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            </div>
        `;
        total += item.price; /* Accumulate running total */
    });

    /* Display the formatted total price in both summary rows */
    const formatted = '₹' + total.toLocaleString('en-IN');
    document.getElementById('totalPrice').innerText = formatted;
    document.getElementById('subtotal').innerText   = formatted;
}


/* ============================================================
   SECTION 3 — REMOVE ITEM

   Removes the item at the given array index,
   saves the updated cart back to localStorage,
   then reloads the page to re-render the list.
   ============================================================ */

/**
 * removeItem(index)
 * @param {number} index — 0-based position of the item in the cart array
 */
function removeItem(index) {
    cart.splice(index, 1);                               /* Remove 1 item at position `index` */
    localStorage.setItem('cart', JSON.stringify(cart));  /* Persist updated cart              */
    location.reload();                                   /* Re-render the page                */
}


/* ============================================================
   SECTION 4 — NAVIGATION HELPERS
   ============================================================ */

/**
 * checkout()
 * Validates that the cart is not empty, then navigates
 * to the shipping address page.
 */
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    window.location.href = 'address.html';
}

/**
 * continueShopping()
 * Sends the user back to the main landing page.
 */
function continueShopping() {
    window.location.href = 'page1.html';
}
