import React from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Edit,
  Trash2,
  UserPlus,
  Users,
  Settings
} from 'lucide-react';

export default function EquipePage() {
  const members = [
    {
      id: '1',
      nom: 'Dr. Marie Dubois',
      email: 'marie.dubois@universite.fr',
      role: 'Administrateur',
      departement: 'Psychologie',
      statut: 'actif',
      dateAjout: '2023-06-15',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: '2',
      nom: 'Prof. Jean Martin',
      email: 'jean.martin@universite.fr',
      role: 'Chercheur principal',
      departement: 'Sociologie',
      statut: 'actif',
      dateAjout: '2023-07-20',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: '3',
      nom: 'Dr. Sophie Leroy',
      email: 'sophie.leroy@universite.fr',
      role: 'Chercheur',
      departement: 'Psychologie',
      statut: 'inactif',
      dateAjout: '2023-08-10',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: '4',
      nom: 'Thomas Bernard',
      email: 'thomas.bernard@universite.fr',
      role: 'Assistant de recherche',
      departement: 'Statistiques',
      statut: 'actif',
      dateAjout: '2023-09-05',
      avatar: '/api/placeholder/40/40'
    }
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Administrateur':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <Shield className="w-3 h-3 mr-1" />
            Administrateur
          </span>
        );
      case 'Chercheur principal':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Chercheur principal
          </span>
        );
      case 'Chercheur':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Chercheur
          </span>
        );
      case 'Assistant de recherche':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            Assistant
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'actif':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Actif
          </span>
        );
      case 'inactif':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            Inactif
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusText = (statut: string) => {
    switch (statut) {
      case 'actif':
        return 'Actif';
      case 'inactif':
        return 'Inactif';
      default:
        return 'Inconnu';
    }
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
                Gestion de l'équipe
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </button>
              
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Inviter un membre
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total membres</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{members.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Membres actifs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {members.filter(m => m.statut === 'actif').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <User className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Chercheurs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {members.filter(m => m.role.includes('Chercheur')).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <Settings className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Départements</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Set(members.map(m => m.departement)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un membre..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">Tous les rôles</option>
              <option value="admin">Administrateur</option>
              <option value="principal">Chercheur principal</option>
              <option value="chercheur">Chercheur</option>
              <option value="assistant">Assistant</option>
            </select>
            
            <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
            
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </button>
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Membre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Département
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ajouté le
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-4">
                          <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {member.nom}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(member.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {member.departement}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(member.statut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(member.dateAjout).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                          onClick={() => console.log('Edit member:', member.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Permissions Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Permissions par rôle
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Administrateur</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Gestion complète</li>
                <li>• Inviter/Supprimer membres</li>
                <li>• Toutes les études</li>
                <li>• Paramètres système</li>
              </ul>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Chercheur principal</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Créer des études</li>
                <li>• Gérer ses études</li>
                <li>• Inviter collaborateurs</li>
                <li>• Analytics avancées</li>
              </ul>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Chercheur</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Créer des études</li>
                <li>• Modifier ses études</li>
                <li>• Voir analytics de base</li>
                <li>• Exporter données</li>
              </ul>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Assistant</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Voir les études</li>
                <li>• Participer aux études</li>
                <li>• Consulter résultats</li>
                <li>• Support technique</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 