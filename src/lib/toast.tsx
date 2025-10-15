import { Action, ExternalToast, toast as sonnerToast } from "sonner";

export const toast = {
  info: (message: string, data?: ExternalToast) => {
    sonnerToast.info(message, {
      style: {
        "--normal-bg": "light-dark(var(--color-sky-600), var(--color-sky-400))",
        "--normal-text": "var(--color-white)",
        "--normal-border":
          "light-dark(var(--color-sky-600), var(--color-sky-400))",
      } as React.CSSProperties,
      ...data,
    });
  },
  success: (message: string, data?: ExternalToast) => {
    sonnerToast.success(message, {
      style: {
        "--normal-bg":
          "light-dark(var(--color-green-600), var(--color-green-400))",
        "--normal-text": "var(--color-white)",
        "--normal-border":
          "light-dark(var(--color-green-600), var(--color-green-400))",
      } as React.CSSProperties,
      ...data,
    });
  },
  warning: (message: string, data?: ExternalToast) => {
    sonnerToast.warning(message, {
      style: {
        "--normal-bg":
          "light-dark(var(--color-amber-600), var(--color-amber-400))",
        "--normal-text": "var(--color-white)",
        "--normal-border":
          "light-dark(var(--color-amber-600), var(--color-amber-400))",
      } as React.CSSProperties,
      ...data,
    });
  },
  error: (message: string, data?: ExternalToast) => {
    sonnerToast.error(message, {
      style: {
        "--normal-bg":
          "light-dark(var(--destructive), color-mix(in oklab, var(--destructive) 60%, var(--background)))",
        "--normal-text": "var(--color-white)",
        "--normal-border": "transparent",
      } as React.CSSProperties,
      ...data,
    });
  },
};
