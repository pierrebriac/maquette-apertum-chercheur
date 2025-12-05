import QuestionPreview from './QuestionPreview';
import ConditionEditor from './ConditionEditor';

function EditQuestionForm({ question, onSave, onCancel, allQuestions, allModules }: EditQuestionFormProps) {
  const [formData, setFormData] = useState({
    titre: question.titre,
    description: question.description,
    obligatoire: question.obligatoire,
    typeInput: question.typeInput,
    typeOutput: question.typeOutput,
    conditions: question.conditions || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedQuestion: Question = {
      ...question,
      ...formData,
      mediaInput: []
    };
    onSave(updatedQuestion);
  };

  const handleConditionsChange = (conditions: Condition[]) => {
    setFormData(prev => ({ ...prev, conditions }));
  };

  return (
    <div>
      {/* Section Logique Conditionnelle */}
      <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
        <ConditionEditor
          conditions={formData.conditions}
          availableQuestions={allQuestions || []}
          availableModules={allModules || []}
          currentQuestionId={question.id}
          onConditionsChange={handleConditionsChange}
        />
      </div>
    </div>
  );
}

export default EditQuestionForm; 