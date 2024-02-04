import { getLocalStorage, getShoppingCartKey, removeItemFromLocalStorage, renderListWithTemplate, renderWithTemplate, setLocalStorage } from "./utils.mjs";

export default class ShoppingCart {
    /**
     * @param {Element} parentElement - Element from html to insert cart templates into
     */
    constructor(parentElement = null) {
        this.cartKey = getShoppingCartKey();
        this.parentElement = parentElement;
    }

    init() {

    }

    bindRemoveButtons() {
        document.getElementById("cart-list").addEventListener("click", (e) => {
            // e.target is clicked element
            // verify it is a button
            if (e.target && e.target.nodeName == "BUTTON") {
              // Use data-id to remove that item from the cart
              this.removeFromCart(e.target.getAttribute("data-id"));
            }
          });
    }

    emptyCart() {
        setLocalStorage(this.cartKey, []);
    }

    getCart() {
        return getLocalStorage(this.cartKey);
    }

    getKey() {
        return this.cartKey;
    }

    // Original Code by Kjirsten Dunn
    // Modified by Cooper Anderson
    // Returns the total price of all items in the cart.
    getTotal() {
        let sum = 0;
        let cart = this.getCart();
        if (cart != null) {
            cart.forEach(element => {
                sum += Number(element.FinalPrice) * Number(element.Quantity);
            });
        }
        return sum;
    }

    // Returns the total number of items in the cart.
    getNumberItemsInCart() {
        let count = 0;
        let cart = this.getCart();
        if (cart != null) {
            cart.forEach(element => {
                count += Number(element.Quantity);
            });
        }
        return count;
    }

    /**
     * @param {string} id - Product ID to remove from cart
     */
    removeFromCart(id) {
        removeItemFromLocalStorage(this.cartKey, id, false);
        this.renderCart();
    }

    renderCart() {
        let cart = this.getCart();
        if (cart != null && cart.length != 0) {
            renderListWithTemplate(cartItemTemplate, this.parentElement, this.getCart(), "afterbegin", true);
            renderWithTemplate(cartTotalTemplate, this.parentElement, this.getTotal(), "beforeend", false);
        }
        else {
            renderWithTemplate(null, this.parentElement, emptyCartTemplate(), "afterbegin", true);
        }
        this.bindRemoveButtons();
    }
}

/**
 * @param product - json of the product to be rendered.
 */
function cartItemTemplate(product) {
    return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img
        src="${product.Images.PrimaryMedium}"
        alt="${product.Name}"
      />
    </a>
    <a href="#">
      <h2 class="card__name">${product.Name}</h2>
    </a>
    <p class="cart-card__color">${product.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: ${product.Quantity}</p>
    <p class="cart-card__price">$${(Number(product.FinalPrice) * Number(product.Quantity)).toFixed(2)}</p>
    <button class="cart-remove__button" data-id="${product.Id}">Remove</button>
  </li>`;
}

/**
 * @param totalPrice - total price of all products in cart
 */
function cartTotalTemplate(totalPrice) {
    return `<li class="cart-card cart-price divider" id="cart-total">
        <p class="cart-card__total_price">Total: $${totalPrice.toFixed(2)}<p>
        <a href="/checkout/index.html">
            <button>checkout</button>
        </a>
    </li>`;
}

function emptyCartTemplate() {
    return `<li class="cart-card">
    <p>Your cart is empty.</p>
    </li>`;
}