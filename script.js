// ===============================
// USER REGISTRATION & LOGIN
// ===============================

function openLogin() {
    document.getElementById("loginModal").style.display = "flex";
}

function openRegister() {
    document.getElementById("registerModal").style.display = "flex";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

function switchToRegister() {
    closeModal("loginModal");
    openRegister();
}

function switchToLogin() {
    closeModal("registerModal");
    openLogin();
}


// REGISTER

function register() {

    let name =
        document.getElementById("registerName").value.trim();

    let email =
        document.getElementById("registerEmail").value.trim();

    let phone =
        document.getElementById("registerPhone").value.trim();

    let password =
        document.getElementById("registerPassword").value;

    let confirmPassword =
        document.getElementById("confirmPassword").value;

    let message =
        document.getElementById("registerMessage");


    if (!name || !email || !phone || !password) {

        message.innerText =
            "Please fill all the fields.";

        return;
    }


    if (password !== confirmPassword) {

        message.innerText =
            "Passwords do not match.";

        return;
    }


    let user = {
        name: name,
        email: email,
        phone: phone,
        password: password
    };


    localStorage.setItem(
        "coffeeUser",
        JSON.stringify(user)
    );


    message.innerText =
        "Registration successful! Please login.";

    setTimeout(() => {

        closeModal("registerModal");
        openLogin();

    }, 1000);
}


// LOGIN

function login() {

    let email =
        document.getElementById("loginEmail").value.trim();

    let password =
        document.getElementById("loginPassword").value;

    let message =
        document.getElementById("loginMessage");


    let storedUser =
        JSON.parse(localStorage.getItem("coffeeUser"));


    if (!storedUser) {

        message.innerText =
            "No account found. Please register.";

        return;
    }


    if (
        email === storedUser.email &&
        password === storedUser.password
    ) {

        localStorage.setItem("loggedIn", "true");

        message.innerText =
            "Login successful! ☕";

        setTimeout(() => {

            closeModal("loginModal");

        }, 800);

    } else {

        message.innerText =
            "Invalid email or password.";

    }
}


// ===============================
// CART
// ===============================

let cart =
    JSON.parse(localStorage.getItem("coffeeCart")) || [];


function addToCart(name, price) {

    let existing =
        cart.find(item => item.name === name);


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            name: name,
            price: price,
            quantity: 1
        });

    }


    saveCart();

    alert(name + " added to your cart! ☕");
}


function saveCart() {

    localStorage.setItem(
        "coffeeCart",
        JSON.stringify(cart)
    );

    updateCartCount();
}


function updateCartCount() {

    let count = cart.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );

    document.getElementById(
        "cartCount"
    ).innerText = count;
}


function openCart() {

    displayCart();

    document.getElementById(
        "cartModal"
    ).style.display = "flex";
}


function displayCart() {

    let container =
        document.getElementById("cartItems");

    let totalElement =
        document.getElementById("cartTotal");


    container.innerHTML = "";


    if (cart.length === 0) {

        container.innerHTML =
            "<p>Your cart is empty ☕</p>";

        totalElement.innerText =
            "Total: ₹0";

        return;
    }


    let total = 0;


    cart.forEach((item, index) => {

        total +=
            item.price * item.quantity;


        container.innerHTML += `

            <div class="cart-item">

                <div>
                    <strong>${item.name}</strong>
                    <br>
                    ₹${item.price}
                    × ${item.quantity}
                </div>

                <div>

                    <button
                        onclick="increaseItem(${index})">
                        +
                    </button>

                    <button
                        onclick="decreaseItem(${index})">
                        -
                    </button>

                    <button
                        onclick="removeItem(${index})">
                        🗑
                    </button>

                </div>

            </div>
        `;

    });


    totalElement.innerText =
        "Total: ₹" + total;
}


function increaseItem(index) {

    cart[index].quantity++;

    saveCart();

    displayCart();
}


function decreaseItem(index) {

    cart[index].quantity--;

    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }

    saveCart();

    displayCart();
}


function removeItem(index) {

    cart.splice(index, 1);

    saveCart();

    displayCart();
}


// ===============================
// BOOKING
// ===============================

function openBooking() {

    if (cart.length === 0) {

        alert(
            "Please add at least one item to your cart."
        );

        return;
    }


    let loggedIn =
        localStorage.getItem("loggedIn");


    if (loggedIn !== "true") {

        alert(
            "Please login or register before booking."
        );

        closeModal("cartModal");

        openLogin();

        return;
    }


    closeModal("cartModal");

    document.getElementById(
        "bookingModal"
    ).style.display = "flex";


    let user =
        JSON.parse(
            localStorage.getItem("coffeeUser")
        );


    if (user) {

        document.getElementById(
            "customerName"
        ).value = user.name;

        document.getElementById(
            "customerPhone"
        ).value = user.phone;

    }
}


function confirmBooking() {

    let name =
        document.getElementById(
            "customerName"
        ).value.trim();

    let phone =
        document.getElementById(
            "customerPhone"
        ).value.trim();

    let date =
        document.getElementById(
            "bookingDate"
        ).value;

    let time =
        document.getElementById(
            "bookingTime"
        ).value;

    let orderType =
        document.getElementById(
            "orderType"
        ).value;


    let message =
        document.getElementById(
            "bookingMessage"
        );


    if (
        !name ||
        !phone ||
        !date ||
        !time ||
        !orderType
    ) {

        message.innerText =
            "Please fill all required fields.";

        return;
    }


    let bookingId =
        "BB" +
        Math.floor(
            10000 + Math.random() * 90000
        );


    localStorage.setItem(
        "lastBooking",
        JSON.stringify({
            id: bookingId,
            name: name,
            phone: phone,
            date: date,
            time: time,
            orderType: orderType,
            cart: cart
        })
    );


    closeModal("bookingModal");


    document.getElementById(
        "bookingId"
    ).innerText =
        "Booking ID: " + bookingId;


    document.getElementById(
        "confirmationDetails"
    ).innerText =
        `Name: ${name} | Date: ${date} | Time: ${time} | ${orderType}`;


    document.getElementById(
        "confirmationModal"
    ).style.display = "flex";


    // Empty cart after successful booking

    cart = [];

    saveCart();
}


// ===============================
// NAVIGATION
// ===============================

function goToMenu() {

    document.getElementById(
        "menu"
    ).scrollIntoView({
        behavior: "smooth"
    });
}


// ===============================
// INITIAL LOAD
// ===============================

updateCartCount();