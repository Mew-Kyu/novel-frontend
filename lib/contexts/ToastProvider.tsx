"use client";

import { Toaster } from "react-hot-toast";

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "rgb(var(--card))",
          color: "rgb(var(--text))",
          border: "1px solid rgb(var(--border))",
        },
        success: {
          iconTheme: {
            primary: "#22c55e",
            secondary: "white",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "white",
          },
        },
      }}
    />
  );
};
