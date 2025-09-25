/**
 * Composant NotificationBell - Cloche de notifications avec compteur
 *
 * Affiche une cloche avec un badge indiquant le nombre de notifications non lues.
 * Permet d'ouvrir un panneau de notifications.
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Récupérer le nombre de notifications non lues
  const fetchUnreadCount = async () => {
    try {
      const response = await api.getUnreadNotificationCount();
      setUnreadCount(response.count);
    } catch {
      // Silently handle error
    }
  };

  // Récupérer les notifications
  const fetchNotifications = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await api.getNotifications();
      setNotifications(response);
    } catch {
      // Silently handle error
    } finally {
      setLoading(false);
    }
  };

  // Ouvrir/fermer le panneau
  const toggleNotifications = async () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      await fetchNotifications();
    }
  };

  // Marquer une notification comme lue
  const markAsRead = async (notificationId) => {
    try {
      await api.markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {
      // Silently handle error
    }
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch {
      // Silently handle error
    }
  };

  // Formater la date relative
  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'À l\'instant';
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
    return `Il y a ${Math.floor(diffInSeconds / 86400)} j`;
  };

  // Récupérer les notifications et le compteur au montage et périodiquement
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      fetchNotifications(); // Récupérer aussi les notifications au démarrage

      // Rafraîchir plus fréquemment pour les notifications
      const interval = setInterval(() => {
        fetchUnreadCount();
        if (!isOpen) { // Ne pas rafraîchir si le panneau est ouvert pour éviter les conflits
          fetchNotifications();
        }
      }, 10000); // Toutes les 10 secondes

      return () => clearInterval(interval);
    }
  }, [user, isOpen, fetchNotifications]);

  if (!user) return null;

  return (
    <div className="relative">
      {/* Bouton cloche */}
      <button
        onClick={toggleNotifications}
        className={`relative p-2 rounded-full hover:bg-gray-100 transition-all duration-200 ${
          unreadCount > 0
            ? 'text-blue-600 animate-pulse'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <svg className={`w-6 h-6 ${unreadCount > 0 ? 'animate-bounce' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM15 7v5H9v-5h6z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 6a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>

        {/* Badge compteur avec animation */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] animate-ping">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {/* Badge fixe pour superposition */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panneau de notifications */}
      {isOpen && (
        <>
          {/* Overlay pour fermer */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Panneau */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Tout marquer comme lu
                </button>
              )}
            </div>

            {/* Liste des notifications */}
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm">Chargement...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM15 7v5H9v-5h6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 6a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-sm">Aucune notification</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors duration-150 ${
                        !notification.read ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-gray-800 leading-relaxed">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {formatRelativeTime(notification.createdAt)}
                            </span>
                            <div className="flex items-center space-x-2">
                              {!notification.read && (
                                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                              )}
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  Marquer comme lu
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;