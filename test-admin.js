import fetch from "node-fetch";

const API_BASE = "http://localhost:5000/api";

async function testAPI() {
  console.log("🧪 Testing Admin API Functions...\n");

  try {
    // Test 1: Get products
    console.log("1. Fetching products...");
    const productsResponse = await fetch(`${API_BASE}/products`);
    const productsData = await productsResponse.json();
    const products = productsData.products || [];
    console.log(`✅ Found ${products.length} products via API`);

    if (products.length > 0) {
      const testProduct = products[0];
      console.log(`Test product: ${testProduct.name} (ID: ${testProduct._id})`);

      // Test 2: Update product
      console.log("\n2. Testing product update via API...");
      const updatedProduct = {
        ...testProduct,
        name: testProduct.name + " (Updated)",
        price: testProduct.price + 10,
      };

      const updateResponse = await fetch(
        `${API_BASE}/products/${testProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (updateResponse.ok) {
        const savedProduct = await updateResponse.json();
        console.log(
          `✅ Product updated via API: ${savedProduct.name} - ₹${savedProduct.price}`
        );
      } else {
        console.log("❌ Failed to update product via API");
      }

      // Test 3: Create and delete product
      console.log("\n3. Testing product creation and deletion via API...");
      const testDeleteProduct = {
        name: "Test Product for Deletion",
        description: "This is a test product",
        price: 99.99,
        category: "shoes",
        image: "https://via.placeholder.com/400",
        inStock: true,
      };

      const createResponse = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testDeleteProduct),
      });

      if (createResponse.ok) {
        const createdProduct = await createResponse.json();
        console.log(
          `✅ Created test product via API: ${createdProduct.name} (ID: ${createdProduct._id})`
        );

        // Now delete it
        const deleteResponse = await fetch(
          `${API_BASE}/products/${createdProduct._id}`,
          {
            method: "DELETE",
          }
        );

        if (deleteResponse.ok) {
          console.log("✅ Product deleted successfully via API");
        } else {
          console.log("❌ Failed to delete product via API");
          const deleteError = await deleteResponse.text();
          console.log("Delete error:", deleteError);
        }
      } else {
        console.log("❌ Failed to create test product via API");
        const createError = await createResponse.text();
        console.log("Create error:", createError);
      }
    } else {
      console.log("No products found to test with");
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the test
testAPI();
