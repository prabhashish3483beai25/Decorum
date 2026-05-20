/* ============================================================
   payment.js — DECORUM Payment Page Logic
   ============================================================
   Sections:
     1. Pincode Delivery Checker  (India Post API — free, no key)
     2. Card Input Auto-Formatter (card number & expiry)
     3. Payment Form Handler      (clears cart, redirects)
   ============================================================ */


/* ============================================================
   SECTION 1 — INDIA POST PINCODE DELIVERY CHECKER (API)

   Endpoint: https://api.postalpincode.in/pincode/{pincode}
   - Completely free, no API key required
   - Returns post-office data for any valid 6-digit Indian pincode
   ============================================================ */

/**
 * checkDelivery()
 * Called when the user clicks "Check" or presses Enter.
 * Fetches delivery info for the entered pincode and
 * displays a result message below the input field.
 */
async function checkDelivery() {
    const pin    = document.getElementById('pincodeInput').value.trim();
    const result = document.getElementById('deliveryResult');
    const btn    = document.getElementById('checkBtn');

    /* Validate: must be exactly 6 numeric digits */
    if (!/^\d{6}$/.test(pin)) {
        result.className = 'delivery-err';
        result.innerText = '⚠️ Please enter a valid 6-digit pincode.';
        return;
    }

    /* Show loading state while the API request runs */
    result.className = 'delivery-loading';
    result.innerText = '⏳ Checking availability...';
    btn.disabled = true;

    try {
        /* Call the free India Post API */
        const res  = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();

        if (data[0].Status === 'Success' && data[0].PostOffice.length > 0) {
            /* Delivery available — show district and state */
            const po = data[0].PostOffice[0];
            result.className = 'delivery-ok';
            result.innerText =
                `✅ Delivery available to ${po.Name}, ${po.District}, ${po.State} — Est. 3–5 business days`;
        } else {
            /* Valid pincode but outside our delivery zone */
            result.className = 'delivery-err';
            result.innerText = "❌ Sorry, we don't deliver to this pincode yet.";
        }
    } catch {
        /* Network or server-side error */
        result.className = 'delivery-err';
        result.innerText = '❌ Network error. Please try again.';
    } finally {
        btn.disabled = false; /* Always re-enable the button */
    }
}


/* ============================================================
   SECTION 2 — CARD INPUT AUTO-FORMATTERS
   These listeners run once the DOM is ready.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* Allow pressing Enter in the pincode field to trigger the check */
    document.getElementById('pincodeInput').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            checkDelivery();
        }
    });

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
   SECTION 3 — PAYMENT FORM HANDLER
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
