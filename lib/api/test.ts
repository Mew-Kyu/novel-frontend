// lib/api/test.ts
export const testBackendConnection = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/health");
    const data = await response.json();
    console.log("Backend connected:", data);
    return true;
  } catch (error) {
    console.error("Backend connection failed:", error);
    return false;
  }
};
