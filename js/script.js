function checkUser() {

let user = localStorage.getItem("user");

if (!user) {
alert("Please register first");
window.location.href = "register.html";
return false;
}

return true;
}


function addToCart(name, price) {

if (!checkUser()) return;

let cart = JSON.parse(localStorage.getItem("cart")) || [];

cart.push({
name: name,
price: price
});

localStorage.setItem("cart", JSON.stringify(cart));

updateCartCount();
alert("Item added to cart");
}


function buyNow(name, price) {

if (!checkUser()) return;

let cart = [];

cart.push({
name: name,
price: price
});

localStorage.setItem("cart", JSON.stringify(cart));

window.location.href = "cart.html";
}


function updateCartCount(){

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let count = cart.length;

let counter = document.getElementById("cartCount");

if(counter){
counter.innerText = count;
}

}

function setupCategoryFilters() {
    const checkboxes = document.querySelectorAll('aside input[type="checkbox"]');
    const furnitureCards = document.querySelectorAll('.furniture-card');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedCategories = Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.getAttribute('data-category'));

            furnitureCards.forEach(card => {
                if (checkedCategories.length === 0) {
                    // If no categories are checked, show all items
                    card.classList.remove('hidden');
                } else {
                    // Show card only if it matches one of the checked categories
                    const cardClass = Array.from(card.classList).find(cls => checkedCategories.includes(cls));
                    if (cardClass) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });
        });
    });
}

// Initialize filters when page loads
document.addEventListener('DOMContentLoaded', () => {
    setupCategoryFilters();
    if (document.getElementById('productGrid')) {
        renderProducts();
    }
});

// Dynamic Products
const products = [
    { id: 1, name: 'Velvet Sofa', price: 75000, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500' },
    { id: 2, name: 'Accent Chair', price: 12500, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500' },
    { id: 3, name: 'Dining Chair', price: 8500, image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=500' },
    { id: 4, name: 'Floor Lamp', price: 6200, image: 'pics/floor lamp.jpg' },
    { id: 5, name: 'Bookshelf', price: 15400, image: 'pics/bookshelf.webp' },
    { id: 6, name: 'Bed Frame', price: 45000, image: 'pics/bedframe.jpg' },
    { id: 7, name: 'Decor Rug', price: 4200, image: 'pics/decourug.jpg' },
    { id: 8, name: 'Coffee Table', price: 18000, image: 'pics/coffeetable.webp' }
];

function renderProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    products.forEach(product => {
        grid.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>₹${product.price.toLocaleString('en-IN')}</p>
                    <button onclick="buyNow('${product.name}', ${product.price})" class="btn-buy">Buy Now</button>
                    <button onclick="addToCart('${product.name}', ${product.price})" class="btn-buy">To Cart</button>
                </div>
            </div>
        `;
    });
}