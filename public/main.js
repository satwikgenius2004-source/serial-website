const products = [
    {
        id: 1,
        name: "Essential Heavy Tee",
        category: "T-Shirts",
        price: 899,
        colour: "Off White",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
        badge: "BESTSELLER"
    },
    {
        id: 2,
        name: "Relaxed Oxford Shirt",
        category: "Shirts",
        price: 1499,
        colour: "Sky Blue",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80"
    },
    {
        id: 3,
        name: "Straight Fit Trousers",
        category: "Trousers",
        price: 1799,
        colour: "Charcoal",
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80",
        badge: "NEW"
    },
    {
        id: 4,
        name: "Utility Overshirt",
        category: "Outerwear",
        price: 2199,
        colour: "Washed Black",
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80"
    }
];


/* =========================
   LOCAL STORAGE
========================= */

function getCart() {
    return JSON.parse(localStorage.getItem("serialCart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("serialCart", JSON.stringify(cart));
}

function getWishlist() {
    return JSON.parse(localStorage.getItem("serialWishlist")) || [];
}

function saveWishlist(wishlist) {
    localStorage.setItem("serialWishlist", JSON.stringify(wishlist));
}

function getUser() {
    return JSON.parse(localStorage.getItem("serialUser"));
}

function saveUser(user) {
    localStorage.setItem("serialUser", JSON.stringify(user));
}

function isLoggedIn() {
    return localStorage.getItem("serialLoggedIn") === "true";
}


/* =========================
   HELPERS
========================= */

function formatPrice(price) {
    return `₹${Number(price).toLocaleString("en-IN")}`;
}

function findProduct(name) {
    return products.find(product => product.name === name);
}


/* =========================
   CART PANEL
========================= */

const cartBtn = document.getElementById("cartBtn");
const cartPanel = document.getElementById("cartPanel");
const closeCart = document.getElementById("closeCart");
const overlay = document.getElementById("overlay");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");


function updateCart() {

    const cart = getCart();

    if (cartCount) {
        const totalQuantity = cart.reduce(
            (sum, item) => sum + Number(item.quantity || 1),
            0
        );

        cartCount.textContent = totalQuantity;
    }

    if (!cartItems) return;

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your bag is empty.
            </p>
        `;

        if (cartTotal) {
            cartTotal.textContent = "₹0";
        }

        return;
    }

    let total = 0;

    cartItems.innerHTML = "";

    cart.forEach((item, index) => {

        const quantity = Number(item.quantity || 1);
        const itemTotal = Number(item.price) * quantity;

        total += itemTotal;

        const itemElement = document.createElement("div");

        itemElement.className = "cart-item";

        itemElement.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p>${formatPrice(item.price)} × ${quantity}</p>
            </div>

            <button
                class="remove-item"
                data-index="${index}"
                type="button"
            >
                Remove
            </button>
        `;

        cartItems.appendChild(itemElement);
    });

    if (cartTotal) {
        cartTotal.textContent = formatPrice(total);
    }

    document.querySelectorAll(".remove-item").forEach(button => {

        button.addEventListener("click", () => {

            const index = Number(button.dataset.index);

            cart.splice(index, 1);

            saveCart(cart);

            updateCart();
            renderCartPage();
        });
    });
}


/* =========================
   ADD TO CART
========================= */

function addToCart(product, quantity = 1, size = "", colour = "") {

    const cart = getCart();

    const existingItem = cart.find(item =>
        item.id === product.id &&
        item.size === size &&
        item.colour === colour
    );

    if (existingItem) {

        existingItem.quantity += quantity;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity,
            size: size,
            colour: colour
        });
    }

    saveCart(cart);

    updateCart();

    openCartPanel();
}


document.querySelectorAll(".add-cart").forEach(button => {

    button.addEventListener("click", () => {

        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        const product = findProduct(name);

        if (product) {

            addToCart(product, 1);

        } else {

            addToCart({
                id: Date.now(),
                name: name,
                price: price,
                image: "",
                category: ""
            });
        }
    });
});


