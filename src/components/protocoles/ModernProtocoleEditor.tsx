'use client';

import React, { useState, useEffect } from 'react';
import { 
  Etude, 
  Module, 
  Question, 
  CritereDemographique, 
  ObjectifRecrutement,
  TypeInput,
  TypeOutput 
} from '@/types';
import { 
  getResearcher, 
  saveStudy, 
  generateId 
} from '@/lib/storage';
import ModernQuestionEditor from '@/components/questions/ModernQuestionEditor';
import { 
  Save, 
  Settings, 
  Users, 
  Target, 
  Plus, 
  Trash2, 
  Eye, 
  ArrowLeft, 
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
  Layers,
  HelpCircle,
  PlusCircle
} from 'lucide-react';
import ModuleCard from './ModuleCard';
import CritereCard from './CritereCard';
import { EmptyState, InlineAddButton, PrimaryAddButton } from '../shared/UnifiedComponents';

interface ModernProtocoleEditorProps {
  etude: Etude;
  onEtudeChange: (etude: Etude) => void;
  onBack?: () => void;
}

export default function ModernProtocoleEditor({ 
  etude, 
  onEtudeChange, 
  onBack 
}: ModernProtocoleEditorProps) {
  const [currentTab, setCurrentTab] = useState<'general' | 'modules' | 'recrutement'>('general');
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save toutes les 30 secondes si il y a des changements
  useEffect(() => {
    const interval = setInterval(async () => {
      if (etude.titre && etude.description) {
        await handleSave(false); // Save silencieux
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [etude]);

  const handleSave = async (showNotification = true) => {
    setIsSaving(true);
    try {
      const researcher = getResearcher();
      if (!researcher) throw new Error('Chercheur non trouvé');

      await saveStudy(etude, researcher.id);
      setLastSaved(new Date());
      
      if (showNotification) {
        // Ici vous pourriez ajouter une notification toast
        console.log('Étude sauvegardée avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateEtude = (updates: Partial<Etude>) => {
    onEtudeChange({ ...etude, ...updates });
  };

  const addModule = () => {
    const newModule: Module = {
      id: generateId(),
      titre: '',
      description: '',
      ordre: etude.modules.length + 1,
      questions: [],
      conditions: []
    };

    updateEtude({
      modules: [...etude.modules, newModule]
    });

    // Expand le nouveau module
    setExpandedModules(prev => new Set([...prev, newModule.id]));
  };

  const updateModule = (moduleId: string, updates: Partial<Module>) => {
    const updatedModules = etude.modules.map(module =>
      module.id === moduleId ? { ...module, ...updates } : module
    );
    updateEtude({ modules: updatedModules });
  };

  const deleteModule = (moduleId: string) => {
    const filteredModules = etude.modules
      .filter(module => module.id !== moduleId)
      .map((module, index) => ({ ...module, ordre: index + 1 }));
    
    updateEtude({ modules: filteredModules });
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      newSet.delete(moduleId);
      return newSet;
    });
  };

  const toggleModuleExpansion = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const updateModuleQuestions = (moduleId: string, questions: Question[]) => {
    updateModule(moduleId, { questions });
  };

  const addCritere = () => {
    const newCritere: CritereDemographique = {
      id: generateId(),
      nom: '',
      type: 'age',
      valeurMin: '',
      valeurMax: '',
      valeursAcceptees: [],
      obligatoire: false
    };

    updateEtude({
      criteresRecrutement: [...(etude.criteresRecrutement || []), newCritere]
    });
  };

  const updateCritere = (critereId: string, updates: Partial<CritereDemographique>) => {
    const updatedCriteres = (etude.criteresRecrutement || []).map(critere =>
      critere.id === critereId ? { ...critere, ...updates } : critere
    );
    updateEtude({ criteresRecrutement: updatedCriteres });
  };

  const deleteCritere = (critereId: string) => {
    const filteredCriteres = (etude.criteresRecrutement || []).filter(
      critere => critere.id !== critereId
    );
    updateEtude({ criteresRecrutement: filteredCriteres });
  };

  const getCompletionStatus = () => {
    const hasBasicInfo = etude.titre && etude.description;
    const hasModules = etude.modules.length > 0;
    const hasQuestions = etude.modules.some(module => module.questions.length > 0);
    const hasValidQuestions = etude.modules.every(module => 
      module.questions.every(q => q.titre.trim() !== '')
    );

    return {
      basicInfo: hasBasicInfo,
      modules: hasModules,
      questions: hasQuestions,
      validQuestions: hasValidQuestions,
      overall: hasBasicInfo && hasModules && hasQuestions && hasValidQuestions
    };
  };

  const completion = getCompletionStatus();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {etude.titre || 'Nouvelle étude'}
                </h1>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>
                    {completion.overall ? '✓ Prête' : '⚠️ Configuration incomplète'}
                  </span>
                  {lastSaved && (
                    <>
                      <span>•</span>
                      <span>
                        Sauvegardé à {lastSaved.toLocaleTimeString()}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleSave(true)}
                disabled={isSaving}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setCurrentTab('general')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentTab === 'general'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Informations générales</span>
                {completion.basicInfo && <CheckCircle className="w-4 h-4 text-green-500" />}
              </div>
            </button>

            <button
              onClick={() => setCurrentTab('modules')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentTab === 'modules'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4" />
                <span>Modules & Questions</span>
                {completion.modules && completion.questions && completion.validQuestions && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
            </button>

            <button
              onClick={() => setCurrentTab('recrutement')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentTab === 'recrutement'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Recrutement</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'general' && (
          <GeneralTab etude={etude} onEtudeChange={updateEtude} />
        )}

        {currentTab === 'modules' && (
          <ModulesTab
            etude={etude}
            onAddModule={addModule}
            onUpdateModule={updateModule}
            onDeleteModule={deleteModule}
            onUpdateModuleQuestions={updateModuleQuestions}
            expandedModules={expandedModules}
            onToggleModuleExpansion={toggleModuleExpansion}
          />
        )}

        {currentTab === 'recrutement' && (
          <RecrutementTab
            etude={etude}
            onEtudeChange={updateEtude}
            onAddCritere={addCritere}
            onUpdateCritere={updateCritere}
            onDeleteCritere={deleteCritere}
          />
        )}
      </div>
    </div>
  );
}

// Composant onglet informations générales
interface GeneralTabProps {
  etude: Etude;
  onEtudeChange: (updates: Partial<Etude>) => void;
}

function GeneralTab({ etude, onEtudeChange }: GeneralTabProps) {
  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Informations de base
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Titre de l'étude
            </label>
            <input
              type="text"
              value={etude.titre}
              onChange={(e) => onEtudeChange({ titre: e.target.value })}
              placeholder="Ex: Étude sur les comportements d'achat en ligne"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description et objectifs
            </label>
            <textarea
              value={etude.description}
              onChange={(e) => onEtudeChange({ description: e.target.value })}
              placeholder="Décrivez les objectifs de votre étude, la méthodologie et les résultats attendus..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date de début
              </label>
              <input
                type="date"
                value={etude.dateDebut}
                onChange={(e) => onEtudeChange({ dateDebut: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date de fin
              </label>
              <input
                type="date"
                value={etude.dateFin}
                onChange={(e) => onEtudeChange({ dateFin: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={etude.statut === 'active'}
                onChange={(e) => onEtudeChange({ 
                  statut: e.target.checked ? 'active' : 'brouillon' 
                })}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Activer l'étude (les participants pourront y accéder)
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant onglet modules
interface ModulesTabProps {
  etude: Etude;
  onAddModule: () => void;
  onUpdateModule: (moduleId: string, updates: Partial<Module>) => void;
  onDeleteModule: (moduleId: string) => void;
  onUpdateModuleQuestions: (moduleId: string, questions: Question[]) => void;
  expandedModules: Set<string>;
  onToggleModuleExpansion: (moduleId: string) => void;
}

function ModulesTab({
  etude,
  onAddModule,
  onUpdateModule,
  onDeleteModule,
  onUpdateModuleQuestions,
  expandedModules,
  onToggleModuleExpansion
}: ModulesTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Modules du protocole
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {etude.modules.length} module(s) • Cliquez sur un module pour l'éditer
          </p>
        </div>
      </div>

      {etude.modules.length === 0 ? (
        <EmptyState
          icon={<Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />}
          title="Aucun module"
          description="Commencez par ajouter votre premier module"
          actionLabel="Créer le premier module"
          onAction={onAddModule}
        />
      ) : (
        <div className="space-y-4">
          {etude.modules.map((module, index) => (
            <div key={module.id} className="relative">
              <ModuleCard
                module={module}
                index={index}
                isExpanded={expandedModules.has(module.id)}
                onToggleExpansion={() => onToggleModuleExpansion(module.id)}
                onUpdate={(updates) => onUpdateModule(module.id, updates)}
                onDelete={() => onDeleteModule(module.id)}
                onUpdateQuestions={(questions) => onUpdateModuleQuestions(module.id, questions)}
              />
              
              {/* Bouton d'ajout inline entre les modules */}
              <InlineAddButton
                onClick={onAddModule}
                label="Ajouter un module"
              />
            </div>
          ))}
          
          {/* Bouton d'ajout final */}
          <PrimaryAddButton
            onClick={onAddModule}
            label="Ajouter un module"
          />
        </div>
      )}
    </div>
  );
}

// Composant onglet recrutement
interface RecrutementTabProps {
  etude: Etude;
  onEtudeChange: (updates: Partial<Etude>) => void;
  onAddCritere: () => void;
  onUpdateCritere: (critereId: string, updates: Partial<CritereDemographique>) => void;
  onDeleteCritere: (critereId: string) => void;
}

function RecrutementTab({
  etude,
  onEtudeChange,
  onAddCritere,
  onUpdateCritere,
  onDeleteCritere
}: RecrutementTabProps) {
  return (
    <div className="space-y-8">
      {/* Objectifs de recrutement */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Objectifs de recrutement
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre de participants cible
            </label>
            <input
              type="number"
              value={etude.objectifRecrutement?.nombreParticipants || ''}
              onChange={(e) => onEtudeChange({
                objectifRecrutement: {
                  ...etude.objectifRecrutement,
                  nombreParticipants: parseInt(e.target.value) || 0,
                  dateEcheance: etude.objectifRecrutement?.dateEcheance || ''
                }
              })}
              placeholder="100"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date limite de recrutement
            </label>
            <input
              type="date"
              value={etude.objectifRecrutement?.dateEcheance || ''}
              onChange={(e) => onEtudeChange({
                objectifRecrutement: {
                  ...etude.objectifRecrutement,
                  numberOfParticipants: etude.objectifRecrutement?.nombreParticipants || 0,
                  dateEcheance: e.target.value
                }
              })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Critères démographiques */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Critères de sélection
          </h3>
          <button
            onClick={onAddCritere}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un critère</span>
          </button>
        </div>

        {(!etude.criteresRecrutement || etude.criteresRecrutement.length === 0) ? (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucun critère défini
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Ajoutez des critères pour cibler votre population d'étude
            </p>
            <button
              onClick={onAddCritere}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ajouter le premier critère
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {etude.criteresRecrutement.map((critere) => (
              <CritereCard
                key={critere.id}
                critere={critere}
                onUpdate={(updates) => onUpdateCritere(critere.id, updates)}
                onDelete={() => onDeleteCritere(critere.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 