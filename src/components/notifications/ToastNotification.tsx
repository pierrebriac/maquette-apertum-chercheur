'use client';

import React, { useState, useEffect } from 'react';
import { notificationManager, Notification, NotificationHelpers } from '@/lib/notifications';
import { 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  TrendingUp,
  X,
  Bell
} from 'lucide-react';

interface ToastNotificationProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
  className?: string;
}

export default function ToastNotification({ 
  position = 'top-right',
  maxToasts = 5,
  className = ''
}: ToastNotificationProps) {
  const [toasts, setToasts] = useState<Notification[]>([]);

  useEffect(() => {
    // S'abonner aux nouvelles notifications
    const unsubscribe = notificationManager.subscribe((notifications) => {
      // Filtrer les nouvelles notifications (non lues, récentes)
      const recentNotifications = notifications
        .filter(n => !n.read && n.autoHide)
        .slice(0, maxToasts);
      
      setToasts(recentNotifications);
    });

    return unsubscribe;
  }, [maxToasts]);

  // Obtenir l'icône selon le type
  const getToastIcon = (type: string) => {
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

  // Obtenir les styles selon le type
  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300';
      case 'validation':
        return 'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300';
      case 'progress':
        return 'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-300';
    }
  };

  // Obtenir les classes de position
  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  // Fermer un toast
  const closeToast = (id: string) => {
    notificationManager.markAsRead(id);
  };

  if (toasts.length === 0) return null;

  return (
    <div 
      className={`fixed ${getPositionClasses()} z-50 space-y-2 ${className}`}
      style={{ maxWidth: '400px' }}
    >
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className={`
            animate-in slide-in-from-right-full duration-300 ease-out
            flex items-start space-x-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm
            ${getToastStyles(toast.type)}
            transform transition-all duration-300
          `}
          style={{
            animationDelay: `${index * 100}ms`,
            transform: `translateY(${index * 10}px)`,
            zIndex: 1000 - index
          }}
        >
          {/* Icône */}
          <div className="flex-shrink-0 mt-0.5">
            {getToastIcon(toast.type)}
          </div>

          {/* Contenu */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium">
                  {toast.title}
                </h4>
                <p className="mt-1 text-sm opacity-90">
                  {toast.message}
                </p>
              </div>

              {/* Bouton de fermeture */}
              <button
                onClick={() => closeToast(toast.id)}
                className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Actions si présentes */}
            {toast.actions && toast.actions.length > 0 && (
              <div className="mt-3 flex items-center space-x-2">
                {toast.actions.slice(0, 2).map((action) => (
                  <button
                    key={action.id}
                    onClick={() => {
                      action.callback();
                      closeToast(toast.id);
                    }}
                    className={`
                      px-3 py-1 text-xs font-medium rounded transition-colors
                      ${action.type === 'primary' ? 
                        'bg-current text-white bg-opacity-80 hover:bg-opacity-100' :
                        'bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20'
                      }
                    `}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {/* Barre de progression pour l'auto-hide */}
            {toast.autoHide && toast.hideDelay && (
              <div className="mt-3 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-current opacity-50 rounded-full animate-progress"
                  style={{
                    animation: `progress ${toast.hideDelay}ms linear forwards`
                  }}
                />
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        .animate-progress {
          animation: progress var(--duration) linear forwards;
        }
        
        @keyframes slide-in-from-right-full {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-in {
          animation-fill-mode: both;
        }
        
        .slide-in-from-right-full {
          animation-name: slide-in-from-right-full;
        }
      `}</style>
    </div>
  );
}

// Hook pour utiliser facilement les toasts
export function useToast() {
  return {
    success: (title: string, message: string) => 
      NotificationHelpers.success(title, message),
    error: (title: string, message: string) => 
      NotificationHelpers.error(title, message),
    warning: (title: string, message: string) => 
      NotificationHelpers.warning(title, message),
    info: (title: string, message: string) => 
      NotificationHelpers.info(title, message),
    progress: (title: string, message: string, metadata?: Record<string, any>) => 
      NotificationHelpers.progress(title, message, metadata)
  };
} 