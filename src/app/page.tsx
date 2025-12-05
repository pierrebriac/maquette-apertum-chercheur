import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  Plus,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Apertum Platform
              </h1>
            </div>
            
            <nav className="flex items-center space-x-6">
              <Link href="/etudes" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Études
              </Link>
              <Link href="/communaute" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Communauté
              </Link>
              <Link href="/analytics" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Analytics
              </Link>
              <Link href="/profil" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Profil
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Bienvenue sur Apertum
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Plateforme de recherche en santé numérique moderne et intuitive. 
            Créez, gérez et analysez vos études de recherche facilement.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Études actives
                </h3>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Participants
                </h3>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">348</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Réponses collectées
                </h3>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">2,847</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Taux de complétion
                </h3>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">87%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Actions rapides
            </h3>
            <div className="space-y-3">
              <Link 
                href="/etudes/creer"
                className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                <span className="text-gray-900 dark:text-white">Créer une nouvelle étude</span>
              </Link>
              
              <Link 
                href="/analytics"
                className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-3" />
                <span className="text-gray-900 dark:text-white">Voir les analytics</span>
              </Link>
              
              <Link 
                href="/donnees"
                className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FileText className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                <span className="text-gray-900 dark:text-white">Exporter les données</span>
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Activités récentes
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Étude "Santé mentale" terminée
                </span>
                <span className="text-xs text-gray-400">Il y a 2h</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Nouveau participant inscrit
                </span>
                <span className="text-xs text-gray-400">Il y a 4h</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Rapport mensuel généré
                </span>
                <span className="text-xs text-gray-400">Il y a 1j</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Studies */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Études récentes
              </h3>
              <Link 
                href="/etudes"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
              >
                Voir toutes
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Étude sur l'activité physique {i}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Créée il y a {i + 1} jours • {20 + i * 5} participants
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 