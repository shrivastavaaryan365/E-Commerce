/* ================= PRODUCTS ================= */

const products = [

    {
        id: 1,
        name: "Wireless Headphones",
        category: "electronics",
        price: 2499,
        image: "🎧"
    },

    {
        id: 2,
        name: "Smart Watch",
        category: "electronics",
        price: 3999,
        image: "⌚"
    },

    {
        id: 3,
        name: "Premium T-Shirt",
        category: "fashion",
        price: 799,
        image: "👕"
    },

    {
        id: 4,
        name: "Running Shoes",
        category: "shoes",
        price: 2499,
        image: "👟"
    },

    {
        id: 5,
        name: "Leather Backpack",
        category: "accessories",
        price: 1599,
        image: "🎒"
    },

    {
        id: 6,
        name: "Sunglasses",
        category: "accessories",
        price: 999,
        image: "🕶️"
    },

    {
        id: 7,
        name: "Casual Hoodie",
        category: "fashion",
        price: 1299,
        image: "🧥"
    },

    {
        id: 8,
        name: "Sports Shoes",
        category: "shoes",
        price: 2999,
        image: "👞"
    }

];


/* ================= CART ================= */

let cart = JSON.parse(localStorage.getItem("cart")) || [];


/* ================= DISPLAY PRODUCTS ================= */

function displayProducts(productList) {

    const container =
        document.getElementById("productContainer");

    container.innerHTML = "";

    if (productList.length === 0) {

        container.innerHTML =
            "<h3>No products found.</h3>";

        return;
    }

    productList.forEach(product => {

        container.innerHTML += `

            <div class="product-card">

                <div class="product-image">
                    ${product.image}
                </div>

                <div class="product-info">

                    <span class="category">
                        ${product.category}
                    </span>

                    <h3>
                        ${product.name}
                    </h3>

                    <div class="price">
                        ₹${product.price.toLocaleString("en-IN")}
                    </div>

                    <div class="product-actions">

                        <button
                            class="add-btn"
                            onclick="addToCart(${product.id})"
                        >
                            Add to Cart
                        </button>

                        <button
                            class="wishlist"
                            onclick="addWishlist(this)"
                        >
                            ♡
                        </button>

                    </div>

                </div>

            </div>

        `;

    });

}


/* ================= ADD TO CART ================= */

function addToCart(id) {

    const product =
        products.find(item => item.id === id);

    const existing =
        cart.find(item => item.id === id);

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            ...product,

            quantity: 1

        });

    }

    saveCart();

    updateCart();

    alert(`${product.name} added to cart!`);
}


/* ================= SAVE CART ================= */

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


/* ================= UPDATE CART ================= */

function updateCart() {

    const cartItems =
        document.getElementById("cartItems");

    const cartCount =
        document.getElementById("cartCount");

    const cartTotal =
        document.getElementById("cartTotal");


    let total = 0;

    let count = 0;


    if (cart.length === 0) {

        cartItems.innerHTML =
            `<p class="empty-cart">
                Your cart is empty.
            </p>`;

    } else {

        cartItems.innerHTML = "";

        cart.forEach(item => {

            total += item.price * item.quantity;

            count += item.quantity;

            cartItems.innerHTML += `

                <div class="cart-item">

                    <div class="cart-item-image">   
                        ${item.image}
                    </div>

                    <div class="cart-item-info">

                        <h4>
                            ${item.name}
                        </h4>

                        <p>
                            ₹${item.price}
                        </p>

                        <div class="quantity">

                            <button
                                onclick="changeQuantity(
                                    ${item.id},
                                    -1
                                )"
                            >
                                -
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                onclick="changeQuantity(
                                    ${item.id},
                                    1
                                )"
                            >
                                +
                            </button>

                        </div>

                    </div>

                    <button
                        class="remove-btn"
                        onclick="removeFromCart(${item.id})"
                    >
                        🗑️
                    </button>

                </div>

            `;

        });

    }


    cartCount.innerText = count;

    cartTotal.innerText =
        total.toLocaleString("en-IN");

}


/* ================= CHANGE QUANTITY ================= */

function changeQuantity(id, amount) {

    const item =
        cart.find(product => product.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {

        cart =
            cart.filter(product => product.id !== id);

    }

    saveCart();

    updateCart();

}


/* ================= REMOVE PRODUCT ================= */

function removeFromCart(id) {

    cart =
        cart.filter(product => product.id !== id);

    saveCart();

    updateCart();

}


/* ================= OPEN CART ================= */

function openCart() {

    document.getElementById("cartOverlay")
        .style.display = "flex";

}


/* ================= CLOSE CART ================= */

function closeCart() {

    document.getElementById("cartOverlay")
        .style.display = "none";

}


/* ================= FILTER ================= */

function filterProducts(category) {

    if (category === "all") {

        displayProducts(products);

        return;

    }

    const filtered =
        products.filter(
            product => product.category === category
        );

    displayProducts(filtered);

}


/* ================= SEARCH ================= */

function searchProducts() {

    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();

    const filtered =
        products.filter(product =>

            product.name
                .toLowerCase()
                .includes(search)

        );

    displayProducts(filtered);

}


/* ================= WISHLIST ================= */

function addWishlist(button) {

    if (button.innerText === "♡") {

        button.innerText = "♥";

    } else {

        button.innerText = "♡";

    }

}


/* ================= DARK MODE ================= */

document
    .getElementById("themeBtn")
    .addEventListener("click", function() {

        document.body.classList.toggle("dark");

        if (
            document.body.classList.contains("dark")
        ) {

            this.innerText = "☀️";

        } else {

            this.innerText = "🌙";

        }

    });


/* ================= CHECKOUT ================= */

function checkout() {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;

    }

    alert(
        "Checkout system will be connected with payment gateway!"
    );

}


/* ================= CONTACT ================= */

function submitContact(event) {

    event.preventDefault();

    alert(
        "Thank you! Your message has been submitted."
    );

}


/* ================= INITIALIZE ================= */

displayProducts(products);

updateCart();