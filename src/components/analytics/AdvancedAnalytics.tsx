'use client';

import React, { useState, useEffect } from 'react';
import { Etude, CollectionDonnees, Participant } from '@/types';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  Filter,
  Calendar,
  Users,
  Target,
  Eye,
  FileText,
  Activity
} from 'lucide-react';

interface AdvancedAnalyticsProps {
  etude: Etude;
  collections: CollectionDonnees[];
  participants: Participant[];
}

interface AnalysisMetrics {
  completionRate: number;
  averageTimeSpent: number;
  totalResponses: number;
  participantEngagement: number;
  dataQuality: number;
  trendsData: Array<{ date: string; value: number; }>;
}

interface QuestionAnalysis {
  questionId: string;
  questionTitle: string;
  responseCount: number;
  skipRate: number;
  averageTime: number;
  responses: Array<{ value: string; count: number; percentage: number; }>;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({
  etude,
  collections,
  participants
}) => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [metrics, setMetrics] = useState<AnalysisMetrics | null>(null);
  const [questionAnalyses, setQuestionAnalyses] = useState<QuestionAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    calculateMetrics();
    analyzeQuestions();
    setIsLoading(false);
  }, [etude, collections, participants, selectedTimeRange, selectedModule]);

  const calculateMetrics = () => {
    // Simulation des métriques d'analyse
    const totalQuestions = etude.protocole.modules.reduce((total, module) => 
      total + module.questions.length, 0
    );
    
    const totalResponses = collections.reduce((total, collection) => 
      total + (collection.donnees?.length || 0), 0
    );

    const completionRate = participants.length > 0 ? 
      (totalResponses / (participants.length * totalQuestions)) * 100 : 0;

    // Génération de données de tendance simulées
    const trendsData = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.floor(Math.random() * 50) + 20 + i * 5
    }));

    setMetrics({
      completionRate: Math.min(completionRate, 100),
      averageTimeSpent: Math.floor(Math.random() * 20) + 5, // minutes
      totalResponses,
      participantEngagement: Math.floor(Math.random() * 30) + 70,
      dataQuality: Math.floor(Math.random() * 20) + 80,
      trendsData
    });
  };

  const analyzeQuestions = () => {
    const analyses: QuestionAnalysis[] = [];
    
    etude.protocole.modules.forEach(module => {
      if (selectedModule === 'all' || selectedModule === module.id) {
        module.questions.forEach(question => {
          // Simulation de données d'analyse pour chaque question
          const responseCount = Math.floor(Math.random() * participants.length);
          const skipRate = ((participants.length - responseCount) / participants.length) * 100;
          
          // Génération de réponses simulées
          const responses = [];
          if (question.typeOutput === 'qcm_unique' || question.typeOutput === 'qcm_multiple') {
            const options = ['Option A', 'Option B', 'Option C', 'Option D'];
            options.forEach(option => {
              const count = Math.floor(Math.random() * responseCount);
              if (count > 0) {
                responses.push({
                  value: option,
                  count,
                  percentage: (count / responseCount) * 100
                });
              }
            });
          } else {
            // Pour les questions ouvertes, afficher des catégories de réponses
            const categories = ['Réponse détaillée', 'Réponse courte', 'Réponse incomplète'];
            categories.forEach(category => {
              const count = Math.floor(Math.random() * responseCount);
              if (count > 0) {
                responses.push({
                  value: category,
                  count,
                  percentage: (count / responseCount) * 100
                });
              }
            });
          }

          analyses.push({
            questionId: question.id,
            questionTitle: question.titre,
            responseCount,
            skipRate,
            averageTime: Math.floor(Math.random() * 120) + 30, // secondes
            responses: responses.sort((a, b) => b.count - a.count)
          });
        });
      }
    });

    setQuestionAnalyses(analyses);
  };

  const exportData = (format: 'csv' | 'json' | 'pdf') => {
    // Simulation d'export de données
    const exportData = {
      study: etude.nom,
      metrics,
      questionAnalyses,
      participants: participants.length,
      exportDate: new Date().toISOString(),
      format
    };

    const dataStr = format === 'json' ? 
      JSON.stringify(exportData, null, 2) : 
      'Export simulation - Format ' + format.toUpperCase();
    
    const dataUri = 'data:application/' + format + ';charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `apertum_analysis_${etude.nom}_${new Date().toISOString().split('T')[0]}.${format}`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getStatusBg = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 dark:bg-green-900';
    if (percentage >= 60) return 'bg-yellow-100 dark:bg-yellow-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  if (isLoading || !metrics) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Analyse des données en cours...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analyse Avancée
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Insights détaillés sur les données collectées
          </p>
        </div>
        
        <div className="flex flex-wrap items-center space-x-3">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">3 derniers mois</option>
            <option value="all">Toute la période</option>
          </select>
          
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Tous les modules</option>
            {etude.protocole.modules.map(module => (
              <option key={module.id} value={module.id}>{module.nom}</option>
            ))}
          </select>

          <div className="flex space-x-2">
            <button
              onClick={() => exportData('csv')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => exportData('json')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
            { id: 'questions', label: 'Analyse par question', icon: FileText },
            { id: 'participants', label: 'Comportement participants', icon: Users },
            { id: 'trends', label: 'Tendances', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Key metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Taux de complétion
                  </p>
                  <p className={`text-2xl font-bold ${getStatusColor(metrics.completionRate)}`}>
                    {metrics.completionRate.toFixed(1)}%
                  </p>
                </div>
                <div className={`p-3 rounded-full ${getStatusBg(metrics.completionRate)}`}>
                  <Target className={`w-6 h-6 ${getStatusColor(metrics.completionRate)}`} />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Temps moyen
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {metrics.averageTimeSpent}min
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total réponses
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {metrics.totalResponses.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                  <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Engagement
                  </p>
                  <p className={`text-2xl font-bold ${getStatusColor(metrics.participantEngagement)}`}>
                    {metrics.participantEngagement}%
                  </p>
                </div>
                <div className={`p-3 rounded-full ${getStatusBg(metrics.participantEngagement)}`}>
                  <Users className={`w-6 h-6 ${getStatusColor(metrics.participantEngagement)}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Trends chart simulation */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tendance des réponses
            </h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {metrics.trendsData.map((point, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div 
                    className="bg-blue-600 rounded-t"
                    style={{ 
                      height: `${(point.value / Math.max(...metrics.trendsData.map(p => p.value))) * 200}px`,
                      width: '30px'
                    }}
                  ></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(point.date).toLocaleDateString('fr-FR', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'questions' && (
        <div className="space-y-6">
          {questionAnalyses.map(analysis => (
            <div key={analysis.questionId} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {analysis.questionTitle}
                  </h3>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>{analysis.responseCount} réponses</span>
                    <span>Taux d'abandon: {analysis.skipRate.toFixed(1)}%</span>
                    <span>Temps moyen: {analysis.averageTime}s</span>
                  </div>
                </div>
                <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Eye className="w-4 h-4" />
                  <span>Détails</span>
                </button>
              </div>

              {analysis.responses.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">Distribution des réponses:</h4>
                  {analysis.responses.map((response, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {response.value}
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {response.count} ({response.percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${response.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedTab === 'participants' && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Analyse du comportement des participants
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {participants.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Participants actifs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {Math.floor(participants.length * 0.8)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Ont terminé</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {Math.floor(participants.length * 0.15)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">En cours</div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'trends' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Évolution de la participation
            </h3>
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                <p>Graphique de tendances interactif</p>
                <p className="text-sm">Disponible avec des données réelles</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Qualité des données
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Complétude</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {metrics.dataQuality}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Cohérence</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">95%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Validité</span>
                  <span className="font-medium text-yellow-600 dark:text-yellow-400">88%</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Insights automatiques
              </h4>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-400">
                  <p className="text-blue-800 dark:text-blue-200">
                    Pic d'activité détecté entre 14h et 16h
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-400">
                  <p className="text-green-800 dark:text-green-200">
                    Taux de rétention supérieur à la moyenne
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-400">
                  <p className="text-yellow-800 dark:text-yellow-200">
                    Question 3 du Module 2 a un taux d'abandon élevé
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedAnalytics; 