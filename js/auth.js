/* ============================================================
   auth.js — DECORUM User Authentication Logic
   ============================================================
   This file is shared by both login.html and register.html.
   It uses guard checks (if loginForm / if registerForm) so
   only the relevant section runs on each page.

   Sections:
     1. Login Handler    — verifies credentials stored in
                           localStorage during registration
     2. Register Handler — saves user info to localStorage
                           so the login handler can verify it

   NOTE: localStorage is used for simplicity in this academic
   project. A real e-commerce site would use a secure backend.
   ============================================================ */


/* ============================================================
   SECTION 1 — LOGIN HANDLER  (login.html)

   Reads the email & password stored during registration and
   compares them to what the user typed into the login form.
   ============================================================ */

const loginForm = document.getElementById('loginForm');

if (loginForm) { /* Only runs if this page has a login form */

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault(); /* Stop the browser from reloading the page */

        /* Values typed by the user */
        const email    = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        /* Credentials saved to localStorage when the user registered */
        const storedUser     = localStorage.getItem('user');
        const storedEmail    = localStorage.getItem('userEmail');
        const storedPassword = localStorage.getItem('userPassword');

        /* Validate: user must exist AND both fields must match */
        if (storedUser === 'registered' && email === storedEmail && password === storedPassword) {
            localStorage.setItem('loggedIn', 'true'); /* Mark session as active */
            alert('Login successful! Welcome back to DECORUM.');
            window.location.href = 'page1.html';      /* Redirect to home page  */
        } else {
            alert('Invalid email or password. Please try again.');
        }
    });
}


/* ============================================================
   SECTION 2 — REGISTER HANDLER  (register.html)

   Saves the user's name, email, and password to localStorage.
   The login handler above reads these values to verify identity.
   ============================================================ */

const registerForm = document.getElementById('registerForm');

if (registerForm) { /* Only runs if this page has a register form */

    registerForm.addEventListener('submit', function (e) {
        e.preventDefault(); /* Stop the browser from reloading the page */

        const password  = document.getElementById('regPassword').value;
        const confirm   = document.getElementById('regConfirm').value;

        /* Basic password match validation */
        if (password !== confirm) {
            alert('Passwords do not match. Please try again.');
            return;
        }

        /* Save credentials to localStorage for later login verification */
        localStorage.setItem('user',         'registered');
        localStorage.setItem('userEmail',    document.getElementById('regEmail').value);
        localStorage.setItem('userPassword', password);

        alert('Registration successful! Welcome to DECORUM.');
        window.location.href = 'page1.html'; /* Redirect to home page */
    });
}
