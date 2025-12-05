import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  MoreVertical,
  Calendar,
  Users,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  Grid,
  List
} from 'lucide-react';

export default function EtudesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Données simulées des études
  const etudes = [
    {
      id: 'etude-001',
      titre: 'Étude sur le stress et la performance cognitive',
      description: 'Investigation de l\'impact du stress chronique sur les capacités cognitives chez les jeunes adultes',
      type: 'Randomisée contrôlée',
      statut: 'active',
      dateCreation: '2024-01-15',
      dateDebut: '2024-01-20',
      dateFin: '2024-03-20',
      participantsTotal: 120,
      participantsActuels: 78,
      progression: 65,
      chercheurPrincipal: 'Dr. Marie Dubois',
      collaborateurs: ['Dr. Jean Martin', 'Sarah Cohen'],
      tags: ['Stress', 'Cognition', 'Jeunes adultes'],
      budget: 45000,
      publications: 2
    },
    {
      id: 'etude-002',
      titre: 'Intervention numérique pour l\'anxiété',
      description: 'Évaluation d\'une application mobile pour la gestion de l\'anxiété chez les étudiants universitaires',
      type: 'Interventionnelle',
      statut: 'recrutement',
      dateCreation: '2024-01-10',
      dateDebut: '2024-02-01',
      dateFin: '2024-05-01',
      participantsTotal: 200,
      participantsActuels: 45,
      progression: 23,
      chercheurPrincipal: 'Prof. Pierre Leclerc',
      collaborateurs: ['Dr. Emma Wilson', 'Thomas Leroy'],
      tags: ['Anxiété', 'Numérique', 'Étudiants'],
      budget: 67500,
      publications: 0
    },
    {
      id: 'etude-003',
      titre: 'Sommeil et bien-être mental',
      description: 'Analyse longitudinale de la relation entre la qualité du sommeil et la santé mentale',
      type: 'Observationnelle',
      statut: 'terminee',
      dateCreation: '2023-09-01',
      dateDebut: '2023-10-15',
      dateFin: '2024-01-15',
      participantsTotal: 80,
      participantsActuels: 76,
      progression: 100,
      chercheurPrincipal: 'Dr. Sophie Bernard',
      collaborateurs: ['Dr. Lucas Moreau'],
      tags: ['Sommeil', 'Bien-être', 'Longitudinale'],
      budget: 32000,
      publications: 3
    },
    {
      id: 'etude-004',
      titre: 'Méditation et réduction du stress',
      description: 'Effet de la méditation de pleine conscience sur les marqueurs biologiques du stress',
      type: 'Randomisée contrôlée',
      statut: 'en_pause',
      dateCreation: '2023-12-01',
      dateDebut: '2024-01-01',
      dateFin: '2024-04-01',
      participantsTotal: 150,
      participantsActuels: 89,
      progression: 59,
      chercheurPrincipal: 'Prof. Antoine Rousseau',
      collaborateurs: ['Dr. Claire Petit', 'Dr. Marc Duval', 'Laura Chen'],
      tags: ['Méditation', 'Stress', 'Biomarqueurs'],
      budget: 78000,
      publications: 1
    },
    {
      id: 'etude-005',
      titre: 'Intelligence artificielle en psychothérapie',
      description: 'Étude pilote sur l\'utilisation de l\'IA comme support thérapeutique',
      type: 'Pilote',
      statut: 'preparation',
      dateCreation: '2024-01-25',
      dateDebut: '2024-03-01',
      dateFin: '2024-06-01',
      participantsTotal: 50,
      participantsActuels: 0,
      progression: 0,
      chercheurPrincipal: 'Dr. Amélie Fontaine',
      collaborateurs: ['Dr. Nicolas Blanc'],
      tags: ['IA', 'Psychothérapie', 'Innovation'],
      budget: 125000,
      publications: 0
    }
  ];

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <PlayCircle className="w-3 h-3 mr-1" />
            Active
          </span>
        );
      case 'recrutement':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <Users className="w-3 h-3 mr-1" />
            Recrutement
          </span>
        );
      case 'terminee':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Terminée
          </span>
        );
      case 'en_pause':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <PauseCircle className="w-3 h-3 mr-1" />
            En pause
          </span>
        );
      case 'preparation':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            <Clock className="w-3 h-3 mr-1" />
            Préparation
          </span>
        );
      default:
        return null;
    }
  };

  const filteredEtudes = etudes.filter(etude => {
    const matchesSearch = 
      etude.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      etude.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      etude.chercheurPrincipal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      etude.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === '' || etude.statut === statusFilter;
    const matchesType = typeFilter === '' || etude.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: etudes.length,
    actives: etudes.filter(e => e.statut === 'active').length,
    terminees: etudes.filter(e => e.statut === 'terminee').length,
    participants: etudes.reduce((sum, e) => sum + e.participantsActuels, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Gestion des Études
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Gérez et suivez toutes vos études de recherche
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              <Link 
                href="/etudes/creer"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle étude
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total études</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <PlayCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Études actives</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.actives}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-gray-600 dark:text-gray-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Terminées</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.terminees}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Participants</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.participants}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par titre, description, chercheur ou tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Tous les statuts</option>
              <option value="active">Active</option>
              <option value="recrutement">Recrutement</option>
              <option value="terminee">Terminée</option>
              <option value="en_pause">En pause</option>
              <option value="preparation">Préparation</option>
            </select>
            
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Tous les types</option>
              <option value="Randomisée contrôlée">Randomisée contrôlée</option>
              <option value="Observationnelle">Observationnelle</option>
              <option value="Interventionnelle">Interventionnelle</option>
              <option value="Pilote">Pilote</option>
            </select>
            
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <Filter className="w-4 h-4 mr-2" />
              Plus de filtres
            </button>
          </div>
        </div>

        {/* Studies Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEtudes.map((etude) => (
              <div key={etude.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {etude.titre}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">
                        {etude.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    {getStatusBadge(etude.statut)}
                    <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                      {etude.type}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{etude.participantsActuels}/{etude.participantsTotal} participants</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span>
                        {new Date(etude.dateDebut).toLocaleDateString()} - {new Date(etude.dateFin).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-300">Progression</span>
                      <span className="font-medium text-gray-900 dark:text-white">{etude.progression}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${etude.progression}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {etude.chercheurPrincipal}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Link 
                        href={`/etudes/${etude.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link 
                        href={`/etudes/${etude.id}/modifier`}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Étude
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type & Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Participants
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Progression
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Chercheur
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredEtudes.map((etude) => (
                    <tr key={etude.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {etude.titre}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {etude.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-2">
                          {getStatusBadge(etude.statut)}
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {etude.type}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {etude.participantsActuels}/{etude.participantsTotal}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {Math.round((etude.participantsActuels/etude.participantsTotal)*100)}% de l'objectif
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600 dark:text-gray-300">{etude.progression}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full"
                                style={{ width: `${etude.progression}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {etude.chercheurPrincipal}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          +{etude.collaborateurs.length} collaborateur(s)
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link 
                            href={`/etudes/${etude.id}`}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link 
                            href={`/etudes/${etude.id}/modifier`}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
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
        )}

        {/* Empty State */}
        {filteredEtudes.length === 0 && (
          <div className="text-center py-12">
            <Target className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Aucune étude trouvée
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Essayez de modifier vos critères de recherche ou créez une nouvelle étude.
            </p>
            <div className="mt-6">
              <Link 
                href="/etudes/creer"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer une nouvelle étude
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 