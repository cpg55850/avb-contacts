const API_BASE_URL = "/api";

async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    console.log("Health check:", data);
    return data.status === "ok";
  } catch (error) {
    console.error("Health check failed:", error);
    return false;
  }
}

// Check health on page load
document.addEventListener("DOMContentLoaded", async () => {
  const isHealthy = await checkHealth();
  if (isHealthy) {
    console.log("Backend is running!");
  } else {
    console.log("Backend is not responding");
  }
});
