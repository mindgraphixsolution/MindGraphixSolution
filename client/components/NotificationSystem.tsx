import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  notifications,
  onRemove,
}) => {
  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.duration) {
        const timer = setTimeout(() => {
          onRemove(notification.id);
        }, notification.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, onRemove]);

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return CheckCircle;
      case "error":
        return XCircle;
      case "warning":
        return AlertTriangle;
      case "info":
        return Info;
      default:
        return Info;
    }
  };

  const getColorClasses = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => {
        const Icon = getIcon(notification.type);
        const colorClasses = getColorClasses(notification.type);

        return (
          <div
            key={notification.id}
            className={`border rounded-lg p-4 shadow-lg transform transition-all duration-300 ease-in-out ${colorClasses}`}
          >
            <div className="flex items-start space-x-3">
              <Icon size={20} className="flex-shrink-0 mt-0.5" />

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm">{notification.title}</h4>
                <p className="text-sm opacity-90 mt-1">
                  {notification.message}
                </p>

                {notification.actions && notification.actions.length > 0 && (
                  <div className="mt-3 flex space-x-2">
                    {notification.actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.action}
                        className="text-xs font-medium underline hover:no-underline"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => onRemove(notification.id)}
                className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Hook pour gérer les notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 5000, // 5 secondes par défaut
    };

    setNotifications((prev) => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Méthodes de convenance
  const success = (
    title: string,
    message: string,
    options?: Partial<Notification>,
  ) => {
    return addNotification({
      type: "success",
      title,
      message,
      ...options,
    });
  };

  const error = (
    title: string,
    message: string,
    options?: Partial<Notification>,
  ) => {
    return addNotification({
      type: "error",
      title,
      message,
      duration: 8000, // Plus long pour les erreurs
      ...options,
    });
  };

  const warning = (
    title: string,
    message: string,
    options?: Partial<Notification>,
  ) => {
    return addNotification({
      type: "warning",
      title,
      message,
      ...options,
    });
  };

  const info = (
    title: string,
    message: string,
    options?: Partial<Notification>,
  ) => {
    return addNotification({
      type: "info",
      title,
      message,
      ...options,
    });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
  };
};
