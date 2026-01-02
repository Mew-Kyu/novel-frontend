"use client";

import { useState } from "react";

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export function useConfirm() {
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    variant: "danger" | "warning" | "info";
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "Xác nhận",
    message: "",
    confirmText: "OK",
    cancelText: "Hủy",
    variant: "warning",
    onConfirm: () => {},
  });

  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        title: options.title || "Xác nhận",
        message: options.message,
        confirmText: options.confirmText || "OK",
        cancelText: options.cancelText || "Hủy",
        variant: options.variant || "warning",
        onConfirm: () => {
          resolve(true);
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
        },
      });
    });
  };

  const handleCancel = () => {
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    confirm,
    confirmState,
    handleCancel,
  };
}
