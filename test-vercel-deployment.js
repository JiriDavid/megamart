// Quick diagnostic script to test your deployed Vercel app
// Run this locally to identify the specific error

const testVercelDeployment = async () => {
  const baseUrl = "https://your-app.vercel.app"; // Replace with your actual Vercel URL

  console.log("🔍 Testing Vercel Deployment...\n");

  const tests = [
    { name: "Frontend Home", url: "/" },
    { name: "API Health Check", url: "/api/health" },
    { name: "API Products", url: "/api/products" },
    { name: "Frontend Products Page", url: "/products" },
    { name: "Frontend Admin Page", url: "/admin" },
    { name: "404 Test", url: "/invalid-route-test" },
  ];

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      console.log(`URL: ${baseUrl}${test.url}`);

      const response = await fetch(`${baseUrl}${test.url}`);

      console.log(`Status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        console.log(`❌ Error: ${response.status}`);

        // Try to get error details
        const text = await response.text();
        if (text.includes("FUNCTION_INVOCATION_FAILED")) {
          console.log("🔥 FUNCTION_INVOCATION_FAILED detected");
        } else if (text.includes("NOT_FOUND")) {
          console.log("🔥 NOT_FOUND detected");
        } else if (text.includes("FUNCTION_INVOCATION_TIMEOUT")) {
          console.log("🔥 FUNCTION_INVOCATION_TIMEOUT detected");
        }

        console.log("Error details:", text.substring(0, 200));
      } else {
        console.log("✅ Success");

        // Show content type and size
        console.log(`Content-Type: ${response.headers.get("content-type")}`);
        console.log(
          `Content-Length: ${
            response.headers.get("content-length") || "unknown"
          }`
        );
      }
    } catch (error) {
      console.log(`❌ Network Error: ${error.message}`);
    }

    console.log("-".repeat(50));
  }

  console.log("\n🎯 Diagnostic Complete!");
  console.log(
    "If you see specific errors above, please share them for targeted fixes."
  );
};

// Run the test
testVercelDeployment().catch(console.error);
