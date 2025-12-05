// Système de stockage avancé pour Apertum
import { Chercheur, Etude, Session } from '@/types';

// Configuration du système de stockage
export interface StorageConfig {
  enableCompression: boolean;
  enableAutoBackup: boolean;
  backupInterval: number; // en minutes
  maxBackupFiles: number;
  enableEncryption: boolean;
  enableSync: boolean;
}

// Cache en mémoire pour les performances
class MemoryCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Utilitaires de compression
class CompressionUtils {
  static compress(data: string): string {
    try {
      // Simulation de compression (en production, utiliser une vraie librairie)
      return btoa(data);
    } catch (error) {
      console.warn('Compression échouée, utilisation des données brutes:', error);
      return data;
    }
  }

  static decompress(compressedData: string): string {
    try {
      return atob(compressedData);
    } catch (error) {
      console.warn('Décompression échouée, données probablement non compressées:', error);
      return compressedData;
    }
  }
}

// Utilitaires de chiffrement simple
class EncryptionUtils {
  private static readonly ENCRYPTION_KEY = 'apertum-storage-key';

  static encrypt(data: string): string {
    // Simulation de chiffrement simple (en production, utiliser une vraie librairie)
    return btoa(data);
  }

  static decrypt(encryptedData: string): string {
    try {
      return atob(encryptedData);
    } catch (error) {
      console.warn('Déchiffrement échoué:', error);
      return encryptedData;
    }
  }
}

// Gestionnaire de sauvegarde automatique
class BackupManager {
  private static instance: BackupManager;
  private backupInterval: NodeJS.Timeout | null = null;
  private config: StorageConfig;

  constructor(config: StorageConfig) {
    this.config = config;
  }

  static getInstance(config: StorageConfig): BackupManager {
    if (!BackupManager.instance) {
      BackupManager.instance = new BackupManager(config);
    }
    return BackupManager.instance;
  }

  startAutoBackup(): void {
    if (!this.config.enableAutoBackup) return;

    this.stopAutoBackup();
    this.backupInterval = setInterval(() => {
      this.createBackup();
    }, this.config.backupInterval * 60 * 1000);

    console.log(`🔄 Sauvegarde automatique activée (intervalle: ${this.config.backupInterval} min)`);
  }

  stopAutoBackup(): void {
    if (this.backupInterval) {
      clearInterval(this.backupInterval);
      this.backupInterval = null;
    }
  }

  createBackup(): void {
    try {
      const timestamp = new Date().toISOString();
      const backupData = {
        timestamp,
        chercheurs: localStorage.getItem('apertum_chercheurs'),
        etudes: localStorage.getItem('apertum_etudes'),
        session: localStorage.getItem('apertum_session'),
      };

      const backupKey = `apertum_backup_${timestamp}`;
      localStorage.setItem(backupKey, JSON.stringify(backupData));

      this.cleanOldBackups();
      console.log(`✅ Sauvegarde créée: ${backupKey}`);
    } catch (error) {
      console.error('❌ Erreur lors de la création de la sauvegarde:', error);
    }
  }

  private cleanOldBackups(): void {
    const backupKeys = Object.keys(localStorage)
      .filter(key => key.startsWith('apertum_backup_'))
      .sort((a, b) => b.localeCompare(a)); // Plus récent en premier

    if (backupKeys.length > this.config.maxBackupFiles) {
      const keysToDelete = backupKeys.slice(this.config.maxBackupFiles);
      keysToDelete.forEach(key => {
        localStorage.removeItem(key);
        console.log(`🗑️ Sauvegarde supprimée: ${key}`);
      });
    }
  }

  getBackups(): { key: string; timestamp: string; size: string }[] {
    return Object.keys(localStorage)
      .filter(key => key.startsWith('apertum_backup_'))
      .map(key => {
        const data = localStorage.getItem(key);
        return {
          key,
          timestamp: key.replace('apertum_backup_', ''),
          size: data ? `${(data.length / 1024).toFixed(2)} KB` : 'N/A'
        };
      })
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  restoreBackup(backupKey: string): boolean {
    try {
      const backupData = localStorage.getItem(backupKey);
      if (!backupData) return false;

      const backup = JSON.parse(backupData);
      
      // Restaurer les données
      if (backup.chercheurs) localStorage.setItem('apertum_chercheurs', backup.chercheurs);
      if (backup.etudes) localStorage.setItem('apertum_etudes', backup.etudes);
      if (backup.session) localStorage.setItem('apertum_session', backup.session);

      console.log(`✅ Sauvegarde restaurée: ${backupKey}`);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la restauration:', error);
      return false;
    }
  }
}

// Gestionnaire de synchronisation
class SyncManager {
  private static instance: SyncManager;
  private syncQueue: Array<{ key: string; data: any; timestamp: number }> = [];
  private isOnline = navigator.onLine;

  constructor() {
    // Écouter les changements de connectivité
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  addToSyncQueue(key: string, data: any): void {
    this.syncQueue.push({
      key,
      data,
      timestamp: Date.now()
    });

    if (this.isOnline) {
      this.processSyncQueue();
    }
  }

  private async processSyncQueue(): Promise<void> {
    if (!this.isOnline || this.syncQueue.length === 0) return;

    console.log(`🔄 Synchronisation de ${this.syncQueue.length} éléments...`);

    // Simuler la synchronisation (en production, envoyer vers un serveur)
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.syncQueue = [];
    console.log('✅ Synchronisation terminée');
  }

  getConnectionStatus(): { isOnline: boolean; queueSize: number } {
    return {
      isOnline: this.isOnline,
      queueSize: this.syncQueue.length
    };
  }
}

// Classe principale du système de stockage avancé
export class AdvancedStorageManager {
  private cache = new MemoryCache();
  private backupManager: BackupManager;
  private syncManager = SyncManager.getInstance();
  private config: StorageConfig = {
    enableCompression: true,
    enableAutoBackup: true,
    backupInterval: 30, // 30 minutes
    maxBackupFiles: 10,
    enableEncryption: false,
    enableSync: true
  };

