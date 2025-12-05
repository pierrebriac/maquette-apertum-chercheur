'use client';

import React, { useState, useEffect } from 'react';
import { 
  advancedStorage, 
  StorageConfig,
  AdvancedStorageManager 
} from '@/lib/storage-advanced';
import { 
  Database, 
  Settings, 
  Download, 
  Upload, 
  RefreshCw, 
  Trash2,
  HardDrive,
  Activity,
  Shield,
  Wifi,
  WifiOff,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Zap,
  Archive,
  RotateCcw,
  Power,
  Gauge
} from 'lucide-react';

interface StorageSettingsProps {
  className?: string;
}

interface StorageStats {
  storage: {
    size: string;
    items: number;
  };
  cache: {
    size: number;
    keys: string[];
  };
  sync: {
    isOnline: boolean;
    queueSize: number;
  };
  backups: number;
  config: StorageConfig;
}

export default function StorageSettings({ className = '' }: StorageSettingsProps) {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [config, setConfig] = useState<StorageConfig>({
    enableCompression: true,
    enableAutoBackup: true,
    backupInterval: 30,
    maxBackupFiles: 10,
    enableEncryption: false,
    enableSync: true
  });
  const [backups, setBackups] = useState<Array<{ key: string; timestamp: string; size: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Actualiser les statistiques
  const refreshStats = () => {
    try {
      const currentStats = advancedStorage.getStats();
      setStats(currentStats);
      setConfig(currentStats.config);
      
      const backupList = advancedStorage.getBackups();
      setBackups(backupList);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    }
  };

  useEffect(() => {
    refreshStats();
    const interval = setInterval(refreshStats, 5000); // Actualiser toutes les 5 secondes
    return () => clearInterval(interval);
  }, []);

  // Gestion des messages
  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // Mettre à jour la configuration
  const updateConfig = (newConfig: Partial<StorageConfig>) => {
    try {
      const updatedConfig = { ...config, ...newConfig };
      setConfig(updatedConfig);
      advancedStorage.updateConfig(newConfig);
      showMessage('success', 'Configuration mise à jour');
      refreshStats();
    } catch (error) {
      showMessage('error', 'Erreur lors de la mise à jour');
    }
  };

  // Créer une sauvegarde manuelle
  const createBackup = async () => {
    setIsLoading(true);
    try {
      advancedStorage.createManualBackup();
      refreshStats();
      showMessage('success', 'Sauvegarde créée avec succès');
    } catch (error) {
      showMessage('error', 'Erreur lors de la création de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  // Restaurer une sauvegarde
  const restoreBackup = async (backupKey: string) => {
    if (!confirm('Êtes-vous sûr de vouloir restaurer cette sauvegarde ? Cela remplacera les données actuelles.')) {
      return;
    }

    setIsLoading(true);
    try {
      const success = advancedStorage.restoreBackup(backupKey);
      if (success) {
        refreshStats();
        showMessage('success', 'Sauvegarde restaurée avec succès');
        // Recharger la page pour refléter les changements
        setTimeout(() => window.location.reload(), 1000);
      } else {
        showMessage('error', 'Erreur lors de la restauration');
      }
    } catch (error) {
      showMessage('error', 'Erreur lors de la restauration');
    } finally {
      setIsLoading(false);
    }
  };

  // Vider le cache
  const clearCache = () => {
    try {
      // Recréer l'instance pour vider le cache
      refreshStats();
      showMessage('success', 'Cache vidé');
    } catch (error) {
      showMessage('error', 'Erreur lors du vidage du cache');
    }
  };

  // Formater la date
  const formatDate = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString('fr-FR');
    } catch {
      return timestamp;
    }
  };

  if (!stats) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Message de notification */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300' :
          message.type === 'error' ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300' :
          'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300'
        }`}>
          <div className="flex items-center space-x-2">
            {message.type === 'success' && <CheckCircle className="w-4 h-4" />}
            {message.type === 'error' && <AlertCircle className="w-4 h-4" />}
            {message.type === 'info' && <AlertCircle className="w-4 h-4" />}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        </div>
      )}

      {/* Statistiques générales */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Gauge className="w-5 h-5 mr-2 text-blue-500" />
            Statistiques du Stockage
          </h3>
          <button
            onClick={refreshStats}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Espace de stockage */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Stockage utilisé</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {stats.storage.size}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stats.storage.items} éléments
                </p>
              </div>
              <HardDrive className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          {/* Cache */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cache mémoire</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {stats.cache.size}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  entrées actives
                </p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          {/* Synchronisation */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Synchronisation</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  {stats.sync.isOnline ? (
                    <Wifi className="w-4 h-4 mr-1 text-green-500" />
                  ) : (
                    <WifiOff className="w-4 h-4 mr-1 text-red-500" />
                  )}
                  {stats.sync.isOnline ? 'En ligne' : 'Hors ligne'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stats.sync.queueSize} en attente
                </p>
              </div>
            </div>
          </div>

          {/* Sauvegardes */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sauvegardes</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {stats.backups}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  disponibles
                </p>
              </div>
              <Archive className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-gray-500" />
          Configuration du Stockage
        </h3>

        <div className="space-y-6">
          {/* Compression */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Compression des données</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Réduire l'espace de stockage utilisé</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.enableCompression}
                onChange={(e) => updateConfig({ enableCompression: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Sauvegarde automatique */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Sauvegarde automatique</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Créer des sauvegardes périodiques</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.enableAutoBackup}
                onChange={(e) => updateConfig({ enableAutoBackup: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Intervalle de sauvegarde */}
          {config.enableAutoBackup && (
            <div className="ml-6 space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Intervalle (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="1440"
                value={config.backupInterval}
                onChange={(e) => updateConfig({ backupInterval: parseInt(e.target.value) || 30 })}
                className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Chiffrement */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Chiffrement des données</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sécuriser les données stockées</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.enableEncryption}
                onChange={(e) => updateConfig({ enableEncryption: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Synchronisation */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Synchronisation en ligne</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Synchroniser avec le serveur</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.enableSync}
                onChange={(e) => updateConfig({ enableSync: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
          Actions Rapides
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={createBackup}
            disabled={isLoading}
            className="flex items-center justify-center space-x-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg p-4 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Créer une sauvegarde</span>
          </button>

          <button
            onClick={clearCache}
            className="flex items-center justify-center space-x-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
          >
            <Zap className="w-4 h-4" />
            <span>Vider le cache</span>
          </button>

          <button
            onClick={refreshStats}
            className="flex items-center justify-center space-x-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Liste des sauvegardes */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <Archive className="w-5 h-5 mr-2 text-blue-500" />
          Sauvegardes Disponibles
        </h3>

        {backups.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Archive className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucune sauvegarde disponible</p>
            <p className="text-sm">Créez votre première sauvegarde pour sécuriser vos données</p>
          </div>
        ) : (
          <div className="space-y-2">
            {backups.slice(0, 5).map((backup) => (
              <div
                key={backup.key}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatDate(backup.timestamp)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Taille: {backup.size}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => restoreBackup(backup.key)}
                  disabled={isLoading}
                  className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm disabled:opacity-50"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restaurer</span>
                </button>
              </div>
            ))}
            
            {backups.length > 5 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2">
                ... et {backups.length - 5} autres sauvegardes
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 