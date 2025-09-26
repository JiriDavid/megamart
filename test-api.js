import fetch from "node-fetch";

const API_BASE_URL = "http://localhost:5000/api";

async function testAPI() {
  try {
    console.log("Testing API endpoints...\n");

    // Test health check
    console.log("1. Testing health endpoint...");
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log("Health check:", healthData);

    // Test products endpoint
    console.log("\n2. Testing products endpoint...");
    const productsResponse = await fetch(`${API_BASE_URL}/products`);
    const productsData = await productsResponse.json();
    console.log(`Found ${productsData.products?.length || 0} products`);

    // Test users endpoint
    console.log("\n3. Testing users endpoint...");
    const usersResponse = await fetch(`${API_BASE_URL}/users`);
    const usersData = await usersResponse.json();
    console.log(`Found ${usersData.users?.length || 0} users`);

    console.log("\n✅ API test completed successfully!");
  } catch (error) {
    console.error("❌ API test failed:", error.message);
    console.log("\nTroubleshooting:");
    console.log("1. Make sure MongoDB is running");
    console.log("2. Make sure the server is started with: npm run server");
    console.log("3. Check your .env file for correct MongoDB URI");
  }
}

testAPI();
