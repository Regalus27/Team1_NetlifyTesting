// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * @param {string} data - Information to be rendered using renderWithList, utils.mjs
 */
function defaultTemplate(data) {
  return data;
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// get product type from URL
export function getParam(params) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(params);

  return product;
}

// We don't have user logins to hold a cart key, so I want an easily accessible cart key.
export function getShoppingCartKey() {
  return "so-cart";
}

/**
 * @param {string} key - key of cart's localstorage
 * @param {string} id - id of product to remove from cart
 */
export function removeItemFromLocalStorage(key, id) {
  const cart = getLocalStorage(key);
  const newCart = cart.filter(element => element.Id != id);
  setLocalStorage(key, newCart);
}

// render a list of products in HTML using a given template function
export function renderListWithTemplate(
  templateFunction,         // Function used to render the product
  parentElement,            // Target HTML element for rendering
  list,                     // List of products to be rendered
  position = "afterbegin",  // Used in insertAdjacentHTML(position, ...)
  clear = false             // True if the HTML Element needs to be cleared before render
  ) {
    // Clear the HTML element if requested
    if (clear) {
      parentElement.replaceChildren();
    }
    // Convert list into filled templates.
    const htmlItems = list.map((item) => templateFunction(item));
    // Insert filled templates into the HTML.
    parentElement.insertAdjacentHTML(position, htmlItems.join(""));
  }


/**
 * @param templateFunction - Optional function to use in rendering an object. If using output from another rendering function, set this value to null and pass in the string through the data parameter.
 * @param {Element} parentElement - Element from the HTML page to render this data inside.
 * @param {string} data - Data to be rendered into the Element. If this is a list, use renderListWithTemplate.
 * @param {string} position - insertAdjacentHTML(position, ...) Look up documentation for that.
 * @param {boolean} clear - if True, remove all content from the Element before inserting new data.
 */
export function renderWithTemplate(
  templateFunction,                       // Function used to render the product
  parentElement,                          // Target HTML element for rendering
  data,                                   // data to insert into template
  position = "afterbegin",                // Used in insertAdjacentHTML(position, ...)
  clear = false                           // True if the HTML Element needs to be cleared before render
  ) {
    // Clear the HTML element if requested
    if (clear) {
      parentElement.replaceChildren();
    }
    if (templateFunction == null) {
      parentElement.insertAdjacentHTML(position, defaultTemplate(data));
    }
    else {
      parentElement.insertAdjacentHTML(position, templateFunction(data));
    }
  }

export async function loadHeaderFooter(headerID, footerID, headerPath, footerPath) {
  const header_element = document.getElementById(headerID);
  const footer_element = document.getElementById(footerID);

  const header_response = await fetch(headerPath);
  const footer_response = await fetch(footerPath);
  
  const header_template = await header_response.text();
  const footer_template = await footer_response.text();

  renderWithTemplate(null, header_element, header_template);
  renderWithTemplate(null, footer_element, footer_template);

  // if (header_response.ok) {
  //   const header_data = await header_response.text();
  //   const header_template = document.createElement("template");
  //   header_template.innerHTML = header_data;
  //   // header_element.insertAdjacentHTML("afterbegin", header_template);
  //   renderWithTemplate(header_template, header_element);
  // }
  // if (footer_response.ok) {
  //   const footer_data = await footer_response.text();
  //   const footer_template = document.createElement("template");
  //   footer_template.innerHTML = footer_data;
  //   renderWithTemplate(footer_template, footer_element);
  // }
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}