/* =========================
   CART PANEL OPEN/CLOSE
========================= */

function openCartPanel() {

    if (cartPanel) {
        cartPanel.classList.add("active");
    }

    if (overlay) {
        overlay.classList.add("active");
    }
}

function closeCartPanel() {

    if (cartPanel) {
        cartPanel.classList.remove("active");
    }

    if (overlay) {
        overlay.classList.remove("active");
    }
}


if (cartBtn) {
    cartBtn.addEventListener("click", openCartPanel);
}

if (closeCart) {
    closeCart.addEventListener("click", closeCartPanel);
}

if (overlay) {
    overlay.addEventListener("click", closeCartPanel);
}


/* =========================
   PRODUCT PAGE
========================= */

const minusQty = document.getElementById("minusQty");
const plusQty = document.getElementById("plusQty");
const quantityInput = document.getElementById("quantity");
const productAddBtn = document.getElementById("productAddBtn");


if (minusQty && quantityInput) {

    minusQty.addEventListener("click", () => {

        let quantity = Number(quantityInput.value);

        if (quantity > 1) {
            quantity--;
        }

        quantityInput.value = quantity;
    });
}


if (plusQty && quantityInput) {

    plusQty.addEventListener("click", () => {

        let quantity = Number(quantityInput.value);

        quantity++;

        quantityInput.value = quantity;
    });
}


/* COLOR SELECTION */

document.querySelectorAll(".colour").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".colour").forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");
    });
});


/* SIZE SELECTION */

document.querySelectorAll(".size").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".size").forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");
    });
});


/* PRODUCT ADD BUTTON */

if (productAddBtn) {

    productAddBtn.addEventListener("click", () => {

        const name = productAddBtn.dataset.name;
        const price = Number(productAddBtn.dataset.price);

        const product = findProduct(name);

        const quantity = quantityInput
            ? Number(quantityInput.value) || 1
            : 1;

        const selectedSize =
            document.querySelector(".size.active");

        const selectedColour =
            document.querySelector(".colour.active");

        const size = selectedSize
            ? selectedSize.textContent.trim()
            : "M";

        const colour = selectedColour
            ? selectedColour.textContent.trim()
            : "Off White";

        addToCart(
            product || {
                id: Date.now(),
                name: name,
                price: price,
                image: "",
                category: ""
            },
            quantity,
            size,
            colour
        );
    });
}


/* =========================
   PRODUCT GALLERY
========================= */

const mainProductImage =
    document.querySelector(".product-main-image img");

document.querySelectorAll(".product-thumbnails img").forEach(image => {

    image.addEventListener("click", () => {

        if (mainProductImage) {
            mainProductImage.src = image.src;
        }

        document
            .querySelectorAll(".product-thumbnails img")
            .forEach(item => item.classList.remove("active"));

        image.classList.add("active");
    });
});


/* =========================
   WISHLIST
========================= */

function isWishlisted(productId) {

    const wishlist = getWishlist();

    return wishlist.some(item => item.id === productId);
}


function toggleWishlist(product) {

    let wishlist = getWishlist();

    const exists = wishlist.some(item => item.id === product.id);

    if (exists) {

        wishlist = wishlist.filter(
            item => item.id !== product.id
        );

    } else {

        wishlist.push(product);
    }

    saveWishlist(wishlist);

    updateWishlistButtons();

    renderWishlistPage();
}


function updateWishlistButtons() {

    document.querySelectorAll(".wishlist").forEach(button => {

        const name =
            button.dataset.name ||
            button.closest(".product-card")?.querySelector("h3")?.textContent.trim();

        const product = findProduct(name);

        if (!product) return;

        if (isWishlisted(product.id)) {

            button.classList.add("active");
            button.textContent = "♥";

        } else {

            button.classList.remove("active");
            button.textContent = "♡";
        }
    });
}


