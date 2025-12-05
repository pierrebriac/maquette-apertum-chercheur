'use client';

import React, { useState, useEffect } from 'react';
import { 
  notificationManager, 
  Notification, 
  NotificationSettings,
  NotificationHelpers 
} from '@/lib/notifications';
import { 
  Bell, 
  Check, 
  X, 
  Settings, 
  Volume2, 
  VolumeX,
  Monitor,
  Mail,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  TrendingUp,
  Clock,
  Filter,
  MoreVertical,
  Trash2,
  MarkEmailRead,
  RefreshCw
} from 'lucide-react';

interface NotificationCenterProps {
  className?: string;
  showSettings?: boolean;
}

export default function NotificationCenter({ 
  className = '', 
  showSettings = false 
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [showSettingsPanel, setShowSettingsPanel] = useState(showSettings);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    // S'abonner aux changements de notifications
    const unsubscribe = notificationManager.subscribe(setNotifications);
    
    // Charger les notifications initiales
    setNotifications(notificationManager.getAll());
    setSettings(notificationManager.getSettings());

    return unsubscribe;
  }, []);

  // Obtenir l'icône selon le type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'validation':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'progress':
        return <TrendingUp className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  // Obtenir la couleur de bordure selon le type
  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500';
      case 'error':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'info':
        return 'border-l-blue-500';
      case 'validation':
        return 'border-l-orange-500';
      case 'progress':
        return 'border-l-purple-500';
      default:
        return 'border-l-gray-500';
    }
  };

  // Filtrer les notifications
  const filteredNotifications = notifications.filter(notification => {
    // Filtre par statut
    if (filter === 'unread' && notification.read) return false;
    if (filter === 'read' && !notification.read) return false;
    
    // Filtre par catégorie
    if (selectedCategory !== 'all' && notification.category !== selectedCategory) return false;
    
    return true;
  });

  // Obtenir les catégories uniques
  const categories = Array.from(new Set(notifications.map(n => n.category || 'system')));

  // Marquer comme lu
  const markAsRead = (id: string) => {
    notificationManager.markAsRead(id);
  };

  // Supprimer une notification
  const removeNotification = (id: string) => {
    notificationManager.remove(id);
  };

  // Marquer toutes comme lues
  const markAllAsRead = () => {
    notificationManager.markAllAsRead();
  };

  // Vider toutes les notifications
  const clearAll = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer toutes les notifications ?')) {
      notificationManager.clear();
    }
  };

  // Mettre à jour les paramètres
  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings } as NotificationSettings;
    setSettings(updatedSettings);
    notificationManager.updateSettings(newSettings);
  };

  // Tester les notifications
  const testNotifications = () => {
    NotificationHelpers.success('Test réussi', 'Notification de test fonctionnelle');
    NotificationHelpers.error('Test d\'erreur', 'Ceci est une notification d\'erreur test');
    NotificationHelpers.warning('Test d\'avertissement', 'Ceci est un avertissement de test');
    NotificationHelpers.info('Test d\'information', 'Ceci est une information de test');
  };

  // Formater la date
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}j`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* En-tête */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notifications
            </h3>
            {notificationManager.getUnreadCount() > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {notificationManager.getUnreadCount()}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettingsPanel(!showSettingsPanel)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={testNotifications}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Tester les notifications"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes</option>
              <option value="unread">Non lues</option>
              <option value="read">Lues</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            {notificationManager.getUnreadCount() > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm flex items-center space-x-1"
              >
                <MarkEmailRead className="w-3 h-3" />
                <span>Tout marquer lu</span>
              </button>
            )}
            
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm flex items-center space-x-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Tout supprimer</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Paramètres */}
      {showSettingsPanel && settings && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Paramètres des Notifications
          </h4>
          
          <div className="space-y-3">
            {/* Son */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Sons</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableSound}
                  onChange={(e) => updateSettings({ enableSound: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Desktop */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Monitor className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Bureau</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableDesktop}
                  onChange={(e) => updateSettings({ enableDesktop: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Email</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableEmail}
                  onChange={(e) => updateSettings({ enableEmail: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Liste des notifications */}
      <div className="max-h-96 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucune notification</p>
            <p className="text-sm">
              {filter === 'unread' ? 'Toutes les notifications sont lues' : 
               filter === 'read' ? 'Aucune notification lue' : 
               'Vous n\'avez aucune notification'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-l-4 ${getBorderColor(notification.type)} ${
                  !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${
                        notification.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                      }`}>
                        {notification.title}
                      </p>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(notification.timestamp)}
                        </span>
                        
                        <div className="flex items-center space-x-1">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                              title="Marquer comme lu"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => removeNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Supprimer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <p className={`mt-1 text-sm ${
                      notification.read ? 'text-gray-500 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {notification.message}
                    </p>
                    
                    {/* Actions */}
                    {notification.actions && notification.actions.length > 0 && (
                      <div className="mt-3 flex items-center space-x-2">
                        {notification.actions.map((action) => (
                          <button
                            key={action.id}
                            onClick={() => {
                              action.callback();
                              markAsRead(notification.id);
                            }}
                            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                              action.type === 'primary' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30' :
                              action.type === 'danger' ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30' :
                              'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                            }`}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Métadonnées */}
                    {notification.metadata && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded-full">
                          {notification.category}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pied de page */}
      {notifications.length > 0 && (
        <div className="p-3 bg-gray-50 dark:bg-gray-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {notifications.length} notification{notifications.length > 1 ? 's' : ''} au total
            {notificationManager.getUnreadCount() > 0 && (
              <span className="ml-2">
                • {notificationManager.getUnreadCount()} non lue{notificationManager.getUnreadCount() > 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
} 