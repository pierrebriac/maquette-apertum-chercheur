import React from 'react';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit2,
  Settings,
  Bell,
  Shield,
  Key,
  Download,
  Trash2
} from 'lucide-react';

export default function ProfilPage() {
  const user = {
    nom: 'Dr. Marie Dubois',
    email: 'marie.dubois@universite.fr',
    telephone: '+33 1 23 45 67 89',
    institution: 'Université de Paris',
    departement: 'Département de Psychologie',
    adresse: 'Paris, France',
    dateInscription: '2023-06-15',
    avatar: '/api/placeholder/120/120'
  };

  const stats = {
    etudesCreees: 12,
    participantsTotal: 247,
    reponseesCollectees: 1456,
    tauxCompletion: 89
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                ← Accueil
              </Link>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Mon Profil
              </h1>
            </div>
            
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              <Edit2 className="w-4 h-4 mr-2" />
              Modifier le profil
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
                <div className="flex items-center">
                  <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-200 flex items-center justify-center mr-6">
                    <User className="w-10 h-10 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {user.nom}
                    </h2>
                    <p className="text-blue-100">
                      {user.institution} • {user.departement}
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Informations personnelles
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-gray-900 dark:text-white">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Téléphone</p>
                      <p className="text-gray-900 dark:text-white">{user.telephone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Localisation</p>
                      <p className="text-gray-900 dark:text-white">{user.adresse}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Membre depuis</p>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(user.dateInscription).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                Statistiques d'activité
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.etudesCreees}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Études créées
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.participantsTotal}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Participants
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.reponseesCollectees}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Réponses collectées
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {stats.tauxCompletion}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Taux de complétion
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Actions rapides
              </h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                  <Settings className="w-4 h-4 mr-3" />
                  Paramètres du compte
                </button>
                
                <button className="w-full flex items-center px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                  <Bell className="w-4 h-4 mr-3" />
                  Notifications
                </button>
                
                <button className="w-full flex items-center px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                  <Shield className="w-4 h-4 mr-3" />
                  Confidentialité
                </button>
                
                <button className="w-full flex items-center px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                  <Key className="w-4 h-4 mr-3" />
                  Sécurité
                </button>
              </div>
            </div>

            {/* Data Management */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Gestion des données
              </h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                  <Download className="w-4 h-4 mr-3" />
                  Exporter mes données
                </button>
                
                <button className="w-full flex items-center px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md">
                  <Trash2 className="w-4 h-4 mr-3" />
                  Supprimer mon compte
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Activité récente
              </h3>
              
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="text-gray-900 dark:text-white">Étude créée</p>
                  <p className="text-gray-500 dark:text-gray-400">Il y a 2 heures</p>
                </div>
                
                <div className="text-sm">
                  <p className="text-gray-900 dark:text-white">5 nouvelles réponses</p>
                  <p className="text-gray-500 dark:text-gray-400">Il y a 4 heures</p>
                </div>
                
                <div className="text-sm">
                  <p className="text-gray-900 dark:text-white">Rapport généré</p>
                  <p className="text-gray-500 dark:text-gray-400">Hier</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 