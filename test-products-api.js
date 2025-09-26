// Test API endpoints
const API_BASE_URL = "http://localhost:5001/api";

const testAPI = async () => {
  console.log("Testing API endpoints...");

  try {
    // Test health endpoint
    console.log("\n1. Testing health endpoint...");
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log("Health check:", healthData);

    // Test products endpoint
    console.log("\n2. Testing products endpoint...");
    const productsResponse = await fetch(`${API_BASE_URL}/products`);
    const productsData = await productsResponse.json();
    console.log("Products:", productsData);

    if (productsData.products && productsData.products.length > 0) {
      const firstProduct = productsData.products[0];
      console.log("\n3. Testing single product endpoint...");
      console.log("First product ID:", firstProduct._id || firstProduct.id);

      const productResponse = await fetch(
        `${API_BASE_URL}/products/${firstProduct._id || firstProduct.id}`
      );
      const productData = await productResponse.json();
      console.log("Single product:", productData);
    }

    // Test categories endpoint
    console.log("\n4. Testing categories endpoint...");
    const categoriesResponse = await fetch(
      `${API_BASE_URL}/products/categories`
    );
    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      console.log("Categories:", categoriesData);
    } else {
      console.error("Categories endpoint failed:", categoriesResponse.status);
    }
  } catch (error) {
    console.error("API test failed:", error);
  }
};

// Run test
testAPI();
