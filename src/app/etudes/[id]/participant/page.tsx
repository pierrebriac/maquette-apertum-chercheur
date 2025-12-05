'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SessionStorage, StudyStorage } from '@/lib/storage';
import { Chercheur, Etude, Module, Question, Condition } from '@/types';
import { ArrowLeft, ArrowRight, Check, Play, RotateCcw } from 'lucide-react';

interface ParticipantResponse {
  questionId: string;
  response: string;
  timestamp: Date;
}

interface ParticipantState {
  currentModuleIndex: number;
  currentQuestionIndex: number;
  responses: ParticipantResponse[];
  isCompleted: boolean;
}

const ParticipantSimulationPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const etudeId = params?.id as string;

  const [chercheur, setChercheur] = useState<Chercheur | null>(null);
  const [etude, setEtude] = useState<Etude | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [participantState, setParticipantState] = useState<ParticipantState>({
    currentModuleIndex: 0,
    currentQuestionIndex: 0,
    responses: [],
    isCompleted: false
  });
  const [currentResponse, setCurrentResponse] = useState('');
  const [isSimulationStarted, setIsSimulationStarted] = useState(false);

  useEffect(() => {
    const session = SessionStorage.get();
    if (session) {
      setChercheur(session.chercheur);
      const etudes = StudyStorage.getAllByResearcher(session.chercheur.id);
      const foundEtude = etudes.find(e => e.id === etudeId);
      setEtude(foundEtude || null);
    }
    setIsLoading(false);
  }, [etudeId]);

  const getCurrentModule = (): Module | null => {
    if (!etude || participantState.currentModuleIndex >= etude.protocole.modules.length) {
      return null;
    }
    return etude.protocole.modules[participantState.currentModuleIndex];
  };

  const getCurrentQuestion = (): Question | null => {
    const currentModule = getCurrentModule();
    if (!currentModule || participantState.currentQuestionIndex >= currentModule.questions.length) {
      return null;
    }
    return currentModule.questions[participantState.currentQuestionIndex];
  };

  const evaluateConditions = (question: Question): boolean => {
    if (!question.conditions || question.conditions.length === 0) {
      return true; // Aucune condition = afficher la question
    }

    // Évaluer toutes les conditions (logique ET)
    return question.conditions.every(condition => {
      const sourceResponse = participantState.responses.find(r => r.questionId === condition.questionSourceId);
      if (!sourceResponse) return false;

      const responseValue = sourceResponse.response.toLowerCase();
      const conditionValue = condition.valeur.toLowerCase();

      switch (condition.operateur) {
        case 'egal':
          return responseValue === conditionValue;
        case 'different':
          return responseValue !== conditionValue;
        case 'contient':
          return responseValue.includes(conditionValue);
        case 'superieur':
          return parseFloat(responseValue) > parseFloat(conditionValue);
        case 'inferieur':
          return parseFloat(responseValue) < parseFloat(conditionValue);
        default:
          return false;
      }
    });
  };

  const findNextValidQuestion = (): { moduleIndex: number; questionIndex: number } | null => {
    let moduleIndex = participantState.currentModuleIndex;
    let questionIndex = participantState.currentQuestionIndex + 1;

    while (moduleIndex < (etude?.protocole.modules.length || 0)) {
      const module = etude?.protocole.modules[moduleIndex];
      if (!module) break;

      while (questionIndex < module.questions.length) {
        const question = module.questions[questionIndex];
        if (evaluateConditions(question)) {
          return { moduleIndex, questionIndex };
        }
        questionIndex++;
      }

      moduleIndex++;
      questionIndex = 0;
    }

    return null;
  };

  const handleResponseSubmit = () => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion || !currentResponse.trim()) return;

    const newResponse: ParticipantResponse = {
      questionId: currentQuestion.id,
      response: currentResponse,
      timestamp: new Date()
    };

    const updatedResponses = [...participantState.responses, newResponse];
    
    // Vérifier les conditions de la question actuelle pour déterminer la suite
    const conditions = currentQuestion.conditions || [];
    let shouldContinue = true;
    let nextDestination: { moduleIndex?: number; questionIndex?: number } | null = null;

    for (const condition of conditions) {
      const sourceResponse = updatedResponses.find(r => r.questionId === condition.questionSourceId);
      if (sourceResponse) {
        const responseValue = sourceResponse.response.toLowerCase();
        const conditionValue = condition.valeur.toLowerCase();
        let conditionMet = false;

        switch (condition.operateur) {
          case 'egal':
            conditionMet = responseValue === conditionValue;
            break;
          case 'different':
            conditionMet = responseValue !== conditionValue;
            break;
          case 'contient':
            conditionMet = responseValue.includes(conditionValue);
            break;
          case 'superieur':
            conditionMet = parseFloat(responseValue) > parseFloat(conditionValue);
            break;
          case 'inferieur':
            conditionMet = parseFloat(responseValue) < parseFloat(conditionValue);
            break;
        }

        const actionToTake = conditionMet ? condition.actionVrai : condition.actionFaux;
        const destination = conditionMet ? condition.destinationVrai : condition.destinationFaux;

        if (actionToTake === 'terminer') {
          setParticipantState(prev => ({
            ...prev,
            responses: updatedResponses,
            isCompleted: true
          }));
          setCurrentResponse('');
          return;
        } else if (actionToTake === 'aller_a_question' && destination) {
          // Trouver l'index de la question de destination
          for (let modIndex = 0; modIndex < (etude?.protocole.modules.length || 0); modIndex++) {
            const module = etude?.protocole.modules[modIndex];
            if (module) {
              const qIndex = module.questions.findIndex(q => q.id === destination);
              if (qIndex !== -1) {
                nextDestination = { moduleIndex: modIndex, questionIndex: qIndex };
                shouldContinue = false;
                break;
              }
            }
          }
        } else if (actionToTake === 'aller_a_module' && destination) {
          // Trouver l'index du module de destination
          const modIndex = etude?.protocole.modules.findIndex(m => m.id === destination);
          if (modIndex !== -1) {
            nextDestination = { moduleIndex: modIndex, questionIndex: 0 };
            shouldContinue = false;
          }
        }
      }
    }

    if (shouldContinue) {
      // Navigation normale vers la prochaine question valide
      const nextQuestion = findNextValidQuestion();
      if (nextQuestion) {
        setParticipantState(prev => ({
          ...prev,
          currentModuleIndex: nextQuestion.moduleIndex,
          currentQuestionIndex: nextQuestion.questionIndex,
          responses: updatedResponses
        }));
      } else {
        // Plus de questions, marquer comme terminé
        setParticipantState(prev => ({
          ...prev,
          responses: updatedResponses,
          isCompleted: true
        }));
      }
    } else if (nextDestination) {
      // Navigation conditionnelle
      setParticipantState(prev => ({
        ...prev,
        currentModuleIndex: nextDestination.moduleIndex || prev.currentModuleIndex,
        currentQuestionIndex: nextDestination.questionIndex || 0,
        responses: updatedResponses
      }));
    }

    setCurrentResponse('');
  };

  const handleStartSimulation = () => {
    setIsSimulationStarted(true);
    setParticipantState({
      currentModuleIndex: 0,
      currentQuestionIndex: 0,
      responses: [],
      isCompleted: false
    });
    setCurrentResponse('');
  };

  const handleResetSimulation = () => {
    setIsSimulationStarted(false);
    setParticipantState({
      currentModuleIndex: 0,
      currentQuestionIndex: 0,
      responses: [],
      isCompleted: false
    });
    setCurrentResponse('');
  };

  const getInputTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'texte': 'Saisie texte',
      'image': 'Upload image',
      'video': 'Upload vidéo',
      'audio': 'Enregistrement audio',
      'fichier': 'Upload fichier',
      'ia': 'Interaction IA'
    };
    return labels[type] || type;
  };

  const getOutputTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'texte_libre': 'Réponse libre',
      'qcm_unique': 'Choix unique',
      'qcm_multiple': 'Choix multiples',
      'video': 'Enregistrement vidéo',
      'audio': 'Enregistrement audio',
      'fichier': 'Upload fichier',
      'ia': 'Réponse IA'
    };
    return labels[type] || type;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl text-gray-800 dark:text-gray-200">Chargement...</div>
      </div>
    );
  }

  if (!chercheur || !etude) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl text-red-600 dark:text-red-400">Étude non trouvée</div>
      </div>
    );
  }

  const currentModule = getCurrentModule();
  const currentQuestion = getCurrentQuestion();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Simulation Participant
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{etude.nom}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {isSimulationStarted && (
              <button
                onClick={handleResetSimulation}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Recommencer</span>
              </button>
            )}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Mode test - Vue participant
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {!isSimulationStarted ? (
          // Page d'accueil de la simulation
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <Play className="w-16 h-16 mx-auto text-blue-600 dark:text-blue-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Testez votre protocole
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Visualisez l'expérience participant pour valider votre protocole de recherche
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Aperçu du protocole
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {etude.protocole.modules.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Modules</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {etude.protocole.modules.reduce((total, m) => total + m.questions.length, 0)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Questions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {etude.protocole.modules.reduce((total, m) => 
                      total + m.questions.reduce((qTotal, q) => qTotal + (q.conditions?.length || 0), 0), 0
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Conditions</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartSimulation}
              className="flex items-center space-x-2 mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              <Play className="w-5 h-5" />
              <span>Commencer la simulation</span>
            </button>
          </div>
        ) : participantState.isCompleted ? (
          // Page de fin
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <Check className="w-16 h-16 mx-auto text-green-600 dark:text-green-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Protocole terminé !
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Vous avez terminé la simulation du protocole de recherche.
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Résumé des réponses
              </h3>
              <div className="space-y-3 text-left max-w-2xl mx-auto">
                {participantState.responses.map((response, index) => {
                  const question = etude.protocole.modules
                    .flatMap(m => m.questions)
                    .find(q => q.id === response.questionId);
                  return (
                    <div key={index} className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {question?.titre || 'Question supprimée'}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {response.response}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleResetSimulation}
              className="flex items-center space-x-2 mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Recommencer la simulation</span>
            </button>
          </div>
        ) : (
          // Interface de question
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            {/* Progress bar */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Module {participantState.currentModuleIndex + 1}: {currentModule?.nom}</span>
                <span>
                  Question {participantState.currentQuestionIndex + 1} sur {currentModule?.questions.length || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${currentModule ? ((participantState.currentQuestionIndex + 1) / currentModule.questions.length) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>

            {/* Question content */}
            <div className="p-8">
              {currentQuestion ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {currentQuestion.titre}
                      {currentQuestion.obligatoire && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </h2>
                    {currentQuestion.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {currentQuestion.description}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                        {getInputTypeLabel(currentQuestion.typeInput)}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                      <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                        {getOutputTypeLabel(currentQuestion.typeOutput)}
                      </span>
                    </div>
                  </div>

                  {/* Input simulation */}
                  <div className="space-y-4">
                    {currentQuestion.typeOutput === 'qcm_unique' ? (
                      <div className="space-y-2">
                        {['Option A', 'Option B', 'Option C'].map((option, index) => (
                          <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                            <input
                              type="radio"
                              name="qcm_response"
                              value={option}
                              checked={currentResponse === option}
                              onChange={(e) => setCurrentResponse(e.target.value)}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-900 dark:text-white">{option}</span>
                          </label>
                        ))}
                      </div>
                    ) : currentQuestion.typeOutput === 'qcm_multiple' ? (
                      <div className="space-y-2">
                        {['Option A', 'Option B', 'Option C'].map((option, index) => (
                          <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                            <input
                              type="checkbox"
                              value={option}
                              onChange={(e) => {
                                const currentValues = currentResponse.split(',').filter(v => v.trim());
                                if (e.target.checked) {
                                  setCurrentResponse([...currentValues, option].join(', '));
                                } else {
                                  setCurrentResponse(currentValues.filter(v => v !== option).join(', '));
                                }
                              }}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-900 dark:text-white">{option}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <textarea
                        value={currentResponse}
                        onChange={(e) => setCurrentResponse(e.target.value)}
                        placeholder="Saisissez votre réponse ici..."
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                        rows={4}
                      />
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end pt-6">
                    <button
                      onClick={handleResponseSubmit}
                      disabled={!currentResponse.trim()}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      <span>Continuer</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600 dark:text-gray-400">
                    Aucune question disponible dans ce module.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantSimulationPage; 