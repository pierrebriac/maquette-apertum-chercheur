/**
 * Système de notifications email automatique pour Apertum
 * Gère l'envoi d'emails pour les alertes importantes et les rapports
 */

import { Notification, NotificationSettings } from '@/lib/notifications';

// Types pour les emails
export type EmailType = 
  | 'etude_complete' 
  | 'participant_termine' 
  | 'erreur_critique' 
  | 'rapport_quotidien'
  | 'rapport_hebdomadaire'
  | 'validation_requise'
  | 'backup_echoue'
  | 'maintenance_planifiee';

export interface EmailTemplate {
  id: string;
  type: EmailType;
  subject: string;
  htmlTemplate: string;
  textTemplate: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export interface EmailRecipient {
  email: string;
  name?: string;
  role?: 'chercheur' | 'admin' | 'participant';
  preferences: {
    [key in EmailType]?: boolean;
  };
}

export interface EmailQueue {
  id: string;
  recipient: EmailRecipient;
  template: EmailTemplate;
  data: Record<string, any>;
  scheduledFor: Date;
  attempts: number;
  maxAttempts: number;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  error?: string;
  sentAt?: Date;
}

export interface EmailSettings {
  enabled: boolean;
  smtpConfig: {
    host: string;
    port: number;
    secure: boolean;
    username: string;
    password: string;
  };
  defaultSender: {
    email: string;
    name: string;
  };
  rateLimiting: {
    maxPerHour: number;
    maxPerDay: number;
  };
  retrySettings: {
    maxAttempts: number;
    retryDelays: number[]; // en minutes
  };
}

class EmailNotificationManager {
  private settings: EmailSettings;
  private templates: Map<EmailType, EmailTemplate>;
  private recipients: EmailRecipient[];
  private queue: EmailQueue[];
  private isProcessing: boolean = false;

  constructor() {
    this.settings = this.loadSettings();
    this.templates = new Map();
    this.recipients = this.loadRecipients();
    this.queue = this.loadQueue();
    this.initializeTemplates();
    this.startQueueProcessor();
  }

  // Charger les paramètres
  private loadSettings(): EmailSettings {
    const saved = localStorage.getItem('email_settings');
    return saved ? JSON.parse(saved) : {
      enabled: false,
      smtpConfig: {
        host: '',
        port: 587,
        secure: false,
        username: '',
        password: ''
      },
      defaultSender: {
        email: 'noreply@apertum.com',
        name: 'Apertum Platform'
      },
      rateLimiting: {
        maxPerHour: 100,
        maxPerDay: 1000
      },
      retrySettings: {
        maxAttempts: 3,
        retryDelays: [5, 15, 60] // 5min, 15min, 1h
      }
    };
  }

  // Charger les destinataires
  private loadRecipients(): EmailRecipient[] {
    const saved = localStorage.getItem('email_recipients');
    return saved ? JSON.parse(saved) : [];
  }

  // Charger la queue
  private loadQueue(): EmailQueue[] {
    const saved = localStorage.getItem('email_queue');
    return saved ? JSON.parse(saved) : [];
  }

  // Sauvegarder les paramètres
  private saveSettings(): void {
    localStorage.setItem('email_settings', JSON.stringify(this.settings));
  }

  // Sauvegarder les destinataires
  private saveRecipients(): void {
    localStorage.setItem('email_recipients', JSON.stringify(this.recipients));
  }

  // Sauvegarder la queue
  private saveQueue(): void {
    localStorage.setItem('email_queue', JSON.stringify(this.queue));
  }

