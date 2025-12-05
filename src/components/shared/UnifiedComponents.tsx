import React from 'react';
import { Plus } from 'lucide-react';

// Composant EmptyState unifié
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500">
      <div className="w-12 h-12 text-gray-400 mx-auto mb-4">
        {icon}
      </div>
      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {title}
      </h4>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {description}
      </p>
      <PrimaryAddButton
        onClick={onAction}
        label={actionLabel}
        icon={<Plus className="w-5 h-5" />}
        size="lg"
      />
    </div>
  );
}

// Composant InlineAddButton unifié
interface InlineAddButtonProps {
  onClick: () => void;
  label: string;
  className?: string;
}

export function InlineAddButton({ onClick, label, className = "" }: InlineAddButtonProps) {
  return (
    <div className={`flex justify-center py-2 ${className}`}>
      <button
        onClick={onClick}
        className="group relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 transform hover:scale-110"
        title={label}
      >
        <Plus className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
        <div className="absolute left-full ml-2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
          {label}
        </div>
      </button>
    </div>
  );
}

// Composant PrimaryAddButton unifié
interface PrimaryAddButtonProps {
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PrimaryAddButton({ 
  onClick, 
  label, 
  icon = <Plus className="w-4 h-4" />, 
  size = 'md',
  className = "" 
}: PrimaryAddButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center space-x-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 ${sizeClasses[size]} ${className}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
} 