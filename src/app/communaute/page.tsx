import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  MoreVertical,
  User,
  Mail,
  MessageCircle,
  Users,
  Calendar
} from 'lucide-react';

export default function CommunautePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const members = [
    {
      id: '1',
      nom: 'Dr. Marie Dubois',
      email: 'marie.dubois@universite.fr',
      role: 'Chercheur principal',
      departement: 'Psychologie',
      statut: 'actif',
      derniereActivite: '2024-01-15',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: '2',
      nom: 'Prof. Jean Martin',
      email: 'jean.martin@universite.fr',
      role: 'Chercheur',
      departement: 'Sociologie',
      statut: 'actif',
      derniereActivite: '2024-01-14',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: '3',
      nom: 'Dr. Sophie Leroy',
      email: 'sophie.leroy@universite.fr',
      role: 'Chercheur',
      departement: 'Psychologie',
      statut: 'actif',
      derniereActivite: '2024-01-13',
      avatar: '/api/placeholder/40/40'
    }
  ];

  const filteredMembers = members.filter(member =>
    member.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.departement.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                Communauté
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher dans la communauté..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">Tous les départements</option>
              <option value="psychologie">Psychologie</option>
              <option value="sociologie">Sociologie</option>
              <option value="statistiques">Statistiques</option>
            </select>
            
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </button>
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div key={member.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {member.nom}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      {member.email}
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Rôle:</span>
                  <span className="text-gray-900 dark:text-white">{member.role}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Département:</span>
                  <span className="text-gray-900 dark:text-white">{member.departement}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Dernière activité:</span>
                  <span className="text-gray-900 dark:text-white flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(member.derniereActivite).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </button>
                <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  <Users className="w-4 h-4 mr-2" />
                  Collaborer
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 