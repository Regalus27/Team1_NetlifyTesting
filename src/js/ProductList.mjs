import { renderListWithTemplate } from "./utils.mjs";

export default class ProductList {
    // Requires product category, datasource, and HTML element to render in
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    // Populate list of products
    async init() {
        const products = await this.dataSource.getData(this.category);
        this.renderList(products);

        document.getElementById("listing_title").innerHTML = `Top Products: ${this.category}`;

        /*const filteredProducts = this.filterByDenylist(products);
        this.renderList(filteredProducts);*/
    }

    // Remove products that are marked as not ready.
    filterByDenylist(products) {
        // Tedious but it works. Ideally the database would have a field for if the data can be public.
        // Barring that, this list would be synced up with a nice GUI for marketing.
        const idDenylist = ["989CG", "880RT"];

        return products.filter(
            (item) => !idDenylist.includes(item.Id)
        );
    }

    // Render HTML for each product
    renderList(products) {
        renderListWithTemplate(productCardTemplate, this.listElement, products);
    }
}

function productCardTemplate(product) {
    return `<li class="product-card">
    <a href="/product_pages/?product=${product.Id}">
      <img
        src="${product.Images.PrimaryMedium}"
        alt="${product.NameWithoutBrand}"
      />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}