import { toast } from "sonner";

const defaultDuration = 3000;

export const notify = {
  success: (message: string, duration?: number) => {
    toast.success(message, { duration: duration ?? defaultDuration });
  },

  error: (message: string, duration?: number) => {
    toast.error(message, { duration: duration ?? defaultDuration });
  },

  info: (message: string, duration?: number) => {
    toast.info(message, { duration: duration ?? defaultDuration });
  },

  warn: (message: string, duration?: number) => {
    toast.warning(message, { duration: duration ?? defaultDuration });
  },

  promise: async <T>(
    asyncFn: () => Promise<T>,
    messages: { pending: string; success: string; error: string },
    duration?: number,
  ) => {
    return toast.promise(asyncFn(), {
      loading: messages.pending,
      success: messages.success,
      error: messages.error,
      duration: duration ?? defaultDuration,
    });
  },
};
