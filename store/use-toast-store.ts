import { create } from "zustand";

export type ToastType = "success" | "error" | "info";

export interface ToastAction {
  label: string;
  onPress: () => void;
}

export interface ToastShowParams {
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number;
  action?: ToastAction;
}

interface ToastState {
  visible: boolean;
  title: string;
  message: string;
  type: ToastType;
  action: ToastAction | undefined;
  show: (params: ToastShowParams) => void;
  hide: () => void;
}

let timeoutId: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>((set) => ({
  visible: false,
  title: "",
  message: "",
  type: "info",
  action: undefined,
  show: ({ title, message = "", type = "info", duration = 4000, action }) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    set({ visible: true, title, message, type, action });
    timeoutId = setTimeout(() => {
      set({ visible: false, action: undefined });
      timeoutId = null;
    }, duration);
  },
  hide: () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    set({ visible: false, action: undefined });
  },
}));
