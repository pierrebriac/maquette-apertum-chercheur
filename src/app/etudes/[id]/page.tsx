import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Play,
  Pause,
  Stop,
  Edit,
  Share,
  Download,
  MoreVertical,
  Users,
  Calendar,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  FileText,
  Settings,
  UserPlus,
  Database,
  PieChart,
  Activity
} from 'lucide-react';

interface EtudeDetailProps {
  params: {
    id: string;
  };
}

export default function EtudeDetailPage({ params }: EtudeDetailProps) {
  const study = {
    id: params.id,
    titre: 'Étude sur l\'activité physique et le bien-être mental',
    description: 'Cette étude vise à analyser la corrélation entre l\'activité physique régulière et l\'amélioration du bien-être mental chez les adultes âgés de 18 à 65 ans.',
    statut: 'active',
    dateCreation: '2024-01-15',
    dateLancement: '2024-01-20',
    dateFinPrevue: '2024-06-20',
    createur: 'Dr. Marie Dubois',
    departement: 'Département de Psychologie',
    institution: 'Université de Paris',
    objectifParticipants: 300,
    participantsActuels: 187,
    participantsComplets: 134,
    questionsTotal: 25,
    reponseesCollectees: 2847,
    tauxCompletion: 72,
    tauxAttrition: 12,
    dureeEstimee: '15-20 minutes'
  };

  // Données démographiques simulées
  const demographiques = {
    hommes: 78,
    femmes: 89,
    autre: 20,
    agesMoyens: {
      '18-25': 45,
      '26-35': 67,
      '36-45': 52,
      '46-55': 18,
      '56-65': 5
    },
    education: {
      'Secondaire': 23,
      'Universitaire': 142,
      'Post-graduate': 22
    },
    regions: {
      'Île-de-France': 89,
      'Auvergne-Rhône-Alpes': 34,
      'Provence-Alpes-Côte d\'Azur': 28,
      'Autres': 36
    }
  };

  // Variables et distributions
  const variables = [
    {
      nom: 'Score bien-être mental (PHQ-9)',
      moyenne: 7.2,
      ecartType: 3.4,
      min: 0,
      max: 18,
      distribution: 'Normale'
    },
    {
      nom: 'Heures d\'activité physique/semaine',
      moyenne: 4.8,
      ecartType: 2.1,
      min: 0,
      max: 12,
      distribution: 'Log-normale'
    },
    {
      nom: 'Score de stress perçu',
      moyenne: 14.6,
      ecartType: 4.2,
      min: 4,
      max: 24,
      distribution: 'Normale'
    }
  ];

  // Équipe collaboratrice
  const equipe = [
    {
      nom: 'Dr. Marie Dubois',
      role: 'Investigateur principal',
      avatar: 'MD'
    },
    {
      nom: 'Prof. Jean Martin',
      role: 'Co-investigateur',
      avatar: 'JM'
    },
    {
      nom: 'Dr. Sophie Leroy',
      role: 'Analyste statistique',
      avatar: 'SL'
    }
  ];

  const stats = [
    {
      label: 'Participants',
      value: study.participantsActuels,
      target: study.objectifParticipants,
      subtitle: `${Math.round(((study.objectifParticipants - study.participantsActuels) / study.objectifParticipants) * 100)}% restant`,
      icon: Users,
      color: 'blue',
      percentage: (study.participantsActuels / study.objectifParticipants) * 100
    },
    {
      label: 'Répartition H/F',
      value: `${demographiques.hommes}H / ${demographiques.femmes}F`,
      subtitle: `${demographiques.autre} autres`,
      icon: PieChart,
      color: 'purple'
    },
    {
      label: 'Complétion des tests',
      value: `${study.tauxCompletion}%`,
      subtitle: `${study.participantsComplets} participants complets`,
      icon: CheckCircle,
      color: 'green'
    },
    {
      label: 'Taux d\'attrition',
      value: `${study.tauxAttrition}%`,
      subtitle: `${Math.round(study.participantsActuels * study.tauxAttrition / 100)} abandons`,
      icon: AlertCircle,
      color: 'red'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'participant_joined',
      message: '5 nouveaux participants ont rejoint l\'étude',
      timestamp: '2024-01-16T10:30:00Z'
    },
    {
      id: 2,
      type: 'responses_collected',
      message: '23 nouvelles réponses collectées',
      timestamp: '2024-01-16T09:15:00Z'
    },
    {
      id: 3,
      type: 'milestone_reached',
      message: 'Seuil des 150 participants atteint',
      timestamp: '2024-01-15T16:45:00Z'
    },
    {
      id: 4,
      type: 'team_member_added',
      message: 'Dr. Sophie Leroy ajoutée à l\'équipe',
      timestamp: '2024-01-14T14:20:00Z'
    }
  ];

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'active':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <Play className="w-4 h-4 mr-1" />
            Étude active
          </span>
        );
      case 'pause':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <Pause className="w-4 h-4 mr-1" />
            En pause
          </span>
        );
      case 'terminee':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            Terminée
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link 
                href="/etudes" 
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux études
              </Link>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link
                href={`/etudes/${study.id}/participants`}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <Database className="w-4 h-4 mr-2" />
                Base de données
              </Link>
              
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <Share className="w-4 h-4 mr-2" />
                Partager
              </button>
              
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </button>
              
              <Link
                href={`/etudes/${study.id}/modifier`}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Study Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mr-4">
                  {study.titre}
                </h1>
                {getStatusBadge(study.statut)}
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-3xl">
                {study.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Créateur</p>
                  <p className="font-medium text-gray-900 dark:text-white">{study.createur}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{study.departement}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date de création</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(study.dateCreation).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Lancée le {new Date(study.dateLancement).toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Fin prévue</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(study.dateFinPrevue).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {Math.ceil((new Date(study.dateFinPrevue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} jours restants
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                    {stat.target && (
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                        / {stat.target}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {stat.subtitle}
                  </p>
                  {stat.percentage && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div 
                          className={`bg-${stat.color}-600 dark:bg-${stat.color}-500 h-1.5 rounded-full transition-all duration-300`}
                          style={{ width: `${stat.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20 ml-3`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Statistiques démographiques */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                Statistiques démographiques
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Répartition par âge */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Répartition par âge</h4>
                  <div className="space-y-2">
                    {Object.entries(demographiques.agesMoyens).map(([age, count]) => (
                      <div key={age} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{age} ans</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(count / study.participantsActuels) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white w-8">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Niveau d'éducation */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Niveau d'éducation</h4>
                  <div className="space-y-2">
                    {Object.entries(demographiques.education).map(([niveau, count]) => (
                      <div key={niveau} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{niveau}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-green-600 dark:bg-green-500 h-2 rounded-full"
                              style={{ width: `${(count / study.participantsActuels) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white w-8">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Distribution des variables */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                Distribution des variables principales
              </h3>
              
              <div className="space-y-6">
                {variables.map((variable, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-600 last:border-b-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{variable.nom}</h4>
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                        {variable.distribution}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Moyenne</span>
                        <p className="font-medium text-gray-900 dark:text-white">{variable.moyenne}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Écart-type</span>
                        <p className="font-medium text-gray-900 dark:text-white">{variable.ecartType}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Min</span>
                        <p className="font-medium text-gray-900 dark:text-white">{variable.min}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Max</span>
                        <p className="font-medium text-gray-900 dark:text-white">{variable.max}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                Actions rapides
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link
                  href={`/etudes/${study.id}/participants`}
                  className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Database className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Base de données</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Consulter les données</p>
                  </div>
                </Link>
                
                <Link
                  href={`/analytics?study=${study.id}`}
                  className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Analytics</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Analyses statistiques</p>
                  </div>
                </Link>
                
                <button className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Algorithmes</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Répertoire (à venir)</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Study Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Contrôles de l'étude
              </h3>
              
              <div className="space-y-3">
                {study.statut === 'active' ? (
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700">
                    <Pause className="w-4 h-4 mr-2" />
                    Mettre en pause
                  </button>
                ) : (
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                    <Play className="w-4 h-4 mr-2" />
                    Reprendre l'étude
                  </button>
                )}
                
                <button className="w-full flex items-center justify-center px-4 py-2 border border-red-300 dark:border-red-600 rounded-md text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Stop className="w-4 h-4 mr-2" />
                  Terminer l'étude
                </button>
              </div>
            </div>

            {/* Équipe collaboratrice */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Équipe collaboratrice
                </h3>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  <UserPlus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                {equipe.map((membre, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">{membre.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{membre.nom}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{membre.role}</p>
                    </div>
                  </div>
                ))}
                
                <button className="w-full mt-3 px-3 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  + Ajouter un collaborateur
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Activité récente
              </h3>
              
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(activity.timestamp).toLocaleDateString()} à {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 