document.querySelectorAll(".wishlist").forEach(button => {

    button.addEventListener("click", event => {

        event.preventDefault();

        const name =
            button.dataset.name ||
            button.closest(".product-card")?.querySelector("h3")?.textContent.trim();

        const product = findProduct(name);

        if (product) {
            toggleWishlist(product);
        }
    });
});


/* PRODUCT PAGE WISHLIST */

const productWishlist =
    document.querySelector(".product-wishlist");

if (productWishlist) {

    const productName =
        productWishlist.dataset.name || "Essential Heavy Tee";

    const product =
        findProduct(productName);

    if (product && isWishlisted(product.id)) {

        productWishlist.classList.add("active");
        productWishlist.textContent = "♥";
    }

    productWishlist.addEventListener("click", () => {

        if (product) {
            toggleWishlist(product);
        }
    });
}


/* =========================
   WISHLIST PAGE
========================= */

function renderWishlistPage() {

    const wishlistProducts =
        document.getElementById("wishlistProducts");

    if (!wishlistProducts) return;

    const wishlist = getWishlist();

    if (wishlist.length === 0) {

        wishlistProducts.innerHTML = `
            <div class="wishlist-empty">
                <div class="wishlist-icon">♡</div>
                <h3>Your wishlist is empty</h3>
                <p>Save your favourite pieces here.</p>
                <a href="shop.html" class="btn">Shop now</a>
            </div>
        `;

        return;
    }

    wishlistProducts.innerHTML = wishlist.map(product => `

        <article class="product-card">

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <button
                    class="wishlist active"
                    data-name="${product.name}"
                    type="button"
                >
                    ♥
                </button>

            </div>

            <div class="product-info">

                <p>${product.category || "SERIAL"}</p>

                <h3>${product.name}</h3>

                <span>${formatPrice(product.price)}</span>

                <button
                    class="add-wishlist-cart"
                    data-id="${product.id}"
                    type="button"
                >
                    Add to bag
                </button>

            </div>

        </article>

    `).join("");


    wishlistProducts
        .querySelectorAll(".wishlist")
        .forEach(button => {

            button.addEventListener("click", () => {

                const product =
                    findProduct(button.dataset.name);

                if (product) {
                    toggleWishlist(product);
                }
            });
        });


    wishlistProducts
        .querySelectorAll(".add-wishlist-cart")
        .forEach(button => {

            button.addEventListener("click", () => {

                const product = wishlist.find(
                    item => item.id === Number(button.dataset.id)
                );

                if (product) {
                    addToCart(product, 1);
                }
            });
        });
}


/* =========================
   CART PAGE
========================= */