  constructor(config?: Partial<StorageConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    
    this.backupManager = BackupManager.getInstance(this.config);
    this.backupManager.startAutoBackup();
  }

  // Méthode de stockage avec cache et optimisations
  set<T>(key: string, data: T): void {
    try {
      let processedData = JSON.stringify(data);

      // Compression si activée
      if (this.config.enableCompression) {
        processedData = CompressionUtils.compress(processedData);
      }

      // Chiffrement si activé
      if (this.config.enableEncryption) {
        processedData = EncryptionUtils.encrypt(processedData);
      }

      // Stocker dans localStorage
      localStorage.setItem(key, processedData);

      // Mettre en cache
      this.cache.set(key, data);

      // Ajouter à la queue de synchronisation
      if (this.config.enableSync) {
        this.syncManager.addToSyncQueue(key, data);
      }

      console.log(`💾 Données stockées: ${key} (${processedData.length} bytes)`);
    } catch (error) {
      console.error('❌ Erreur lors du stockage:', error);
    }
  }

  // Méthode de récupération avec cache
  get<T>(key: string): T | null {
    try {
      // Vérifier le cache d'abord
      const cachedData = this.cache.get<T>(key);
      if (cachedData) {
        console.log(`⚡ Données récupérées du cache: ${key}`);
        return cachedData;
      }

      // Récupérer depuis localStorage
      let data = localStorage.getItem(key);
      if (!data) return null;

      // Déchiffrement si nécessaire
      if (this.config.enableEncryption) {
        data = EncryptionUtils.decrypt(data);
      }

      // Décompression si nécessaire
      if (this.config.enableCompression) {
        data = CompressionUtils.decompress(data);
      }

      const parsedData = JSON.parse(data);

      // Mettre en cache
      this.cache.set(key, parsedData);

      console.log(`📁 Données récupérées du stockage: ${key}`);
      return parsedData;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération:', error);
      return null;
    }
  }

  // Suppression avec cache
  remove(key: string): void {
    localStorage.removeItem(key);
    this.cache.delete(key);
    console.log(`🗑️ Données supprimées: ${key}`);
  }

  // Nettoyage complet
  clear(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('apertum_'));
    keys.forEach(key => localStorage.removeItem(key));
    this.cache.clear();
    console.log('🧹 Stockage nettoyé');
  }

  // Statistiques du système
  getStats() {
    const storageSize = Object.keys(localStorage)
      .filter(key => key.startsWith('apertum_'))
      .reduce((total, key) => {
        const item = localStorage.getItem(key);
        return total + (item ? item.length : 0);
      }, 0);

    return {
      storage: {
        size: `${(storageSize / 1024).toFixed(2)} KB`,
        items: Object.keys(localStorage).filter(key => key.startsWith('apertum_')).length
      },
      cache: this.cache.getStats(),
      sync: this.syncManager.getConnectionStatus(),
      backups: this.backupManager.getBackups().length,
      config: this.config
    };
  }

  // Gestion des sauvegardes
  createManualBackup(): void {
    this.backupManager.createBackup();
  }

  getBackups() {
    return this.backupManager.getBackups();
  }

  restoreBackup(backupKey: string): boolean {
    const success = this.backupManager.restoreBackup(backupKey);
    if (success) {
      this.cache.clear(); // Vider le cache après restauration
    }
    return success;
  }

  // Configuration en temps réel
  updateConfig(newConfig: Partial<StorageConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (newConfig.enableAutoBackup !== undefined) {
      if (newConfig.enableAutoBackup) {
        this.backupManager.startAutoBackup();
      } else {
        this.backupManager.stopAutoBackup();
      }
    }
  }
}

// Instance globale
export const advancedStorage = new AdvancedStorageManager();

// Adaptateurs pour maintenir la compatibilité
export class ChercheurStorageAdvanced {
  static getAll(): Chercheur[] {
    return advancedStorage.get<Chercheur[]>('apertum_chercheurs') || [];
  }

  static getById(id: string): Chercheur | null {
    const chercheurs = this.getAll();
    return chercheurs.find(c => c.id === id) || null;
  }

  static save(chercheur: Chercheur): void {
    const chercheurs = this.getAll();
    const index = chercheurs.findIndex(c => c.id === chercheur.id);
    
    if (index >= 0) {
      chercheurs[index] = chercheur;
    } else {
      chercheurs.push(chercheur);
    }
    
    advancedStorage.set('apertum_chercheurs', chercheurs);
  }
}

export class EtudeStorageAdvanced {
  static getAll(): Etude[] {
    return advancedStorage.get<Etude[]>('apertum_etudes') || [];
  }

  static getById(id: string): Etude | null {
    const etudes = this.getAll();
    return etudes.find(e => e.id === id) || null;
  }

  static save(etude: Etude): void {
    const etudes = this.getAll();
    const index = etudes.findIndex(e => e.id === etude.id);
    
    if (index >= 0) {
      etudes[index] = etude;
    } else {
      etudes.push(etude);
    }
    
    advancedStorage.set('apertum_etudes', etudes);
  }
}

export class SessionStorageAdvanced {
  static get(): Session | null {
    return advancedStorage.get<Session>('apertum_session');
  }

  static set(session: Session): void {
    advancedStorage.set('apertum_session', session);
  }

  static clear(): void {
    advancedStorage.remove('apertum_session');
  }
} 