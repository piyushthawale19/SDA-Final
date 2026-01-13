// Test Gemini API Endpoint
// Run this in browser console to test different endpoints

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const endpoints = [
  // Option 1: v1 with gemini-1.5-flash
  "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",

  // Option 2: v1beta with gemini-1.5-flash
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",

  // Option 3: v1 with gemini-pro
  "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",

  // Option 4: v1beta with gemini-pro
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",

  // Option 5: v1 with gemini-1.5-flash-latest
  "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent",
];

async function testEndpoint(url) {
  try {
    const response = await fetch(`${url}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "Say hello",
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    console.log(`✅ SUCCESS: ${url}`);
    console.log("Response:", data);
    return true;
  } catch (error) {
    console.log(`❌ FAILED: ${url}`);
    console.log("Error:", error.message);
    return false;
  }
}

// Test all endpoints
async function testAll() {
  console.log("🧪 Testing Gemini API Endpoints...\n");

  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
    console.log("---\n");
  }
}

// Uncomment to run:
// testAll();

console.log("Copy and paste this into your browser console:");
console.log("testAll()");
