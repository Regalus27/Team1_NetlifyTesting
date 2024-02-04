import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";
import { getShoppingCartKey } from "./utils.mjs";

const check = new CheckoutProcess(getShoppingCartKey(), ".order-summary");
check.init();

loadHeaderFooter(
  "header",
  "footer",
  "/partials/header.html",
  "/partials/footer.html"
);
