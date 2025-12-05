import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  MoreVertical,
  Users,
  Calendar,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone
} from 'lucide-react';

interface ParticipantDetailProps {
  params: {
    id: string;
  };
}

export default function ParticipantsPage({ params }: ParticipantDetailProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);

  // Données simulées des participants
  const participants = [
    {
      id: 'P001',
      nom: 'Marie',
      prenom: 'Dupont',
      age: 28,
      sexe: 'F',
      email: 'marie.dupont@email.com',
      telephone: '+33 6 12 34 56 78',
      ville: 'Paris',
      education: 'Universitaire',
      dateInscription: '2024-01-20',
      statut: 'actif',
      progression: 100,
      derniereActivite: '2024-01-25T14:30:00Z',
      scores: {
        phq9: 8,
        activitePhysique: 6.5,
        stressPercu: 12
      },
      modules: ['Module 1', 'Module 2', 'Module 3'],
      completionDates: {
        'Module 1': '2024-01-21',
        'Module 2': '2024-01-23',
        'Module 3': '2024-01-25'
      }
    },
    {
      id: 'P002',
      nom: 'Jean',
      prenom: 'Martin',
      age: 35,
      sexe: 'M',
      email: 'jean.martin@email.com',
      telephone: '+33 6 98 76 54 32',
      ville: 'Lyon',
      education: 'Post-graduate',
      dateInscription: '2024-01-22',
      statut: 'actif',
      progression: 67,
      derniereActivite: '2024-01-26T09:15:00Z',
      scores: {
        phq9: 5,
        activitePhysique: 8.2,
        stressPercu: 9
      },
      modules: ['Module 1', 'Module 2'],
      completionDates: {
        'Module 1': '2024-01-23',
        'Module 2': '2024-01-26'
      }
    },
    {
      id: 'P003',
      nom: 'Sophie',
      prenom: 'Bernard',
      age: 42,
      sexe: 'F',
      email: 'sophie.bernard@email.com',
      telephone: '+33 6 45 67 89 01',
      ville: 'Marseille',
      education: 'Universitaire',
      dateInscription: '2024-01-18',
      statut: 'abandonne',
      progression: 33,
      derniereActivite: '2024-01-19T16:45:00Z',
      scores: {
        phq9: 12,
        activitePhysique: 2.1,
        stressPercu: 18
      },
      modules: ['Module 1'],
      completionDates: {
        'Module 1': '2024-01-19'
      }
    },
    {
      id: 'P004',
      nom: 'Pierre',
      prenom: 'Durand',
      age: 24,
      sexe: 'M',
      email: 'pierre.durand@email.com',
      telephone: '+33 6 11 22 33 44',
      ville: 'Toulouse',
      education: 'Universitaire',
      dateInscription: '2024-01-25',
      statut: 'actif',
      progression: 0,
      derniereActivite: '2024-01-25T10:00:00Z',
      scores: {},
      modules: [],
      completionDates: {}
    },
    {
      id: 'P005',
      nom: 'Emma',
      prenom: 'Leroy',
      age: 31,
      sexe: 'F',
      email: 'emma.leroy@email.com',
      telephone: '+33 6 55 44 33 22',
      ville: 'Nantes',
      education: 'Secondaire',
      dateInscription: '2024-01-21',
      statut: 'pause',
      progression: 33,
      derniereActivite: '2024-01-24T11:20:00Z',
      scores: {
        phq9: 15,
        activitePhysique: 1.5,
        stressPercu: 20
      },
      modules: ['Module 1'],
      completionDates: {
        'Module 1': '2024-01-24'
      }
    }
  ];

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'actif':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Actif
          </span>
        );
      case 'pause':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            En pause
          </span>
        );
      case 'abandonne':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Abandonné
          </span>
        );
      default:
        return null;
    }
  };

  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = 
      participant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || participant.statut === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link 
                href={`/etudes/${params.id}`}
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l'étude
              </Link>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Base de données des participants
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <Download className="w-4 h-4 mr-2" />
                Exporter CSV
              </button>
              
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                <Users className="w-4 h-4 mr-2" />
                Ajouter participant
              </button>
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
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total participants</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{participants.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Actifs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {participants.filter(p => p.statut === 'actif').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Taux complétion</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(participants.filter(p => p.progression === 100).length / participants.length * 100)}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Abandons</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {participants.filter(p => p.statut === 'abandonne').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par nom, prénom ou ID..."
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
              <option value="actif">Actif</option>
              <option value="pause">En pause</option>
              <option value="abandonne">Abandonné</option>
            </select>
            
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <Filter className="w-4 h-4 mr-2" />
              Plus de filtres
            </button>
          </div>
        </div>

        {/* Participants Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Participant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Démographie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Progression
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Scores principaux
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Dernière activité
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredParticipants.map((participant) => (
                  <tr key={participant.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-4">
                          <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {participant.prenom} {participant.nom}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {participant.id}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {participant.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div>{participant.age} ans • {participant.sexe}</div>
                        <div className="text-gray-500 dark:text-gray-400 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {participant.ville}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {participant.education}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-300">
                              {participant.progression}%
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {participant.modules.length}/3 modules
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${participant.progression}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm space-y-1">
                        {participant.scores.phq9 !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">PHQ-9:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {participant.scores.phq9}
                            </span>
                          </div>
                        )}
                        {participant.scores.activitePhysique !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Act. phys:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {participant.scores.activitePhysique}h
                            </span>
                          </div>
                        )}
                        {participant.scores.stressPercu !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Stress:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {participant.scores.stressPercu}
                            </span>
                          </div>
                        )}
                        {Object.keys(participant.scores).length === 0 && (
                          <span className="text-gray-400 dark:text-gray-500 text-xs">
                            Aucune donnée
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(participant.statut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div>
                        {new Date(participant.derniereActivite).toLocaleDateString()}
                      </div>
                      <div>
                        {new Date(participant.derniereActivite).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => setSelectedParticipant(participant.id)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
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

        {/* Empty State */}
        {filteredParticipants.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Aucun participant trouvé
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Essayez de modifier vos critères de recherche.
            </p>
          </div>
        )}
      </main>

      {/* Participant Detail Modal - Simple version for now */}
      {selectedParticipant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Détails du participant
                </h3>
                <button 
                  onClick={() => setSelectedParticipant(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
              
              {/* Participant details would go here */}
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  Vue détaillée du participant {selectedParticipant}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  Fonctionnalité à implémenter
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 