import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem('notifications');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  const addNotification = (message, targetRole) => {
    const newNote = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      targetRole,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNote, ...prev]);
    return newNote;
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getNotificationsForRole = (role) =>
    notifications.filter((n) => n.targetRole === role);

  const getUnreadCountForRole = (role) =>
    notifications.filter((n) => n.targetRole === role && !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        getNotificationsForRole,
        getUnreadCountForRole,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
