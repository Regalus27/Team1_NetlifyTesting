const baseURL = import.meta.env.VITE_SERVER_URL;
async function convertToJson(res) {
  let response = await res.json();
  if (res.ok) {
    return response;
  } else {
    throw new Error(Object.values(response)[0]);
  }
}

export default class ExternalServices {
  constructor() {

  }
  async getData(category) {
    const response = await fetch(baseURL + `products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }
  async findProductById(id) {
    const response = await fetch(baseURL + `product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    return await fetch(baseURL + "checkout/", options).then(convertToJson);
  }
}

class ServicesError extends Error {
  constructor(message) {
    super(message);
    this.name = "ServicesError";
  }
}
