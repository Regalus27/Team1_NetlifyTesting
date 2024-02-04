import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

const cart = new ShoppingCart();
const check = new CheckoutProcess(cart, ".order-summary");
check.init();

loadHeaderFooter(
  "header",
  "footer",
  "/partials/header.html",
  "/partials/footer.html"
);
