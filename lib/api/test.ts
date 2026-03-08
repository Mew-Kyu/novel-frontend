// lib/api/test.ts
export const testBackendConnection = async () => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
    const response = await fetch(`${baseUrl}/api/health`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    const data = await response.json();
    console.log("Backend connected:", data);
    return true;
  } catch (error) {
    console.error("Backend connection failed:", error);
    return false;
  }
};