function renderCartPage() {

    const cartPageItems =
        document.getElementById("cartPageItems");

    if (!cartPageItems) return;

    const cart = getCart();

    const subtotalElement =
        document.getElementById("pageSubtotal");

    const shippingElement =
        document.getElementById("pageShipping");

    const totalElement =
        document.getElementById("pageTotal");

    if (cart.length === 0) {

        cartPageItems.innerHTML = `
            <div class="cart-empty-page">
                <h3>Your bag is empty.</h3>
                <p>Add something you love.</p>
                <a href="shop.html">Continue shopping →</a>
            </div>
        `;

        if (subtotalElement) {
            subtotalElement.textContent = "₹0";
        }

        if (shippingElement) {
            shippingElement.textContent = "₹0";
        }

        if (totalElement) {
            totalElement.textContent = "₹0";
        }

        return;
    }


    let subtotal = 0;

    cartPageItems.innerHTML = "";


    cart.forEach((item, index) => {

        const quantity =
            Number(item.quantity || 1);

        const itemTotal =
            Number(item.price) * quantity;

        subtotal += itemTotal;


        const element =
            document.createElement("div");

        element.className = "cart-page-item";

        element.innerHTML = `

            <div class="cart-page-image">

                <img
                    src="${item.image || ""}"
                    alt="${item.name}"
                >

            </div>

            <div class="cart-page-info">

                <h3>${item.name}</h3>

                <p>${item.colour || ""}</p>

                <p>Size: ${item.size || "M"}</p>

                <p class="cart-page-price">
                    ${formatPrice(item.price)}
                </p>

                <div class="cart-page-controls">

                    <button
                        class="page-minus"
                        data-index="${index}"
                        type="button"
                    >
                        −
                    </button>

                    <span>${quantity}</span>

                    <button
                        class="page-plus"
                        data-index="${index}"
                        type="button"
                    >
                        +
                    </button>

                    <button
                        class="cart-remove"
                        data-index="${index}"
                        type="button"
                    >
                        Remove
                    </button>

                </div>

            </div>
        `;

        cartPageItems.appendChild(element);
    });


    const shipping =
        subtotal >= 999 ? 0 : 99;

    const total =
        subtotal + shipping;


    if (subtotalElement) {
        subtotalElement.textContent =
            formatPrice(subtotal);
    }

    if (shippingElement) {
        shippingElement.textContent =
            shipping === 0
                ? "FREE"
                : formatPrice(shipping);
    }

    if (totalElement) {
        totalElement.textContent =
            formatPrice(total);
    }


    /* PLUS */

    document.querySelectorAll(".page-plus")
        .forEach(button => {

            button.addEventListener("click", () => {

                const index =
                    Number(button.dataset.index);

                cart[index].quantity++;

                saveCart(cart);

                renderCartPage();
                updateCart();
            });
        });


    /* MINUS */

    document.querySelectorAll(".page-minus")
        .forEach(button => {

            button.addEventListener("click", () => {

                const index =
                    Number(button.dataset.index);

                if (cart[index].quantity > 1) {

                    cart[index].quantity--;

                } else {

                    cart.splice(index, 1);
                }

                saveCart(cart);

                renderCartPage();
                updateCart();
            });
        });


    /* REMOVE */

    document.querySelectorAll(".cart-remove")
        .forEach(button => {

            button.addEventListener("click", () => {

                const index =
                    Number(button.dataset.index);

                cart.splice(index, 1);

                saveCart(cart);

                renderCartPage();
                updateCart();
            });
        });
}


/* =========================
   CHECKOUT
========================= */

const checkoutBtn =
    document.getElementById("checkoutBtn");

if (checkoutBtn) {

    checkoutBtn.addEventListener("click", () => {

        const cart = getCart();

        if (cart.length === 0) {

            alert("Your bag is empty.");

            return;
        }

        if (!isLoggedIn()) {

            alert("Please login before checkout.");

            window.location.href = "login.html";

            return;
        }

        alert(
            "Checkout will be connected with the SERIAL backend and payment system."
        );
    });
}


/* =========================
   SHOP FILTER + SORT
========================= */

const categoryFilter =
    document.getElementById("categoryFilter");

const sortProducts =
    document.getElementById("sortProducts");


function filterShopProducts() {

    const productGrid =
        document.querySelector(".shop-product-grid");

    if (!productGrid) return;

    let filteredProducts = [...products];


    if (categoryFilter) {

        const category =
            categoryFilter.value;

        if (category && category !== "All") {

            filteredProducts =
                filteredProducts.filter(
                    product =>
                        product.category === category
                );
        }
    }


    const checkedCategories =
        [...document.querySelectorAll(
            '.filter-option input[type="checkbox"]'
        )]
        .filter(input => input.checked)
        .map(input => input.value);


    if (checkedCategories.length > 0) {

        filteredProducts =
            filteredProducts.filter(product =>
                checkedCategories.includes(
                    product.category
                )
            );
    }


    if (sortProducts) {

        const sort = sortProducts.value;

        if (sort === "low") {

            filteredProducts.sort(
                (a, b) => a.price - b.price
            );

        } else if (sort === "high") {

            filteredProducts.sort(
                (a, b) => b.price - a.price
            );

        } else if (sort === "new") {

            filteredProducts.reverse();
        }
    }


    renderShopProducts(filteredProducts);
}


