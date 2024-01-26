import { getLocalStorage, setLocalStorage } from "./utils.mjs";

// Emiliano's Solution
function productDetailsTemplate(product) {
    const discountDifference = ((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100;

    return `<section class="product-detail">
        <h3>${product.Brand.Name}</h3>
        <h2 class="divider">${product.NameWithoutBrand}</h2>
        <img src="${product.Image}" alt="${product.NameWithoutBrand}" />
        <p class="product-card__price">${product.FinalPrice}</p>
        <p class="product__color">Color: ${product.Colors[0].ColorName}</p>
        <p class="product__description">${product.DescriptionHtmlSimple}</p>
        <p class="discount-difference">Discount Difference: ${discountDifference.toFixed(0)}%</p>
        <div class="product-detail__add">
            <button id="productButton" data-id="${product.Id}">Add to Cart</button>
        </div>
    </section>`;
}

export default class ProductDetails {
    constructor(productID, dataSource) {
        this.productID = productID;
        this.product = [];
        this.dataSource = dataSource;
    }

    async init() {
        this.product = await this.dataSource.findProductById(this.productID);

        // render HTML, once rendered we can bind the button
        this.renderProductDetails("main");

        // use our datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
        // once we have the product details we can render out the HTML
        // once the HTML is rendered we can add a listener to Add to Cart button
        // Notice the .bind(this). Our callback will not work if we don't include that line. Review the readings from this week on 'this' to understand why.
        document.getElementById("productButton")
          .addEventListener("click", this.addToCart.bind(this));
    }

    // Armando's Week 1 Solution
    addToCart() {
        let key = "so-cart";
        var cart_list = getLocalStorage(key);
        let list = [];
        if (cart_list != null) {
            cart_list.forEach(item => {
              list.push(item);
            });
        }
        list.push(this.product);
        setLocalStorage(key, list);
    }

    // TODO: Refactor this to work with the generic renderer in utils.js
    // Issue seems to be that this page only handles one product?
    renderProductDetails(selector) {
        const element = document.querySelector(selector);
        element.insertAdjacentHTML("afterBegin", productDetailsTemplate(this.product));
    }
}