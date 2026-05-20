/* ============================================================
   page3.js — DECORUM Contact Page Logic
   ============================================================
   Sections:
     1. EmailJS Setup & Contact Form Sender  (API 2)
     2. Leaflet + OpenStreetMap Store Locator (API 3)

   ── EMAILJS SETUP (free — 200 emails/month) ─────────────────
   1. Sign up at https://www.emailjs.com
   2. Add a Gmail service  →  copy the Service ID
   3. Create an email template using these variable names:
        {{from_name}}   — sender's name
        {{from_email}}  — sender's email address
        {{message}}     — the message body
        {{reply_to}}    — used to reply directly to the sender
   4. Go to Account → API Keys  →  copy your Public Key
   5. Replace the 3 placeholder strings in Section 1 below
   ============================================================ */


/* ============================================================
   SECTION 1 — EMAILJS CONTACT FORM  (API 2)

   emailjs.init() must be called once before any .send() call.
   The Public Key identifies your EmailJS account.
   ============================================================ */

/* 🔑 Replace 'YOUR_PUBLIC_KEY' with the key from your EmailJS dashboard */
emailjs.init('wXSS4J69TK205orni');

/**
 * sendEmail(e)
 * Called by onsubmit="sendEmail(event)" on the contact form.
 * Collects form values, sends them via EmailJS, and shows
 * a success or error message without reloading the page.
 *
 * @param {Event} e — the form submit event
 */
function sendEmail(e) {
    e.preventDefault(); /* Prevent default form reload */

    const btn     = document.getElementById('submitBtn');
    const status  = document.getElementById('formStatus');
    const btnText = document.getElementById('btnText');

    /* Show a loading state while the email is being sent */
    btnText.innerText    = '⏳ Sending...';
    btn.disabled         = true;
    status.className     = 'form-status';
    status.innerText     = '';

    /* Build the template parameters — names must match your EmailJS template */
    const params = {
        from_name:  document.getElementById('contactName').value,
        from_email: document.getElementById('contactEmail').value,
        message:    document.getElementById('contactMsg').value,
        reply_to:   document.getElementById('contactEmail').value,
    };

    /*
     * emailjs.send(serviceID, templateID, params)
     * Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your own values.
     */
    emailjs.send('service_b49cl16', 'template_w2hs93t', params)
        .then(() => {
            /* Email sent successfully */
            status.className = 'form-status status-ok';
            status.innerText = "✅ Message sent! We'll reply within 24 hours.";
            document.getElementById('contactForm').reset(); /* Clear the form */
        })
        .catch(err => {
            /* Something went wrong — show a fallback message */
            status.className = 'form-status status-err';
            status.innerText = '❌ Failed to send. Please email us at hello@decorum.com';
            console.error('EmailJS error:', err); /* Log details to browser console */
        })
        .finally(() => {
            /* Always restore the button regardless of success or failure */
            btnText.innerText = 'Send Message ✉️';
            btn.disabled      = false;
        });
}


/* ============================================================
   SECTION 2 — LEAFLET + OPENSTREETMAP STORE LOCATOR  (API 3)

   Renders an interactive map pinned to the DECORUM studio.
   Uses OpenStreetMap tiles — completely free, no API key needed.
   The marker opens a popup with a "Get Directions" Google Maps link.
   ============================================================ */

/* Studio coordinates — JAAT Street, Ambala Cantt, Haryana
   GPS: 30°19'14.0"N  76°52'00.3"E                           */
const LAT = 30.3206;
const LNG = 76.8668;

/* Create the Leaflet map centred on the studio location
   scrollWheelZoom is disabled so page scrolling works normally */
const map = L.map('studioMap', {
    zoomControl:     true,
    scrollWheelZoom: false
}).setView([LAT, LNG], 15);

/* Load map tiles from OpenStreetMap (free, no API key required) */
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19
}).addTo(map);

/* Add a marker at the studio location and open its popup immediately */
L.marker([LAT, LNG])
    .addTo(map)
    .bindPopup(`
        <div style="text-align:center; font-family:'Inter',sans-serif; padding:4px;">
            <strong style="color:#a67c52; font-size:14px;">🛋️ DECORUM Studio</strong><br>
            <span style="font-size:12px; color:#555;">JAAT Street, Ambala Cantt</span><br><br>
            <!-- Opens Google Maps with exact coordinates for turn-by-turn directions -->
            <a href="https://www.google.com/maps?q=${LAT},${LNG}" target="_blank"
               style="color:#a67c52; font-size:12px; font-weight:700;">📍 Get Directions →</a>
        </div>
    `)
    .openPopup();
