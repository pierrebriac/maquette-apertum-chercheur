// Système de notifications pour Apertum
import { advancedStorage } from './storage-advanced';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'validation' | 'progress';
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  timestamp: Date;
  read: boolean;
  persistent: boolean;
  actions?: NotificationAction[];
  metadata?: Record<string, any>;
  autoHide?: boolean;
  hideDelay?: number; // en millisecondes
  icon?: string;
  category?: string;
}

export interface NotificationAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'danger';
  callback: () => void;
}

export interface NotificationSettings {
  enableSound: boolean;
  enableDesktop: boolean;
  enableEmail: boolean;
  categories: {
    [key: string]: {
      enabled: boolean;
      priority: NotificationPriority;
      autoHide: boolean;
    };
  };
}

// Gestionnaire principal des notifications
export class NotificationManager {
  private static instance: NotificationManager;
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];
  private settings: NotificationSettings;
  private soundEnabled = true;
  private readonly STORAGE_KEY = 'apertum_notifications';
  private readonly SETTINGS_KEY = 'apertum_notification_settings';

  constructor() {
    this.loadNotifications();
    this.loadSettings();
    this.requestPermissions();
  }

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  // Charger les notifications depuis le stockage
  private loadNotifications(): void {
    try {
      const stored = advancedStorage.get<Notification[]>(this.STORAGE_KEY);
      if (stored) {
        this.notifications = stored.map(n => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    }
  }

  // Charger les paramètres
  private loadSettings(): void {
    const defaultSettings: NotificationSettings = {
      enableSound: true,
      enableDesktop: false,
      enableEmail: false,
      categories: {
        validation: { enabled: true, priority: 'high', autoHide: false },
        progress: { enabled: true, priority: 'normal', autoHide: true },
        system: { enabled: true, priority: 'normal', autoHide: true },
        user: { enabled: true, priority: 'normal', autoHide: true }
      }
    };

    try {
      const stored = advancedStorage.get<NotificationSettings>(this.SETTINGS_KEY);
      this.settings = stored || defaultSettings;
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
      this.settings = defaultSettings;
    }
  }

  // Sauvegarder les notifications
  private saveNotifications(): void {
    try {
      advancedStorage.set(this.STORAGE_KEY, this.notifications);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des notifications:', error);
    }
  }

  // Demander les permissions pour les notifications desktop
  private async requestPermissions(): Promise<void> {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        await Notification.requestPermission();
      } catch (error) {
        console.log('Permissions de notification non accordées');
      }
    }
  }

  // Ajouter une notification
  add(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): string {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newNotification: Notification = {
      id,
      timestamp: new Date(),
      read: false,
      autoHide: true,
      hideDelay: 5000,
      category: 'system',
      ...notification
    };

    // Vérifier si la catégorie est activée
    const categorySettings = this.settings.categories[newNotification.category || 'system'];
    if (!categorySettings?.enabled) {
      return id; // Ne pas afficher si la catégorie est désactivée
    }

    this.notifications.unshift(newNotification);
    this.saveNotifications();
    this.notifyListeners();

    // Jouer un son si activé
    if (this.settings.enableSound && this.soundEnabled) {
      this.playNotificationSound(newNotification.type);
    }

    // Afficher une notification desktop si activée
    if (this.settings.enableDesktop && Notification.permission === 'granted') {
      this.showDesktopNotification(newNotification);
    }

    // Auto-hide si configuré
    if (newNotification.autoHide && newNotification.hideDelay) {
      setTimeout(() => {
        this.markAsRead(id);
      }, newNotification.hideDelay);
    }

    return id;
  }

  // Marquer comme lu
  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  // Supprimer une notification
  remove(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveNotifications();
    this.notifyListeners();
  }

  // Vider toutes les notifications
  clear(): void {
    this.notifications = [];
    this.saveNotifications();
    this.notifyListeners();
  }

  // Marquer toutes comme lues
  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
    this.notifyListeners();
  }

  // Obtenir toutes les notifications
  getAll(): Notification[] {
    return [...this.notifications];
  }

  // Obtenir les notifications non lues
  getUnread(): Notification[] {
    return this.notifications.filter(n => !n.read);
  }

  // Compter les non lues
  getUnreadCount(): number {
    return this.getUnread().length;
  }

  // Écouter les changements
  subscribe(callback: (notifications: Notification[]) => void): () => void {
    this.listeners.push(callback);
    // Retourner une fonction de désabonnement
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notifier tous les écouteurs
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener([...this.notifications]);
      } catch (error) {
        console.error('Erreur lors de la notification des écouteurs:', error);
      }
    });
  }

  // Jouer un son de notification
  private playNotificationSound(type: NotificationType): void {
    if (!this.soundEnabled) return;

    try {
      const audio = new Audio();
      // Différents sons selon le type
      switch (type) {
        case 'success':
 