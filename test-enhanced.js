import fetch from "node-fetch";
import {
  getProductsEnhanced,
  saveProductEnhanced,
  deleteProductEnhanced,
} from "./src/lib/storage.js";

async function testEnhancedFunctions() {
  console.log("🧪 Testing Enhanced Storage Functions...\n");

  try {
    // Test 1: Get products
    console.log("1. Loading products with enhanced function...");
    const products = await getProductsEnhanced();
    console.log(`✅ Found ${products.length} products`);

    if (products.length > 0) {
      const testProduct = products[0];
      console.log(`Test product: ${testProduct.name} (ID: ${testProduct.id})`);

      // Test 2: Update product
      console.log("\n2. Testing product update with enhanced function...");
      const updatedProduct = {
        ...testProduct,
        name: testProduct.name + " (Enhanced Test)",
        price: testProduct.price + 5,
      };

      const savedProduct = await saveProductEnhanced(updatedProduct);
      console.log(
        `✅ Product updated: ${savedProduct.name} - ₹${savedProduct.price}`
      );

      // Test 3: Create and delete product
      console.log(
        "\n3. Testing product creation and deletion with enhanced functions..."
      );
      const testDeleteProduct = {
        name: "Enhanced Test Product",
        description: "Created via enhanced function",
        price: 149.99,
        category: "shoes",
        image: "https://via.placeholder.com/400",
        inStock: true,
      };

      const createdProduct = await saveProductEnhanced(testDeleteProduct);
      console.log(
        `✅ Created test product: ${createdProduct.name} (ID: ${createdProduct.id})`
      );

      // Now delete it
      const deleteResult = await deleteProductEnhanced(createdProduct.id);
      console.log(`✅ Product deleted successfully`);

      // Verify deletion
      const productsAfterDelete = await getProductsEnhanced();
      const deletedProduct = productsAfterDelete.find(
        (p) => p.id === createdProduct.id
      );
      if (!deletedProduct) {
        console.log("✅ Product successfully removed from list");
      } else {
        console.log("❌ Product still exists after deletion");
      }
    } else {
      console.log("No products found to test with");
    }
  } catch (error) {
    console.error("❌ Enhanced function test failed:", error);
    console.log("🔄 This might indicate fallback to localStorage");
  }
}

// Run the test
testEnhancedFunctions();
