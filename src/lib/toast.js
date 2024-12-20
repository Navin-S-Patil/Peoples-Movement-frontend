import { toast } from "sonner";
import { Check, X, AlertTriangle, Info, Loader2 } from "lucide-react";

const toastStyles = {
  className: "rounded-lg",
  duration: 3000,
};

export const showToast = {
  success: (message) => {
    toast(message, {
      ...toastStyles,
      style: {
        background: "#22c55e",
        color: "#ffffff",
        border: "1px solid #16a34a",
      },
    });
  },
  error: (message) => {
    toast(message, {
      ...toastStyles,
      style: {
        background: "#ef4444",
        color: "#ffffff",
        border: "1px solid #dc2626",
      },
    });
  },
  warning: (message) => {
    toast(message, {
      ...toastStyles,
      style: {
        background: "#f59e0b",
        color: "#ffffff",
        border: "1px solid #d97706",
      },
    });
  },
  info: (message) => {
    toast(message, {
      ...toastStyles,
      style: {
        background: "#3b82f6",
        color: "#ffffff",
        border: "1px solid #2563eb",
      },
    });
  },

  promise: (promiseFunc, messages) => {
    return toast.promise(promiseFunc, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  },

  // promise: (promiseFunc, messages) => {
  //   return toast.promise(promiseFunc, {
  //     loading: messages.loading,
  //     success: {
  //       data: messages.success,
  //       style: {
  //         background: "#22c55e",
  //         color: "#ffffff",
  //         border: "1px solid #16a34a",
  //       },
  //       icon: <Check className="w-4 h-4" />,
  //     },
  //     error: {
  //       data: messages.error,
  //       style: {
  //         background: "#ef4444",
  //         color: "#ffffff",
  //         border: "1px solid #dc2626",
  //       },
  //       icon: <X className="w-4 h-4" />,
  //     },
  //     className: "rounded-lg",
  //   });
  // },
};
