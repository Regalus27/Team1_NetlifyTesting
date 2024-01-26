import { getLocalStorage, getShoppingCartKey, removeItemFromLocalStorage, renderListWithTemplate, renderWithTemplate } from "./utils.mjs";

export default class ShoppingCart {
    /**
     * @param {Element} parentElement - Element from html to insert cart templates into
     */
    constructor(parentElement) {
        this.cartKey = getShoppingCartKey(); // Sloppy but better than typing manually
        this.parentElement = parentElement;
    }

    init() {
        this.renderCart();
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

    getCart() {
        return getLocalStorage(this.cartKey);
    }

    // Original Code by Kjirsten Dunn
    // Modified by Cooper Anderson
    // Returns the total price of all items in the cart.
    getTotal() {
        let sum = 0;
        let cart = this.getCart();
        if (cart != null) {
            cart.forEach(element => {
                sum += element.FinalPrice;
            });
        }
        return sum;
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
        src="${product.Image}"
        alt="${product.Name}"
      />
    </a>
    <a href="#">
      <h2 class="card__name">${product.Name}</h2>
    </a>
    <p class="cart-card__color">${product.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${product.FinalPrice}</p>
    <button class="cart-remove__button" data-id="${product.Id}">Remove</button>
  </li>`;
}

/**
 * @param totalPrice - total price of all products in cart
 */
function cartTotalTemplate(totalPrice) {
    return `<li class="cart-card cart-price divider" id="cart-total">
        <p class="cart-card__total_price">Total: ${totalPrice}<p>
    </li>`;
}

function emptyCartTemplate() {
    return `<li class="cart-card">
    <p>Your cart is empty.</p>
    </li>`;
}