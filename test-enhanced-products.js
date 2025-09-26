import fetch from "node-fetch";

const API_BASE = "http://localhost:5000/api";

async function testEnhancedProductCreation() {
  console.log("🧪 Testing Enhanced Product Creation with Sizes & Colors...\n");

  try {
    // Test 1: Create a shoe product with sizes and colors
    console.log("1. Creating shoe product with sizes and colors...");
    const shoeProduct = {
      name: "Test Running Shoes",
      description: "High-performance running shoes for athletes",
      price: 129.99,
      category: "shoes",
      image: "https://via.placeholder.com/400",
      inStock: true,
      sizes: ["7", "8", "9", "10", "11"],
      colors: [
        { name: "Black", hex: "#000000" },
        { name: "White", hex: "#FFFFFF" },
        { name: "Blue", hex: "#0000FF" },
      ],
    };

    const shoeResponse = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shoeProduct),
    });

    if (shoeResponse.ok) {
      const createdShoe = await shoeResponse.json();
      console.log(`✅ Shoe product created: ${createdShoe.name}`);
      console.log(`   Sizes: ${createdShoe.sizes.join(", ")}`);
      console.log(
        `   Colors: ${createdShoe.colors.map((c) => c.name).join(", ")}`
      );

      // Test 2: Create an apparel product with sizes and colors
      console.log("\n2. Creating apparel product with sizes and colors...");
      const apparelProduct = {
        name: "Test Performance T-Shirt",
        description: "Moisture-wicking t-shirt for active lifestyles",
        price: 49.99,
        category: "apparel",
        image: "https://via.placeholder.com/400",
        inStock: true,
        sizes: ["S", "M", "L", "XL"],
        colors: [
          { name: "Red", hex: "#FF0000" },
          { name: "Green", hex: "#00FF00" },
        ],
      };

      const apparelResponse = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apparelProduct),
      });

      if (apparelResponse.ok) {
        const createdApparel = await apparelResponse.json();
        console.log(`✅ Apparel product created: ${createdApparel.name}`);
        console.log(`   Sizes: ${createdApparel.sizes.join(", ")}`);
        console.log(
          `   Colors: ${createdApparel.colors.map((c) => c.name).join(", ")}`
        );

        // Test 3: Create an accessory product (should not have sizes/colors enforced)
        console.log(
          "\n3. Creating accessory product (no sizes/colors required)..."
        );
        const accessoryProduct = {
          name: "Test Sunglasses",
          description: "Stylish sunglasses for sunny days",
          price: 79.99,
          category: "accessories",
          image: "https://via.placeholder.com/400",
          inStock: true,
        };

        const accessoryResponse = await fetch(`${API_BASE}/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(accessoryProduct),
        });

        if (accessoryResponse.ok) {
          const createdAccessory = await accessoryResponse.json();
          console.log(`✅ Accessory product created: ${createdAccessory.name}`);
          console.log(
            `   Sizes: ${createdAccessory.sizes?.length || 0} (should be 0)`
          );
          console.log(
            `   Colors: ${createdAccessory.colors?.length || 0} (should be 0)`
          );

          // Test 4: Fetch and verify products
          console.log("\n4. Fetching all products to verify data...");
          const productsResponse = await fetch(`${API_BASE}/products`);
          const productsData = await productsResponse.json();
          const products = productsData.products || [];

          const testProducts = products.filter((p) => p.name.includes("Test"));

          console.log(`✅ Found ${testProducts.length} test products`);
          testProducts.forEach((product) => {
            console.log(`   - ${product.name} (${product.category})`);
            if (product.sizes?.length > 0) {
              console.log(`     Sizes: ${product.sizes.join(", ")}`);
            }
            if (product.colors?.length > 0) {
              console.log(
                `     Colors: ${product.colors.map((c) => c.name).join(", ")}`
              );
            }
          });
        } else {
          console.log("❌ Failed to create accessory product");
        }
      } else {
        console.log("❌ Failed to create apparel product");
      }
    } else {
      console.log("❌ Failed to create shoe product");
      const error = await shoeResponse.text();
      console.log("Error:", error);
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the test
testEnhancedProductCreation();
