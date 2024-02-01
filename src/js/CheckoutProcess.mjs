import { loadHeaderFooter, renderWithTemplate } from "./utils.mjs";
import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import { getShoppingCartKey } from "./utils.mjs";


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


export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.taxRate = 0.06; 
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSummary();
    this.calculateOrderTotal();
    this.displayorderitems();
    this.checkout();
    

  }

  calculateItemSummary() {
    this.itemTotal = this.list.reduce((total, item) => total + item.FinalPrice, 0);
    const numItems = this.list.length;

   /* document.querySelector(this.outputSelector).innerHTML = `
      <p>Total Items: ${numItems}</p>
      <p>Item Total: $${this.itemTotal}</p>
    `; */
    this.calculateOrderTotal();
  }

  calculateOrderTotal() {
    // Shipping: Use $10 for the first item plus $2 for each additional item after that.
    this.shipping = 10 + (this.list.length - 1) * 2;
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
     json.orderTotal = this.orderTotal;
     json.tax = this.tax;
     json.shipping = this.shipping;
     json.items = packageItems(this.list);
     console.log(json);
    try {
    const res = await services.checkout(json);
    console.log(res);
    } catch (err) {
    console.log(err);
        }
    }
}

