/* ============================================================
   address.js — Shipping Address Form Logic
   ============================================================
   Handles:
   - Form validation
   - Address storage (localStorage)
   - Navigation to payment page
   - Pincode delivery verification
   ============================================================ */

/* Track whether delivery has been verified */
let deliveryVerified = false;
let verifiedPincode = '';

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number (basic validation for international format)
 */
function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
    return phoneRegex.test(phone);
}

/**
 * handleSubmit(e)
 * Validates the address form and saves data to localStorage
 */
document.getElementById('addressForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const status = document.getElementById('formStatus');
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const street = document.getElementById('street').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const country = document.getElementById('country').value;
    const instructions = document.getElementById('instructions').value.trim();
    const sameAsBilling = document.getElementById('sameAsBilling').checked;

    /* Reset status message */
    status.className = 'form-status';
    status.innerText = '';

    /* Validation checks */
    if (!fullName) {
        showError(status, '❌ Please enter your full name');
        return;
    }

    if (!isValidEmail(email)) {
        showError(status, '❌ Please enter a valid email address');
        return;
    }

    if (!isValidPhone(phone)) {
        showError(status, '❌ Please enter a valid phone number');
        return;
    }

    if (!street) {
        showError(status, '❌ Please enter your street address');
        return;
    }

    if (!city) {
        showError(status, '❌ Please enter your city');
        return;
    }

    if (!state) {
        showError(status, '❌ Please enter your state or province');
        return;
    }

    if (!deliveryVerified) {
        document.getElementById('pincodeWarning').style.display = 'block';
        document.getElementById('pincodeWarning').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
    }

    if (!country) {
        showError(status, '❌ Please select your country');
        return;
    }

    /* All validations passed — save to localStorage */
    const addressData = {
        fullName,
        email,
        phone,
        street,
        city,
        state,
        postalCode: verifiedPincode,
        country,
        instructions,
        sameAsBilling,
        savedAt: new Date().toISOString()
    };

    localStorage.setItem('shippingAddress', JSON.stringify(addressData));

    /* Show success message and redirect */
    status.className = 'form-status status-ok active';
    status.innerText = '✅ Address saved successfully! Redirecting to payment...';

    setTimeout(() => {
        window.location.href = 'payment.html';
    }, 1500);
});

/**
 * showError(element, message)
 * Display error message with styling
 */
function showError(element, message) {
    element.className = 'form-status status-err active';
    element.innerText = message;
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * backToCart()
 * Navigate back to the cart page
 */
function backToCart() {
    window.location.href = 'cart.html';
}

/* ============================================================
   PINCODE DELIVERY CHECKER (API 1)
   Endpoint: https://api.postalpincode.in/pincode/{pincode}
   Free, no API key required
   ============================================================ */

/**
 * checkDelivery()
 * Fetches delivery info for the entered pincode and
 * displays a result message.
 */
async function checkDelivery() {
    const pin    = document.getElementById('pincodeInput').value.trim();
    const result = document.getElementById('deliveryResult');
    const btn    = document.getElementById('checkBtn');

    /* Validate: must be exactly 6 numeric digits */
    if (!/^\d{6}$/.test(pin)) {
        result.className = 'delivery-result active delivery-err';
        result.innerText = '⚠️ Please enter a valid 6-digit pincode.';
        return;
    }

    /* Show loading state */
    result.className = 'delivery-result active delivery-loading';
    result.innerText = '⏳ Checking availability...';
    btn.disabled = true;

    try {
        /* Call the free India Post API */
        const res  = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();

        if (data[0].Status === 'Success' && data[0].PostOffice.length > 0) {
            /* Delivery available */
            const po = data[0].PostOffice[0];
            result.className = 'delivery-result active delivery-ok';
            result.innerText =
                `✅ Delivery available to ${po.Name}, ${po.District}, ${po.State} — Est. 3–5 business days`;
            deliveryVerified = true;
            verifiedPincode = pin;
            document.getElementById('pincodeWarning').style.display = 'none';
        } else {
            /* Valid pincode but outside delivery zone */
            result.className = 'delivery-result active delivery-err';
            result.innerText = "❌ Sorry, we don't deliver to this pincode yet.";
            deliveryVerified = false;
        }
    } catch {
        /* Network or server-side error */
        result.className = 'delivery-result active delivery-err';
        result.innerText = '❌ Network error. Please try again.';
        deliveryVerified = false;
    } finally {
        btn.disabled = false;
    }
}

/* ============================================================
   Load saved address data (if returning to the page)
   ============================================================ */
window.addEventListener('load', function() {
    /* Pincode checker — allow Enter key */
    document.getElementById('pincodeInput').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            checkDelivery();
        }
    });

    const saved = localStorage.getItem('shippingAddress');
    if (saved) {
        try {
            const addressData = JSON.parse(saved);
            document.getElementById('fullName').value = addressData.fullName || '';
            document.getElementById('email').value = addressData.email || '';
            document.getElementById('phone').value = addressData.phone || '';
            document.getElementById('street').value = addressData.street || '';
            document.getElementById('city').value = addressData.city || '';
            document.getElementById('state').value = addressData.state || '';
            document.getElementById('pincodeInput').value = addressData.postalCode || '';
            verifiedPincode = addressData.postalCode || '';
            deliveryVerified = !!addressData.postalCode;
            document.getElementById('country').value = addressData.country || '';
            document.getElementById('instructions').value = addressData.instructions || '';
            document.getElementById('sameAsBilling').checked = addressData.sameAsBilling || false;
        } catch (e) {
            console.error('Error loading saved address:', e);
        }
    }
});