function renderShopProducts(productList) {

    const productGrid =
        document.querySelector(".shop-product-grid");

    if (!productGrid) return;


    productGrid.innerHTML =
        productList.map(product => `

        <article class="product-card">

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                ${
                    product.badge
                        ? `<span class="product-badge">${product.badge}</span>`
                        : ""
                }

                <button
                    class="wishlist ${
                        isWishlisted(product.id)
                            ? "active"
                            : ""
                    }"
                    data-name="${product.name}"
                    type="button"
                >
                    ${
                        isWishlisted(product.id)
                            ? "♥"
                            : "♡"
                    }
                </button>

            </div>

            <div class="product-info">

                <p>${product.category}</p>

                <h3>${product.name}</h3>

                <span>${formatPrice(product.price)}</span>

                <div class="product-actions">

                    <a href="product.html">
                        View product
                    </a>

                    <button
                        class="add-cart"
                        data-name="${product.name}"
                        data-price="${product.price}"
                        type="button"
                    >
                        Add
                    </button>

                </div>

            </div>

        </article>

    `).join("");


    productGrid
        .querySelectorAll(".add-cart")
        .forEach(button => {

            button.addEventListener("click", () => {

                const product =
                    findProduct(button.dataset.name);

                if (product) {
                    addToCart(product, 1);
                }
            });
        });


    productGrid
        .querySelectorAll(".wishlist")
        .forEach(button => {

            button.addEventListener("click", () => {

                const product =
                    findProduct(button.dataset.name);

                if (product) {
                    toggleWishlist(product);
                }
            });
        });
}


if (categoryFilter) {
    categoryFilter.addEventListener(
        "change",
        filterShopProducts
    );
}


if (sortProducts) {
    sortProducts.addEventListener(
        "change",
        filterShopProducts
    );
}


document
    .querySelectorAll('.filter-option input[type="checkbox"]')
    .forEach(input => {

        input.addEventListener(
            "change",
            filterShopProducts
        );
    });


/* =========================
   SEARCH
========================= */

const searchBtn =
    document.getElementById("searchBtn");

const searchOverlay =
    document.getElementById("searchOverlay");

const closeSearch =
    document.getElementById("closeSearch");

const searchInput =
    document.getElementById("searchInput");

const searchResults =
    document.getElementById("searchResults");


if (searchBtn && searchOverlay) {

    searchBtn.addEventListener("click", () => {

        searchOverlay.classList.add("active");

        setTimeout(() => {

            if (searchInput) {
                searchInput.focus();
            }

        }, 100);
    });
}


if (closeSearch && searchOverlay) {

    closeSearch.addEventListener("click", () => {

        searchOverlay.classList.remove("active");
    });
}


if (searchInput) {

    searchInput.addEventListener("input", () => {

        const value =
            searchInput.value
                .toLowerCase()
                .trim();


        if (!value) {

            searchResults.innerHTML = "";

            return;
        }


        const matches =
            products.filter(product =>
                product.name
                    .toLowerCase()
                    .includes(value) ||

                product.category
                    .toLowerCase()
                    .includes(value)
            );


        if (matches.length === 0) {

            searchResults.innerHTML = `
                <div class="search-result">
                    No products found.
                </div>
            `;

            return;
        }


        searchResults.innerHTML =
            matches.map(product => `

                <div
                    class="search-result"
                    data-product="${product.name}"
                >
                    <strong>
                        ${product.name}
                    </strong>

                    <span>
                        — ${product.category}
                    </span>
                </div>

            `).join("");


        document
            .querySelectorAll(".search-result[data-product]")
            .forEach(result => {

                result.addEventListener("click", () => {

                    window.location.href =
                        "product.html";
                });
            });
    });
}


/* =========================
   MOBILE MENU
========================= */

const menuBtn =
    document.getElementById("menuBtn");

const mobileMenu =
    document.getElementById("mobileMenu");


