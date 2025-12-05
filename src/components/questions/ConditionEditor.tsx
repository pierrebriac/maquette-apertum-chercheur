'use client';

import React, { useState } from 'react';
import { Condition, Question, Module } from '@/types';
import { generateId } from '@/lib/storage';
import { Plus, X, ArrowRight, Settings } from 'lucide-react';

interface ConditionEditorProps {
  conditions: Condition[];
  availableQuestions: Question[];
  availableModules: Module[];
  currentQuestionId?: string;
  onConditionsChange: (conditions: Condition[]) => void;
}

export default function ConditionEditor({ 
  conditions, 
  availableQuestions, 
  availableModules,
  currentQuestionId,
  onConditionsChange 
}: ConditionEditorProps) {
  const [showAddCondition, setShowAddCondition] = useState(false);

  const handleAddCondition = () => {
    const newCondition: Condition = {
      id: generateId(),
      questionSourceId: '',
      operateur: 'egal',
      valeur: '',
      actionVrai: 'continuer',
      actionFaux: 'continuer',
      destinationVrai: undefined,
      destinationFaux: undefined
    };

    onConditionsChange([...conditions, newCondition]);
    setShowAddCondition(false);
  };

  const handleUpdateCondition = (conditionId: string, updatedCondition: Condition) => {
    const updatedConditions = conditions.map(c => 
      c.id === conditionId ? updatedCondition : c
    );
    onConditionsChange(updatedConditions);
  };

  const handleDeleteCondition = (conditionId: string) => {
    const updatedConditions = conditions.filter(c => c.id !== conditionId);
    onConditionsChange(updatedConditions);
  };

  // Filtrer les questions disponibles (exclure la question actuelle)
  const questionsFiltered = availableQuestions.filter(q => q.id !== currentQuestionId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Logique conditionnelle
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Définissez des conditions pour afficher cette question ou diriger le parcours
          </p>
        </div>
        <button
          onClick={() => setShowAddCondition(true)}
          className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-3 h-3" />
          <span>Condition</span>
        </button>
      </div>

      {conditions.length === 0 ? (
        <div className="text-center py-4 text-gray-500 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <Settings className="w-6 h-6 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">Aucune condition définie</p>
          <p className="text-xs">Cette question s'affichera toujours</p>
        </div>
      ) : (
        <div className="space-y-3">
          {conditions.map((condition, index) => (
            <ConditionCard
              key={condition.id}
              condition={condition}
              availableQuestions={questionsFiltered}
              availableModules={availableModules}
              onUpdate={(updatedCondition) => handleUpdateCondition(condition.id, updatedCondition)}
              onDelete={() => handleDeleteCondition(condition.id)}
              index={index}
            />
          ))}
        </div>
      )}

      {showAddCondition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Ajouter une condition
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Une nouvelle condition sera créée et pourra être configurée.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddCondition(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAddCondition}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ConditionCardProps {
  condition: Condition;
  availableQuestions: Question[];
  availableModules: Module[];
  onUpdate: (condition: Condition) => void;
  onDelete: () => void;
  index: number;
}

function ConditionCard({ 
  condition, 
  availableQuestions, 
  availableModules,
  onUpdate, 
  onDelete, 
  index 
}: ConditionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(condition);

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(condition);
    setIsEditing(false);
  };

  const getQuestionTitle = (questionId: string) => {
    const question = availableQuestions.find(q => q.id === questionId);
    return question ? question.titre : 'Question supprimée';
  };

  const getModuleTitle = (moduleId: string) => {
    const module = availableModules.find(m => m.id === moduleId);
    return module ? module.nom : 'Module supprimé';
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      'continuer': 'Continuer',
      'aller_a_question': 'Aller à la question',
      'aller_a_module': 'Aller au module',
      'terminer': 'Terminer le protocole'
    };
    return labels[action] || action;
  };

  const getOperatorLabel = (operator: string) => {
    const labels: Record<string, string> = {
      'egal': 'égal à',
      'different': 'différent de',
      'contient': 'contient',
      'superieur': 'supérieur à',
      'inferieur': 'inférieur à'
    };
    return labels[operator] || operator;
  };

  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
          Condition {index + 1}
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            {isEditing ? 'Aperçu' : 'Modifier'}
          </button>
          <button
            onClick={onDelete}
            className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            Supprimer
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Si la réponse à la question
            </label>
            <select
              value={editData.questionSourceId}
              onChange={(e) => setEditData(prev => ({ ...prev, questionSourceId: e.target.value }))}
              className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="">Sélectionner une question</option>
              {availableQuestions.map(q => (
                <option key={q.id} value={q.id}>{q.titre}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Opérateur
              </label>
              <select
                value={editData.operateur}
                onChange={(e) => setEditData(prev => ({ ...prev, operateur: e.target.value as any }))}
                className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="egal">égal à</option>
                <option value="different">différent de</option>
                <option value="contient">contient</option>
                <option value="superieur">supérieur à</option>
                <option value="inferieur">inférieur à</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Valeur
              </label>
              <input
                type="text"
                value={editData.valeur}
                onChange={(e) => setEditData(prev => ({ ...prev, valeur: e.target.value }))}
                placeholder="Valeur de comparaison"
                className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-green-700 dark:text-green-400 mb-1">
                Si VRAI, alors
              </label>
              <select
                value={editData.actionVrai}
                onChange={(e) => setEditData(prev => ({ 
                  ...prev, 
                  actionVrai: e.target.value as any,
                  destinationVrai: e.target.value === 'continuer' ? undefined : prev.destinationVrai
                }))}
                className="w-full px-2 py-1 text-xs border border-green-300 dark:border-green-600 rounded focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="continuer">Continuer</option>
                <option value="aller_a_question">Aller à une question</option>
                <option value="aller_a_module">Aller à un module</option>
                <option value="terminer">Terminer</option>
              </select>
              {(editData.actionVrai === 'aller_a_question' || editData.actionVrai === 'aller_a_module') && (
                <select
                  value={editData.destinationVrai || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, destinationVrai: e.target.value }))}
                  className="w-full px-2 py-1 text-xs border border-green-300 dark:border-green-600 rounded focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white mt-1"
                >
                  <option value="">Sélectionner destination</option>
                  {editData.actionVrai === 'aller_a_question' && 
                    availableQuestions.map(q => (
                      <option key={q.id} value={q.id}>{q.titre}</option>
                    ))
                  }
                  {editData.actionVrai === 'aller_a_module' && 
                    availableModules.map(m => (
                      <option key={m.id} value={m.id}>{m.nom}</option>
                    ))
                  }
                </select>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-red-700 dark:text-red-400 mb-1">
                Si FAUX, alors
              </label>
              <select
                value={editData.actionFaux}
                onChange={(e) => setEditData(prev => ({ 
                  ...prev, 
                  actionFaux: e.target.value as any,
                  destinationFaux: e.target.value === 'continuer' ? undefined : prev.destinationFaux
                }))}
                className="w-full px-2 py-1 text-xs border border-red-300 dark:border-red-600 rounded focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="continuer">Continuer</option>
                <option value="aller_a_question">Aller à une question</option>
                <option value="aller_a_module">Aller à un module</option>
                <option value="terminer">Terminer</option>
              </select>
              {(editData.actionFaux === 'aller_a_question' || editData.actionFaux === 'aller_a_module') && (
                <select
                  value={editData.destinationFaux || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, destinationFaux: e.target.value }))}
                  className="w-full px-2 py-1 text-xs border border-red-300 dark:border-red-600 rounded focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-white mt-1"
                >
                  <option value="">Sélectionner destination</option>
                  {editData.actionFaux === 'aller_a_question' && 
                    availableQuestions.map(q => (
                      <option key={q.id} value={q.id}>{q.titre}</option>
                    ))
                  }
                  {editData.actionFaux === 'aller_a_module' && 
                    availableModules.map(m => (
                      <option key={m.id} value={m.id}>{m.nom}</option>
                    ))
                  }
                </select>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-xs text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              Sauvegarder
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-xs text-gray-700 dark:text-gray-300">
            <span className="font-medium">Si</span> "{getQuestionTitle(condition.questionSourceId)}" 
            <span className="font-medium"> {getOperatorLabel(condition.operateur)} </span>
            "{condition.valeur}"
          </div>
          
          <div className="flex items-center space-x-2 text-xs">
            <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
              <ArrowRight className="w-3 h-3" />
              <span>VRAI: {getActionLabel(condition.actionVrai)}</span>
              {condition.destinationVrai && (
                <span className="text-gray-600 dark:text-gray-400">
                  → {condition.actionVrai === 'aller_a_question' 
                     ? getQuestionTitle(condition.destinationVrai)
                     : getModuleTitle(condition.destinationVrai)}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-xs">
            <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
              <ArrowRight className="w-3 h-3" />
              <span>FAUX: {getActionLabel(condition.actionFaux)}</span>
              {condition.destinationFaux && (
                <span className="text-gray-600 dark:text-gray-400">
                  → {condition.actionFaux === 'aller_a_question' 
                     ? getQuestionTitle(condition.destinationFaux)
                     : getModuleTitle(condition.destinationFaux)}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 