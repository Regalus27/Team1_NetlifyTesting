import ShoppingCart from "./ShoppingCart.mjs";
import { loadHeaderFooter } from "./utils.mjs";

const targetElement = document.getElementById("cart-list");
const shoppingCart = new ShoppingCart(targetElement);
shoppingCart.renderCart();

loadHeaderFooter(
  "header",
  "footer",
  "/partials/header.html",
  "/partials/footer.html"
);
