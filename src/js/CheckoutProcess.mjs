import { alertMessage, removeAllAlerts, setLocalStorage } from "./utils.mjs";

import ExternalServices from "./ExternalServices.mjs";

// takes the items currently stored in the cart (localstorage) and returns them in a simplified form.
function packageItems(items) {
    // convert the list of products from localStorage to the simpler form required for the checkout process.
  return items.map(item => {
    return {
      Id: item.Id,
      Name: item.Name,
      FinalPrice: item.FinalPrice,
    };
  });
}


const services = new ExternalServices();
function formDataToJSON(formElement) {
  const formData = new FormData(formElement),
    convertedJSON = {};

  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

/**
 * @param {ShoppingCart} shoppingCart
 * @param {string} outputSelector
 */
export default class CheckoutProcess {
  constructor(shoppingCart, outputSelector) {
    this.cart = shoppingCart;
    this.key = this.cart.getKey();
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.taxRate = 0.06; 
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = this.cart.getCart();
    this.calculateItemSummary();
    this.calculateOrderTotal();
    this.displayorderitems();

    document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
      e.preventDefault();

      // Form Validation
      const checkoutForm = document.forms[0];
      const checkoutFormStatus = checkoutForm.checkValidity();
      // Report issues to user
      checkoutForm.reportValidity();

      if (checkoutFormStatus) {
        this.checkout();
      }
    });
  }

  calculateItemSummary() {
    this.itemTotal = this.cart.getTotal();
    this.calculateOrderTotal();
  }

  calculateOrderTotal() {
    // Shipping: Use $10 for the first item plus $2 for each additional item after that.
    this.shipping = 10 + (this.cart.getNumberItemsInCart()) * 2;
    // Tax: Use 6% sales tax.
    this.tax = this.itemTotal * this.taxRate;
    // order total.
    this.orderTotal = this.itemTotal + this.shipping + this.tax;

  }

 displayorderitems (){
    const ordertotal = document.querySelector(this.outputSelector + " #subtotal");
    const shipping = document.querySelector(this.outputSelector + " #shipping");
    const tax = document.querySelector(this.outputSelector + " #Tax");
    const ordertotals = document.querySelector(this.outputSelector + " #ordertotal"); 
     
    ordertotal.innerText = "$" + this.itemTotal;
    shipping.innerText = "$" + this.shipping;
    tax.innerText = "$" + this.tax.toFixed(2);
    ordertotals.innerText = "$" + this.orderTotal.toFixed(2);

 }
  
    
  async checkout() {
    const formTable = document.forms["form-data"];
    const json = formDataToJSON(formTable);

     // add totals, and item details
     json.orderDate = new Date();
     json.orderTotal = this.orderTotal.toFixed(2);
     json.tax = this.tax;
     json.shipping = this.shipping;
     json.items = packageItems(this.list);
    try {
      const res = await services.checkout(json);
      // Empty cart
      this.cart.emptyCart();
      // Move to success page
      // Using replace so users cannot double order
      window.location.replace("/checkout/success.html");
    } catch (err) {
      removeAllAlerts();
      alertMessage(err.message);

    }
  }
}