if (menuBtn && mobileMenu) {

    menuBtn.addEventListener("click", () => {

        mobileMenu.classList.toggle("active");
    });
}


document
    .querySelectorAll(".mobile-menu a")
    .forEach(link => {

        link.addEventListener("click", () => {

            if (mobileMenu) {
                mobileMenu.classList.remove("active");
            }
        });
    });


/* =========================
   NEWSLETTER
========================= */

const newsletterForm =
    document.getElementById("newsletterForm");


if (newsletterForm) {

    newsletterForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const email =
                this.querySelector("input").value.trim();

            if (!email) return;

            alert(
                "Thanks for joining SERIAL."
            );

            this.reset();
        }
    );
}


/* =========================
   REGISTER
========================= */

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const firstName =
                document
                    .getElementById("firstName")
                    .value.trim();

            const lastName =
                document
                    .getElementById("lastName")
                    .value.trim();

            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim()
                    .toLowerCase();

            const password =
                document
                    .getElementById("registerPassword")
                    .value;

            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;


            if (password !== confirmPassword) {

                alert("Passwords do not match.");

                return;
            }


            if (password.length < 6) {

                alert(
                    "Password must contain at least 6 characters."
                );

                return;
            }


            const user = {

                firstName,
                lastName,
                email,
                password
            };


            saveUser(user);

            localStorage.setItem(
                "serialLoggedIn",
                "true"
            );


            alert(
                "Account created successfully. Welcome to SERIAL!"
            );


            window.location.href =
                "index.html";
        }
    );
}


/* =========================
   LOGIN
========================= */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim()
                    .toLowerCase();

            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            const user =
                getUser();


            if (!user) {

                alert(
                    "No account found. Please register first."
                );

                return;
            }


            if (
                user.email !== email ||
                user.password !== password
            ) {

                alert(
                    "Invalid email or password."
                );

                return;
            }


            localStorage.setItem(
                "serialLoggedIn",
                "true"
            );


            alert(
                `Welcome back, ${user.firstName}!`
            );


            window.location.href =
                "index.html";
        }
    );
}


/* =========================
   FORGOT PASSWORD
========================= */

const forgotPassword =
    document.getElementById("forgotPassword");


if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        event => {

            event.preventDefault();

            const user = getUser();

            if (!user) {

                alert(
                    "No registered account found."
                );

                return;
            }

            alert(
                "Password reset will be connected with the backend later."
            );
        }
    );
}


/* =========================
   GOOGLE LOGIN
========================= */

const googleLogin =
    document.getElementById("googleLogin");


if (googleLogin) {

    googleLogin.addEventListener(
        "click",
        () => {

            alert(
                "Google authentication will be connected with the backend later."
            );
        }
    );
}


/* =========================
   ACCOUNT STATUS
========================= */

function updateAccountUI() {

    const user = getUser();

    document
        .querySelectorAll("[data-account-name]")
        .forEach(element => {

            if (user && isLoggedIn()) {

                element.textContent =
                    user.firstName;

            } else {

                element.textContent =
                    "Account";
            }
        });
}


/* =========================
   LOGOUT
========================= */

document
    .querySelectorAll("[data-logout]")
    .forEach(button => {

        button.addEventListener("click", () => {

            localStorage.removeItem(
                "serialLoggedIn"
            );

            alert("You have been logged out.");

            window.location.href =
                "index.html";
        });
    });


/* =========================
   ESCAPE KEY
========================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") return;


        if (searchOverlay) {
            searchOverlay.classList.remove("active");
        }

        if (cartPanel) {
            cartPanel.classList.remove("active");
        }

        if (overlay) {
            overlay.classList.remove("active");
        }

        if (mobileMenu) {
            mobileMenu.classList.remove("active");
        }
    }
);


/* =========================
   INITIALIZE
========================= */

updateCart();

renderCartPage();

renderWishlistPage();

updateWishlistButtons();

updateAccountUI();

filterShopProducts();