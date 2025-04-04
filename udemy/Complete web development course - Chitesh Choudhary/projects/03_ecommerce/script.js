document.addEventListener("DOMContentLoaded", function () {
    const products = [
        { id: 1, name: "Product 1", price: 10.0 },
        { id: 2, name: "Product 2", price: 30.0 },
        { id: 3, name: "Product 3", price: 15.0 },
    ];

    const cart = [];
    const productList = document.getElementById("product-list");
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const totalPrice = document.getElementById("total-price");
    const checkoutButton = document.getElementById("checkout-btn");
    const emptyCart = document.getElementById("empty-cart");

    products.forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");
        productDiv.innerHTML = `
            <span>${product.name} - ${product.price.toFixed(2)}</span>
            <button data-id="${product.id}">Add to Cart</button>
        `;

        productList.appendChild(productDiv);

        const addButton = productDiv.querySelector("button");

        addButton.addEventListener("click", () => {
            const item = { ...product, dataRef: Date.now() };
            cart.push(item);
            console.log(cart);
            updateCart();
        });
    });

    function updateCart() {
        let total = 0;

        cart.forEach((item) => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("cart-item");

            itemDiv.innerHTML = `
                <span>${item.name} - ${item.price.toFixed(2)}</span>
                <button data-id="${item.dataRef}">Remove</button>
            `;

            cartItems.appendChild(itemDiv);
            const removeButton = itemDiv.querySelector("button");

            removeButton.addEventListener("click", () => {
                const dataRef = parseInt(removeButton.dataset.id);
                const index = cart.findIndex(
                    (cartItem) => cartItem.dataRef === dataRef
                );
                if (index !== -1) {
                    cart.splice(index, 1);
                    console.log(cart);
                }
                itemDiv.remove();
                updateCart();
            });

            total += item.price;
        });

        totalPrice.textContent = total.toFixed(2);
        if (total > 0) {
            cartTotal.classList.remove("hidden");
            emptyCart.classList.add("hidden");
        } else {
            emptyCart.classList.remove("hidden");
            cartTotal.classList.add("hidden");
        }
    }
});
