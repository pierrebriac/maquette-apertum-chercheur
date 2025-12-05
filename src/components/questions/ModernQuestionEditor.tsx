'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Question, TypeInput, TypeOutput, OptionQCM } from '@/types';
import { generateId, saveToStorage, loadFromStorage } from '@/lib/storage';
import { EmptyState, InlineAddButton, PrimaryAddButton } from '../shared/UnifiedComponents';
import { 
  Plus, 
  Trash2, 
  Copy, 
  GripVertical, 
  Settings,
  Eye,
  Play,
  Image as ImageIcon,
  Video,
  Mic,
  FileText,
  Upload,
  Bot,
  CheckSquare,
  Circle,
  ChevronDown,
  ChevronUp,
  Music,
  Brain,
  MessageSquare,
  Check,
  AlertCircle,
  Loader
} from 'lucide-react';

interface ModernQuestionEditorProps {
  questions: Question[];
  onQuestionsChange: (questions: Question[]) => void;
}

interface QuestionFormData extends Omit<Question, 'id' | 'ordre' | 'conditions' | 'mediaInput'> {
  options?: OptionQCM[];
  mediaUrl?: string;
  iaModel?: string;
  iaApiKey?: string;
  iaInstructions?: string;
}

export default function ModernQuestionEditor({ questions, onQuestionsChange }: ModernQuestionEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addNewQuestion = () => {
    const newQuestion: Question = {
      id: generateId(),
      titre: '',
      description: '',
      ordre: questions.length + 1,
      obligatoire: false,
      typeInput: 'texte',
      typeOutput: 'texte_libre',
      conditions: [],
      mediaInput: []
    };

    onQuestionsChange([...questions, newQuestion]);
  };

  const addQuestionAtIndex = (insertIndex: number) => {
    const newQuestion: Question = {
      id: generateId(),
      titre: '',
      description: '',
      ordre: insertIndex + 1,
      obligatoire: false,
      typeInput: 'texte',
      typeOutput: 'texte_libre',
      conditions: [],
      mediaInput: []
    };

    const newQuestions = [...questions];
    newQuestions.splice(insertIndex, 0, newQuestion);
    
    // Remettre à jour les ordres
    const reorderedQuestions = newQuestions.map((q, i) => ({ ...q, ordre: i + 1 }));
    onQuestionsChange(reorderedQuestions);
  };

  const updateQuestion = (index: number, updatedData: Partial<QuestionFormData>) => {
    const updatedQuestions = questions.map((q, i) => {
      if (i === index) {
        const updated = { ...q, ...updatedData };
        // Si c'est un QCM et qu'on a des options, les stocker dans les mediaInput pour simuler
        if ((updated.typeOutput === 'qcm_unique' || updated.typeOutput === 'qcm_multiple') && updatedData.options) {
          updated.mediaInput = updatedData.options.map(option => ({
            id: option.id,
            type: 'texte',
            contenu: option.texte,
            nom: option.valeur
          }));
        }
        return updated;
      }
      return q;
    });
    onQuestionsChange(updatedQuestions);
  };

  const deleteQuestion = (index: number) => {
    const updatedQuestions = questions
      .filter((_, i) => i !== index)
      .map((q, i) => ({ ...q, ordre: i + 1 }));
    onQuestionsChange(updatedQuestions);
  };

  const duplicateQuestion = (index: number) => {
    const questionToDuplicate = questions[index];
    const duplicated: Question = {
      ...questionToDuplicate,
      id: generateId(),
      titre: `${questionToDuplicate.titre} (copie)`,
      ordre: questions.length + 1
    };
    onQuestionsChange([...questions, duplicated]);
  };

  const moveQuestion = (fromIndex: number, toIndex: number) => {
    const newQuestions = [...questions];
    const [movedQuestion] = newQuestions.splice(fromIndex, 1);
    newQuestions.splice(toIndex, 0, movedQuestion);
    
    // Remettre à jour les ordres
    const reorderedQuestions = newQuestions.map((q, i) => ({ ...q, ordre: i + 1 }));
    onQuestionsChange(reorderedQuestions);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Questions</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {questions.length} question(s) • Cliquez pour éditer
          </p>
        </div>
      </div>

      {questions.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-12 h-12" />}
          title="Aucune question"
          description="Commencez par ajouter votre première question"
          actionLabel="Créer la première question"
          onAction={addNewQuestion}
        />
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={question.id} className="relative">
              <QuestionCard
                question={question}
                index={index}
                onUpdate={(updatedData) => updateQuestion(index, updatedData)}
                onDelete={() => deleteQuestion(index)}
                onDuplicate={() => duplicateQuestion(index)}
                onMove={moveQuestion}
                draggedIndex={draggedIndex}
                setDraggedIndex={setDraggedIndex}
              />
              
              {/* Bouton d'ajout inline entre les questions */}
              <InlineAddButton
                onClick={() => addQuestionAtIndex(index + 1)}
                label="Ajouter une question"
              />
            </div>
          ))}
          
          {/* Bouton d'ajout final */}
          <div className="flex justify-center pt-4">
            <PrimaryAddButton
              onClick={addNewQuestion}
              label="Ajouter une question"
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface QuestionCardProps {
  question: Question;
  index: number;
  onUpdate: (data: Partial<QuestionFormData>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  draggedIndex: number | null;
  setDraggedIndex: (index: number | null) => void;
}

// Fonction utilitaire pour valider les URLs
const validateUrl = (url: string, type: 'image' | 'video' | 'audio'): { isValid: boolean; message?: string } => {
  if (!url.trim()) return { isValid: false, message: 'URL requise' };
  
  try {
    const urlObj = new URL(url);
    
    if (type === 'image') {
      const imageExtensions = /\.(jpg|jpeg|png|gif|svg|webp)$/i;
      if (!imageExtensions.test(urlObj.pathname)) {
        return { isValid: false, message: 'Format d\'image non supporté (JPG, PNG, GIF, SVG, WebP)' };
      }
    } else if (type === 'video') {
      const isYoutube = urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be');
      const isVimeo = urlObj.hostname.includes('vimeo.com');
      const videoExtensions = /\.(mp4|webm|ogg)$/i;
      
      if (!isYoutube && !isVimeo && !videoExtensions.test(urlObj.pathname)) {
        return { isValid: false, message: 'URL vidéo non supportée (YouTube, Vimeo, MP4, WebM, OGG)' };
      }
    } else if (type === 'audio') {
      const audioExtensions = /\.(mp3|wav|ogg|m4a)$/i;
      if (!audioExtensions.test(urlObj.pathname)) {
        return { isValid: false, message: 'Format audio non supporté (MP3, WAV, OGG, M4A)' };
      }
    }
    
    return { isValid: true };
  } catch {
    return { isValid: false, message: 'URL invalide' };
  }
};

// Fonction utilitaire pour tester une clé API IA (simulation)
const testApiKey = async (apiKey: string, model: string): Promise<{ success: boolean; message: string }> => {
  // Simulation d'un test d'API
  return new Promise((resolve) => {
    setTimeout(() => {
      if (apiKey.length < 10) {
        resolve({ success: false, message: 'Clé API trop courte' });
      } else if (!apiKey.startsWith('sk-') && !apiKey.startsWith('claude-') && !apiKey.startsWith('gem-')) {
        resolve({ success: false, message: 'Format de clé API invalide' });
      } else {
        resolve({ success: true, message: 'Clé API valide' });
      }
    }, 1500);
  });
};

function QuestionCard({ 
  question, 
  index, 
  onUpdate, 
  onDelete, 
  onDuplicate, 
  onMove,
  draggedIndex,
  setDraggedIndex 
}: QuestionCardProps) {
  const [isEditing, setIsEditing] = useState(!question.titre); // Nouvelle question = mode édition
  const [showPreview, setShowPreview] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaValidation, setMediaValidation] = useState<{ isValid: boolean; message?: string }>({ isValid: true });
  const [iaConfig, setIaConfig] = useState({
    model: 'gpt-4',
    apiKey: '',
    instructions: ''
  });
  const [apiKeyValidation, setApiKeyValidation] = useState<{ 
    status: 'idle' | 'testing' | 'success' | 'error'; 
    message: string 
  }>({ status: 'idle', message: '' });
  
  const [options, setOptions] = useState<OptionQCM[]>(() => {
    // Récupérer les options depuis mediaInput si c'est un QCM
    if (question.typeOutput === 'qcm_unique' || question.typeOutput === 'qcm_multiple') {
      return question.mediaInput.map(media => ({
        id: media.id,
        texte: media.contenu,
        valeur: media.nom
      }));
    }
    return [
      { id: generateId(), texte: 'Option 1', valeur: 'option1' },
      { id: generateId(), texte: 'Option 2', valeur: 'option2' }
    ];
  });

  // Validation URL en temps réel
  useEffect(() => {
    if (mediaUrl && ['image', 'video', 'audio'].includes(question.typeInput)) {
      const validation = validateUrl(mediaUrl, question.typeInput as 'image' | 'video' | 'audio');
      setMediaValidation(validation);
    }
  }, [mediaUrl, question.typeInput]);

  const getInputIcon = (type: TypeInput) => {
    const icons = {
      texte: FileText,
      image: ImageIcon,
      video: Video,
      audio: Mic,
      fichier: Upload,
      ia: Bot
    };
    const IconComponent = icons[type];
    return <IconComponent className="w-4 h-4" />;
  };

  const getOutputIcon = (type: TypeOutput) => {
    const icons = {
      texte_libre: FileText,
      qcm_unique: Circle,
      qcm_multiple: CheckSquare,
      video: Video,
      audio: Mic,
      fichier: Upload,
      ia: Bot
    };
    const IconComponent = icons[type];
    return <IconComponent className="w-4 h-4" />;
  };

  const handleTitleChange = (value: string) => {
    onUpdate({ titre: value });
  };

  const handleDescriptionChange = (value: string) => {
    onUpdate({ description: value });
  };

  const handleTypeChange = (field: 'typeInput' | 'typeOutput', value: TypeInput | TypeOutput) => {
    const updateData: Partial<QuestionFormData> = { [field]: value };
    
    // Si on change vers un QCM, inclure les options
    if (field === 'typeOutput' && (value === 'qcm_unique' || value === 'qcm_multiple')) {
      updateData.options = options;
    }
    
    onUpdate(updateData);
  };

  const handleObligatoireChange = (obligatoire: boolean) => {
    onUpdate({ obligatoire });
  };

  const handleMediaUrlChange = (url: string) => {
    setMediaUrl(url);
    onUpdate({ mediaUrl: url });
  };

  const handleIaConfigChange = (field: keyof typeof iaConfig, value: string) => {
    const newConfig = { ...iaConfig, [field]: value };
    setIaConfig(newConfig);
    onUpdate({ 
      iaModel: newConfig.model,
      iaApiKey: newConfig.apiKey,
      iaInstructions: newConfig.instructions 
    });
  };

  const handleTestApiKey = async () => {
    if (!iaConfig.apiKey.trim()) {
      setApiKeyValidation({ status: 'error', message: 'Veuillez saisir une clé API' });
      return;
    }

    setApiKeyValidation({ status: 'testing', message: 'Test en cours...' });
    
    try {
      const result = await testApiKey(iaConfig.apiKey, iaConfig.model);
      setApiKeyValidation({ 
        status: result.success ? 'success' : 'error', 
        message: result.message 
      });
    } catch (error) {
      setApiKeyValidation({ status: 'error', message: 'Erreur lors du test' });
    }
  };

  const addOption = () => {
    const newOption: OptionQCM = {
      id: generateId(),
      texte: `Option ${options.length + 1}`,
      valeur: `option${options.length + 1}`
    };
    const newOptions = [...options, newOption];
    setOptions(newOptions);
    
    if (question.typeOutput === 'qcm_unique' || question.typeOutput === 'qcm_multiple') {
      onUpdate({ options: newOptions });
    }
  };

  const updateOption = (optionId: string, field: 'texte' | 'valeur', value: string) => {
    const updatedOptions = options.map(opt => 
      opt.id === optionId ? { ...opt, [field]: value } : opt
    );
    setOptions(updatedOptions);
    
    if (question.typeOutput === 'qcm_unique' || question.typeOutput === 'qcm_multiple') {
      onUpdate({ options: updatedOptions });
    }
  };

  const deleteOption = (optionId: string) => {
    const filteredOptions = options.filter(opt => opt.id !== optionId);
    setOptions(filteredOptions);
    
    if (question.typeOutput === 'qcm_unique' || question.typeOutput === 'qcm_multiple') {
      onUpdate({ options: filteredOptions });
    }
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${
        draggedIndex === index ? 'opacity-50' : ''
      } ${isEditing ? 'ring-2 ring-blue-500' : ''}`}
      draggable
      onDragStart={() => setDraggedIndex(index)}
      onDragEnd={() => setDraggedIndex(null)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        if (draggedIndex !== null && draggedIndex !== index) {
          onMove(draggedIndex, index);
        }
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="cursor-move text-gray-400 hover:text-gray-600">
            <GripVertical className="w-5 h-5" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs font-medium">
              Q{index + 1}
            </span>
            {question.obligatoire && (
              <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded text-xs font-medium">
                Obligatoire
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            {getInputIcon(question.typeInput)}
            <span>→</span>
            {getOutputIcon(question.typeOutput)}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Aperçu"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={onDuplicate}
            className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            title="Dupliquer"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isEditing ? (
          <div className="space-y-6">
            {/* Question Title */}
            <div>
              <input
                type="text"
                value={question.titre}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Tapez votre question ici..."
                className="w-full text-lg font-medium border-none outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 pb-2 border-b border-gray-200 dark:border-gray-600 focus:border-blue-500"
                autoFocus={!question.titre}
              />
            </div>

            {/* Question Description */}
            <div>
              <textarea
                value={question.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder="Description ou instructions (optionnel)"
                rows={2}
                className="w-full text-sm border-none outline-none bg-transparent text-gray-600 dark:text-gray-300 placeholder-gray-400 resize-none"
              />
            </div>

            {/* Configuration spécifique selon le type d'entrée avec validation */}
            
            {question.typeInput === 'image' && (
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Configuration Image</h5>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">URL de l'image *</label>
                  <div className="relative">
                    <input
                      type="url"
                      value={mediaUrl}
                      onChange={(e) => handleMediaUrlChange(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className={`w-full px-3 py-2 pr-10 border rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        mediaUrl && !mediaValidation.isValid 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {mediaUrl && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {mediaValidation.isValid ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {mediaUrl && !mediaValidation.isValid && (
                    <p className="text-xs text-red-500 mt-1">{mediaValidation.message}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Formats supportés : JPG, PNG, GIF, SVG, WebP
                  </p>
                </div>
              </div>
            )}

            {question.typeInput === 'video' && (
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Configuration Vidéo</h5>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">URL de la vidéo *</label>
                  <div className="relative">
                    <input
                      type="url"
                      value={mediaUrl}
                      onChange={(e) => handleMediaUrlChange(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... ou https://vimeo.com/..."
                      className={`w-full px-3 py-2 pr-10 border rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        mediaUrl && !mediaValidation.isValid 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {mediaUrl && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {mediaValidation.isValid ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {mediaUrl && !mediaValidation.isValid && (
                    <p className="text-xs text-red-500 mt-1">{mediaValidation.message}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Formats supportés : YouTube, Vimeo, liens directs MP4, WebM, OGG
                  </p>
                </div>
              </div>
            )}

            {question.typeInput === 'audio' && (
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Configuration Audio</h5>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">URL de l'audio *</label>
                  <div className="relative">
                    <input
                      type="url"
                      value={mediaUrl}
                      onChange={(e) => handleMediaUrlChange(e.target.value)}
                      placeholder="https://example.com/audio.mp3"
                      className={`w-full px-3 py-2 pr-10 border rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        mediaUrl && !mediaValidation.isValid 
                          ? 'border-red-500 dark:border-red-400' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {mediaUrl && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {mediaValidation.isValid ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {mediaUrl && !mediaValidation.isValid && (
                    <p className="text-xs text-red-500 mt-1">{mediaValidation.message}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Formats supportés : MP3, WAV, OGG, M4A
                  </p>
                </div>
              </div>
            )}

            {question.typeInput === 'ia' && (
              <div className="space-y-4">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Configuration IA</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Modèle IA</label>
                    <select 
                      value={iaConfig.model}
                      onChange={(e) => handleIaConfigChange('model', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-3.5">GPT-3.5 Turbo</option>
                      <option value="claude-3">Claude 3</option>
                      <option value="claude-3.5">Claude 3.5 Sonnet</option>
                      <option value="gemini">Gemini Pro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Clé API</label>
                    <div className="flex space-x-2">
                      <div className="flex-1 relative">
                        <input
                          type="password"
                          value={iaConfig.apiKey}
                          onChange={(e) => handleIaConfigChange('apiKey', e.target.value)}
                          placeholder="sk-..."
                          className={`w-full px-3 py-2 pr-8 border rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                            apiKeyValidation.status === 'error' 
                              ? 'border-red-500 dark:border-red-400' 
                              : apiKeyValidation.status === 'success'
                              ? 'border-green-500 dark:border-green-400'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                        />
                        {apiKeyValidation.status === 'testing' && (
                          <Loader className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />
                        )}
                        {apiKeyValidation.status === 'success' && (
                          <Check className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                        )}
                        {apiKeyValidation.status === 'error' && (
                          <AlertCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <button 
                        onClick={handleTestApiKey}
                        disabled={apiKeyValidation.status === 'testing' || !iaConfig.apiKey.trim()}
                        className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-xs flex items-center space-x-1"
                      >
                        {apiKeyValidation.status === 'testing' ? (
                          <Loader className="w-3 h-3 animate-spin" />
                        ) : (
                          <span>Test</span>
                        )}
                      </button>
                    </div>
                    {apiKeyValidation.message && (
                      <p className={`text-xs mt-1 ${
                        apiKeyValidation.status === 'success' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {apiKeyValidation.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Instructions pour l'IA</label>
                  <textarea
                    value={iaConfig.instructions}
                    onChange={(e) => handleIaConfigChange('instructions', e.target.value)}
                    placeholder="Instructions spécifiques pour le modèle IA..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Ces instructions guideront les réponses de l'IA aux participants.
                  </p>
                </div>
              </div>
            )}

            {/* Question Options pour QCM - Version améliorée */}
            {(question.typeOutput === 'qcm_unique' || question.typeOutput === 'qcm_multiple') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Options de réponse</h5>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {question.typeOutput === 'qcm_unique' ? 'Choix unique' : 'Choix multiples'}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div key={option.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-shrink-0">
                        {question.typeOutput === 'qcm_unique' ? (
                          <Circle className="w-4 h-4 text-gray-400" />
                        ) : (
                          <CheckSquare className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={option.texte}
                          onChange={(e) => updateOption(option.id, 'texte', e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <input
                          type="text"
                          value={option.valeur}
                          onChange={(e) => updateOption(option.id, 'valeur', e.target.value)}
                          placeholder={`valeur_${index + 1}`}
                          className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      {options.length > 2 && (
                        <button
                          onClick={() => deleteOption(option.id)}
                          className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button
                    onClick={addOption}
                    className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm w-full justify-center py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-md hover:border-blue-500 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Ajouter une option</span>
                  </button>
                  
                  {options.length < 2 && (
                    <p className="text-xs text-red-500">⚠️ Minimum 2 options requises</p>
                  )}
                </div>
              </div>
            )}

            {/* Type Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type d'entrée
                </label>
                <select
                  value={question.typeInput}
                  onChange={(e) => handleTypeChange('typeInput', e.target.value as TypeInput)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="texte">💭 Texte</option>
                  <option value="image">🖼️ Image</option>
                  <option value="video">🎥 Vidéo</option>
                  <option value="audio">🎵 Audio</option>
                  <option value="fichier">📎 Fichier</option>
                  <option value="ia">🤖 IA</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type de réponse
                </label>
                <select
                  value={question.typeOutput}
                  onChange={(e) => handleTypeChange('typeOutput', e.target.value as TypeOutput)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="texte_libre">📝 Texte libre</option>
                  <option value="qcm_unique">⚪ Choix unique</option>
                  <option value="qcm_multiple">☑️ Choix multiples</option>
                  <option value="video">🎬 Enregistrement vidéo</option>
                  <option value="audio">🎙️ Enregistrement audio</option>
                  <option value="fichier">📤 Upload fichier</option>
                  <option value="ia">🤖 Réponse IA</option>
                </select>
              </div>
            </div>

            {/* Settings */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={question.obligatoire}
                  onChange={(e) => handleObligatoireChange(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Question obligatoire</span>
              </label>

              <button
                onClick={() => setIsEditing(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                ✓ Terminé
              </button>
            </div>
          </div>
        ) : (
          <div 
            className="cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {question.titre || 'Question sans titre'}
            </h4>
            {question.description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                {question.description}
              </p>
            )}
            
            {/* Preview des options pour QCM */}
            {(question.typeOutput === 'qcm_unique' || question.typeOutput === 'qcm_multiple') && options.length > 0 && (
              <div className="space-y-2">
                {options.slice(0, 3).map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    {question.typeOutput === 'qcm_unique' ? (
                      <Circle className="w-4 h-4 text-gray-400" />
                    ) : (
                      <CheckSquare className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400">{option.texte}</span>
                  </div>
                ))}
                {options.length > 3 && (
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    +{options.length - 3} autres options...
                  </p>
                )}
              </div>
            )}

            {question.typeOutput === 'texte_libre' && (
              <div className="border border-gray-200 dark:border-gray-600 rounded p-3">
                <p className="text-sm text-gray-500 dark:text-gray-500">Zone de saisie libre...</p>
              </div>
            )}
          </div>
        )}

        {/* Preview Panel */}
        {showPreview && (
          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
            <QuestionPreview question={question} options={options} />
          </div>
        )}
      </div>
    </div>
  );
}

interface QuestionPreviewProps {
  question: Question;
  options: OptionQCM[];
}

function QuestionPreview({ question, options }: QuestionPreviewProps) {
  const [previewResponse, setPreviewResponse] = useState('');
  const [previewMultiple, setPreviewMultiple] = useState<string[]>([]);

  const handleMultipleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      setPreviewMultiple([...previewMultiple, optionValue]);
    } else {
      setPreviewMultiple(previewMultiple.filter(v => v !== optionValue));
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Play className="w-4 h-4 text-blue-600" />
        <h5 className="font-medium text-gray-900 dark:text-white">Aperçu participant</h5>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
            {question.titre}
            {question.obligatoire && <span className="text-red-500 ml-1">*</span>}
          </h4>
          {question.description && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">{question.description}</p>
          )}
        </div>

        {/* Simulation des différents types de réponse */}
        {question.typeOutput === 'texte_libre' && (
          <textarea
            value={previewResponse}
            onChange={(e) => setPreviewResponse(e.target.value)}
            placeholder="Tapez votre réponse ici..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        )}

        {question.typeOutput === 'qcm_unique' && (
          <div className="space-y-2">
            {options.map((option) => (
              <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="preview-radio"
                  value={option.valeur}
                  checked={previewResponse === option.valeur}
                  onChange={(e) => setPreviewResponse(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-900 dark:text-white">{option.texte}</span>
              </label>
            ))}
          </div>
        )}

        {question.typeOutput === 'qcm_multiple' && (
          <div className="space-y-2">
            {options.map((option) => (
              <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  value={option.valeur}
                  checked={previewMultiple.includes(option.valeur)}
                  onChange={(e) => handleMultipleChange(option.valeur, e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-900 dark:text-white">{option.texte}</span>
              </label>
            ))}
          </div>
        )}

        {question.typeOutput === 'video' && (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">Zone d'enregistrement vidéo</p>
            <button className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg">
              🔴 Commencer l'enregistrement
            </button>
          </div>
        )}

        {question.typeOutput === 'audio' && (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <Mic className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">Zone d'enregistrement audio</p>
            <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
              🎙️ Commencer l'enregistrement
            </button>
          </div>
        )}

        {question.typeOutput === 'fichier' && (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">Glissez-déposez ou cliquez pour sélectionner un fichier</p>
            <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg">
              📎 Choisir un fichier
            </button>
          </div>
        )}

        {question.typeOutput === 'ia' && (
          <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center space-x-2 mb-3">
              <Bot className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Interaction IA</span>
            </div>
            <div className="space-y-3">
              <div className="bg-white dark:bg-gray-800 rounded p-3 border">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  💭 L'IA analysera votre réponse et posera des questions de suivi personnalisées.
                </p>
              </div>
              <textarea
                placeholder="Démarrez la conversation avec l'IA..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                🚀 Envoyer à l'IA
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 