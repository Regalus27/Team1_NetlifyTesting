import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

const dataSource = new ProductData("tents");
const element = document.querySelector(".product-list");
const productListing = new ProductList("Tents", dataSource, element);
productListing.init();

// Here we load the header and the footer

loadHeaderFooter(
  "header",
  "footer",
  "/partials/header.html",
  "/partials/footer.html"
);