  // Initialiser les templates par défaut
  private initializeTemplates(): void {
    const templates: EmailTemplate[] = [
      {
        id: 'etude_complete',
        type: 'etude_complete',
        subject: 'Étude {{etude_nom}} terminée',
        htmlTemplate: `
          <h2>Étude terminée : {{etude_nom}}</h2>
          <p>L'étude <strong>{{etude_nom}}</strong> s'est terminée avec succès.</p>
          <p><strong>Statistiques :</strong></p>
          <ul>
            <li>Participants : {{nb_participants}}</li>
            <li>Taux de complétion : {{taux_completion}}%</li>
            <li>Durée moyenne : {{duree_moyenne}}</li>
          </ul>
          <p>Vous pouvez consulter les résultats détaillés dans votre tableau de bord.</p>
        `,
        textTemplate: `
          Étude terminée : {{etude_nom}}
          
          L'étude {{etude_nom}} s'est terminée avec succès.
          
          Statistiques :
          - Participants : {{nb_participants}}
          - Taux de complétion : {{taux_completion}}%
          - Durée moyenne : {{duree_moyenne}}
          
          Consultez les résultats dans votre tableau de bord.
        `,
        priority: 'high',
        category: 'research'
      },
      {
        id: 'erreur_critique',
        type: 'erreur_critique',
        subject: '🚨 Erreur critique détectée',
        htmlTemplate: `
          <h2>⚠️ Erreur critique détectée</h2>
          <p>Une erreur critique a été détectée dans le système :</p>
          <div style="background: #fee; padding: 10px; border-left: 4px solid #f00;">
            <strong>Erreur :</strong> {{erreur_message}}<br>
            <strong>Composant :</strong> {{composant}}<br>
            <strong>Heure :</strong> {{timestamp}}
          </div>
          <p>Veuillez vérifier le système immédiatement.</p>
        `,
        textTemplate: `
          🚨 ERREUR CRITIQUE DÉTECTÉE
          
          Erreur : {{erreur_message}}
          Composant : {{composant}}
          Heure : {{timestamp}}
          
          Vérifiez le système immédiatement.
        `,
        priority: 'high',
        category: 'system'
      },
      {
        id: 'rapport_quotidien',
        type: 'rapport_quotidien',
        subject: 'Rapport quotidien - {{date}}',
        htmlTemplate: `
          <h2>Rapport quotidien du {{date}}</h2>
          <h3>Activité des études</h3>
          <ul>
            <li>Nouvelles participations : {{nouvelles_participations}}</li>
            <li>Études terminées : {{etudes_terminees}}</li>
            <li>Erreurs détectées : {{erreurs}}</li>
          </ul>
          <h3>Performance système</h3>
          <ul>
            <li>Temps de réponse moyen : {{temps_reponse}}ms</li>
            <li>Disponibilité : {{disponibilite}}%</li>
            <li>Stockage utilisé : {{stockage_utilise}}%</li>
          </ul>
        `,
        textTemplate: `
          Rapport quotidien du {{date}}
          
          Activité des études :
          - Nouvelles participations : {{nouvelles_participations}}
          - Études terminées : {{etudes_terminees}}
          - Erreurs détectées : {{erreurs}}
          
          Performance système :
          - Temps de réponse moyen : {{temps_reponse}}ms
          - Disponibilité : {{disponibilite}}%
          - Stockage utilisé : {{stockage_utilise}}%
        `,
        priority: 'low',
        category: 'reports'
      }
    ];

    templates.forEach(template => {
      this.templates.set(template.type, template);
    });
  }

  // Ajouter un destinataire
  public addRecipient(recipient: EmailRecipient): void {
    const existingIndex = this.recipients.findIndex(r => r.email === recipient.email);
    if (existingIndex >= 0) {
      this.recipients[existingIndex] = recipient;
    } else {
      this.recipients.push(recipient);
    }
    this.saveRecipients();
  }

  // Programmer un email
  public scheduleEmail(
    type: EmailType,
    data: Record<string, any>,
    scheduledFor?: Date
  ): void {
    const template = this.templates.get(type);
    if (!template) {
      console.error(`Template non trouvé pour le type: ${type}`);
      return;
    }

    // Filtrer les destinataires qui veulent recevoir ce type d'email
    const interestedRecipients = this.recipients.filter(recipient => 
      recipient.preferences[type] !== false
    );

    interestedRecipients.forEach(recipient => {
      const emailItem: EmailQueue = {
        id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        recipient,
        template,
        data,
        scheduledFor: scheduledFor || new Date(),
        attempts: 0,
        maxAttempts: this.settings.retrySettings.maxAttempts,
        status: 'pending'
      };

      this.queue.push(emailItem);
    });

    this.saveQueue();
  }

