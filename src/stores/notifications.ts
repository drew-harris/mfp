import create from "zustand";

type NotificationType = "default" | "success" | "error";

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  isShown: boolean;
  hideDelay: number;
}

type InputNotification = Omit<Notification, "id" | "isShown">;

interface NotificationsState {
  notifications: Notification[];
  sendFullNotification: (notification: InputNotification) => void;
  sendNotification: (message: string, type?: NotificationType) => void;
  sendError: (message: string) => void;

  dismiss: (id: string) => void;
}

export const useNotifications = create<NotificationsState>((set, get) => ({
  notifications: [],
  sendFullNotification(notification) {
    const id = Math.random().toString(36).slice(2, 11);
    const newNotification: Notification = {
      ...notification,
      id,
      isShown: false,
    };
    setTimeout(() => {
      set({
        notifications: get().notifications.map((n) =>
          n.id === id ? { ...n, isShown: true } : n
        ),
      });
    }, 10);
    set({ notifications: [...get().notifications, newNotification] });
    setTimeout(() => {
      set({
        notifications: get().notifications.map((n) =>
          n.id === id ? { ...n, isShown: false } : n
        ),
      });
    }, notification.hideDelay);
  },

  sendNotification(message, type: NotificationType = "default") {
    get().sendFullNotification({
      message,
      type,
      hideDelay: 2000,
    });
  },

  sendError(message) {
    get().sendNotification(message, "error");
  },

  dismiss(id) {
    set({
      notifications: get().notifications.map((n) =>
        n.id === id ? { ...n, isShown: false } : n
      ),
    });
  },
}));
