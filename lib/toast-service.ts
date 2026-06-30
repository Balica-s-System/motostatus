import { type ToastOptions, toast } from "react-toastify";

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};

export const notify = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, { ...defaultOptions, ...options });
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, { ...defaultOptions, ...options });
  },

  info: (message: string, options?: ToastOptions) => {
    toast.info(message, { ...defaultOptions, ...options });
  },

  warn: (message: string, options?: ToastOptions) => {
    toast.warn(message, { ...defaultOptions, ...options });
  },

  promise: async <T>(
    asyncFn: () => Promise<T>,
    messages: { pending: string; success: string; error: string },
    options?: ToastOptions,
  ) => {
    return toast.promise(asyncFn(), messages, {
      ...defaultOptions,
      ...options,
    });
  },
};
