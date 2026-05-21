/* ============================================================
   payment.js — DECORUM Payment Page Logic
   ============================================================
   Sections:
     1. Card Input Auto-Formatter (card number & expiry)
     2. Payment Form Handler      (clears cart, redirects)
   ============================================================ */


/* ============================================================
   SECTION 1 — CARD INPUT AUTO-FORMATTERS
   These listeners run once the DOM is ready.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    /**
     * Card Number — auto-inserts double-spaces every 4 digits
     * Example: "1234567890123456" → "1234  5678  9012  3456"
     */
    document.getElementById('cardNumber').addEventListener('input', function () {
        let v = this.value.replace(/\D/g, '').substring(0, 16);
        this.value = v.replace(/(.{4})/g, '$1  ').trim();
    });

    /**
     * Expiry Date — auto-formats as "MM / YY"
     * Example: "1225" → "12 / 25"
     */
    document.getElementById('expiry').addEventListener('input', function () {
        let v = this.value.replace(/\D/g, '').substring(0, 4);
        if (v.length >= 3) v = v.substring(0, 2) + ' / ' + v.substring(2);
        this.value = v;
    });

});


/* ============================================================
   SECTION 2 — PAYMENT FORM HANDLER
   Called via onsubmit="pay(event)" on the <form> element.
   Prevents page reload, clears the cart from localStorage,
   then redirects to the home page.
   ============================================================ */

/**
 * pay(e)
 * @param {Event} e — the form submit event
 */
function pay(e) {
    e.preventDefault(); /* Prevent default HTML form submission/reload */

    /* Remove all cart items saved by script.js after successful payment */
    localStorage.removeItem('cart');

    alert('🎉 Payment Successful! Thank you for shopping with DECORUM.');

    /* Redirect to the main catalog page */
    window.location.href = 'index.html';
}
