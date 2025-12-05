'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Etude } from '@/types';
import { getStudy, getResearcher } from '@/lib/storage';
import ModernProtocoleEditor from '@/components/protocoles/ModernProtocoleEditor';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function ModifierEtudePage() {
  const params = useParams();
  const router = useRouter();
  const [etude, setEtude] = useState<Etude | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEtude = async () => {
      try {
        const researcher = getResearcher();
        if (!researcher) {
          router.push('/connexion');
          return;
        }

        const etudeId = params.id as string;
        const loadedEtude = await getStudy(etudeId, researcher.id);
        
        if (!loadedEtude) {
          setError('Étude non trouvée');
          return;
        }

        setEtude(loadedEtude);
      } catch (err) {
        console.error('Erreur lors du chargement de l\'étude:', err);
        setError('Erreur lors du chargement de l\'étude');
      } finally {
        setLoading(false);
      }
    };

    loadEtude();
  }, [params.id, router]);

  const handleEtudeChange = (updatedEtude: Etude) => {
    setEtude(updatedEtude);
  };

  const handleBack = () => {
    router.push('/etudes');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Chargement de l'étude...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg mb-4">
            <p className="font-medium">Erreur</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux études</span>
          </button>
        </div>
      </div>
    );
  }

  if (!etude) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Étude non trouvée</p>
          <button
            onClick={handleBack}
            className="mt-4 flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux études</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <ModernProtocoleEditor
      etude={etude}
      onEtudeChange={handleEtudeChange}
      onBack={handleBack}
    />
  );
} 