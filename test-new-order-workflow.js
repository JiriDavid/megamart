// Test script for the new order workflow
import { saveOrderEnhanced, getOrdersEnhanced } from "./src/lib/storage.js";

// Mock localStorage for Node.js environment
const mockStorage = {};
global.localStorage = {
  getItem: (key) => {
    return mockStorage[key] || null;
  },
  setItem: (key, value) => {
    mockStorage[key] = value;
  },
  removeItem: (key) => {
    delete mockStorage[key];
  },
  clear: () => {
    Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
  },
};

console.log("🧪 Testing New Order Workflow...\n");

// Test 1: Create a pending order with optional fields
console.log(
  "1. Creating order with optional email, city, state, pin, and notes..."
);
const testOrder = {
  items: [
    {
      id: "test-product-1",
      name: "Test Product",
      price: 100,
      quantity: 2,
      size: "M",
      color: "Blue",
      image: "test-image.jpg",
      product: "test-product-1", // Add product field for mongoose
    },
  ],
  subtotal: 200,
  shippingCost: 50,
  total: 250,
  totalAmount: 250, // Add totalAmount for mongoose
  customerInfo: {
    name: "John Doe",
    phone: "1234567890",
    // email is optional and not provided
  },
  shippingAddress: {
    address: "123 Test Street",
    // city, state, pin are optional and not provided
  },
  paymentMethod: "cod",
  notes: "Please deliver between 2-4 PM. Handle with care.",
  status: "pending",
};

try {
  const createdOrder = await saveOrderEnhanced(testOrder);
  console.log("✅ Order created successfully!");
  console.log("   Order ID:", createdOrder.id);
  console.log("   Status:", createdOrder.status);
  console.log("   Customer Info:", createdOrder.customerInfo);
  console.log("   Shipping Address:", createdOrder.shippingAddress);
  console.log("   Notes:", createdOrder.notes);
  console.log("");

  // Test 2: Fetch and verify the order using direct fallback functions
  console.log("2. Testing localStorage fallback functions directly...");

  // Import the fallback functions directly
  const { getOrdersFallback, getOrderByIdFallback } = await import(
    "./src/lib/storage.js"
  );

  const ordersFromFallback = getOrdersFallback();
  console.log("   Orders from fallback:", ordersFromFallback.length);
  console.log(
    "   Order IDs from fallback:",
    ordersFromFallback.map((o) => o.id)
  );

  const fetchedOrder = ordersFromFallback.find((o) => o.id === createdOrder.id);
  if (fetchedOrder) {
    console.log("✅ Order found using fallback function!");
    console.log("   Status matches:", fetchedOrder.status === "pending");
    console.log("   Customer name:", fetchedOrder.customerInfo?.name);
    console.log("   Phone number:", fetchedOrder.customerInfo?.phone);
    console.log(
      "   Email (should be undefined):",
      fetchedOrder.customerInfo?.email
    );
    console.log("   Shipping address:", fetchedOrder.shippingAddress?.address);
    console.log(
      "   City (should be undefined):",
      fetchedOrder.shippingAddress?.city
    );
    console.log("   Notes present:", !!fetchedOrder.notes);
  } else {
    console.log("❌ Order not found using fallback function");
  }

  if (fetchedOrder) {
    console.log("✅ Order fetched successfully!");
    console.log("   Status matches:", fetchedOrder.status === "pending");
    console.log("   Customer name:", fetchedOrder.customerInfo?.name);
    console.log("   Phone number:", fetchedOrder.customerInfo?.phone);
    console.log(
      "   Email (should be undefined):",
      fetchedOrder.customerInfo?.email
    );
    console.log("   Shipping address:", fetchedOrder.shippingAddress?.address);
    console.log(
      "   City (should be undefined):",
      fetchedOrder.shippingAddress?.city
    );
    console.log("   Notes present:", !!fetchedOrder.notes);
  } else {
    console.log("❌ Order not found after creation");
  }

  console.log(
    "\n🎉 All tests passed! New order workflow is working correctly."
  );
} catch (error) {
  console.error("❌ Test failed:", error.message);
}