  // Traiter la queue
  private async processQueue(): Promise<void> {
    if (this.isProcessing || !this.settings.enabled) return;

    this.isProcessing = true;
    const now = new Date();

    // Filtrer les emails à envoyer
    const emailsToSend = this.queue.filter(item => 
      item.status === 'pending' && 
      item.scheduledFor <= now &&
      item.attempts < item.maxAttempts
    );

    for (const emailItem of emailsToSend) {
      try {
        await this.sendEmail(emailItem);
        emailItem.status = 'sent';
        emailItem.sentAt = new Date();
      } catch (error) {
        emailItem.attempts++;
        emailItem.error = error instanceof Error ? error.message : 'Erreur inconnue';
        
        if (emailItem.attempts >= emailItem.maxAttempts) {
          emailItem.status = 'failed';
        } else {
          // Programmer une nouvelle tentative
          const delay = this.settings.retrySettings.retryDelays[emailItem.attempts - 1] || 60;
          emailItem.scheduledFor = new Date(Date.now() + delay * 60 * 1000);
        }
      }
    }

    this.saveQueue();
    this.isProcessing = false;
  }

  // Simuler l'envoi d'email (à remplacer par une vraie implémentation)
  private async sendEmail(emailItem: EmailQueue): Promise<void> {
    if (!this.settings.enabled) {
      throw new Error('Service email désactivé');
    }

    // Remplacer les variables dans le template
    const subject = this.replaceVariables(emailItem.template.subject, emailItem.data);
    const htmlContent = this.replaceVariables(emailItem.template.htmlTemplate, emailItem.data);
    const textContent = this.replaceVariables(emailItem.template.textTemplate, emailItem.data);

    // Simuler l'envoi (remplacer par nodemailer ou service email)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simuler un succès dans 90% des cas
        if (Math.random() > 0.1) {
          console.log(`Email envoyé à ${emailItem.recipient.email}: ${subject}`);
          resolve();
        } else {
          reject(new Error('Échec simulé de l\'envoi d\'email'));
        }
      }, 1000);
    });
  }

  // Remplacer les variables dans un template
  private replaceVariables(template: string, data: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? String(data[key]) : match;
    });
  }

  // Démarrer le processeur de queue
  private startQueueProcessor(): void {
    setInterval(() => {
      this.processQueue();
    }, 30000); // Vérifier toutes les 30 secondes
  }

  // Méthodes publiques pour configurer le système
  public updateSettings(newSettings: Partial<EmailSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }

  public getSettings(): EmailSettings {
    return { ...this.settings };
  }

  public getRecipients(): EmailRecipient[] {
    return [...this.recipients];
  }

  public getQueue(): EmailQueue[] {
    return [...this.queue];
  }

  public clearQueue(): void {
    this.queue = [];
    this.saveQueue();
  }

  // Méthodes utilitaires pour les alertes courantes
  public sendCriticalAlert(error: string, component: string): void {
    this.scheduleEmail('erreur_critique', {
      erreur_message: error,
      composant: component,
      timestamp: new Date().toLocaleString()
    });
  }

  public sendStudyCompletionReport(etude: any): void {
    this.scheduleEmail('etude_complete', {
      etude_nom: etude.nom,
      nb_participants: etude.participants?.length || 0,
      taux_completion: etude.tauxCompletion || 0,
      duree_moyenne: etude.dureeMoyenne || 'N/A'
    });
  }

  public sendDailyReport(stats: any): void {
    this.scheduleEmail('rapport_quotidien', {
      date: new Date().toLocaleDateString(),
      nouvelles_participations: stats.nouvelles_participations,
      etudes_terminees: stats.etudes_terminees,
      erreurs: stats.erreurs,
      temps_reponse: stats.temps_reponse,
      disponibilite: stats.disponibilite,
      stockage_utilise: stats.stockage_utilise
    });
  }
}

// Instance globale
export const emailNotificationManager = new EmailNotificationManager();

// Helper pour l'intégration avec le système de notifications
export function setupEmailIntegration() {
  // Cette fonction peut être appelée pour configurer l'intégration
  // avec le système de notifications principal
} 