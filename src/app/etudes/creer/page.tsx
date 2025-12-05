'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Etude } from '@/types';
import { getResearcher, generateId } from '@/lib/storage';
import ModernProtocoleEditor from '@/components/protocoles/ModernProtocoleEditor';

export default function CreerEtudePage() {
  const router = useRouter();
  const [etude, setEtude] = useState<Etude | null>(null);

  useEffect(() => {
    const researcher = getResearcher();
    if (!researcher) {
      router.push('/connexion');
      return;
    }

    // Créer une nouvelle étude vide
    const nouvelleEtude: Etude = {
      id: generateId(),
      titre: '',
      description: '',
      chercheursId: [researcher.id],
      dateCreation: new Date().toISOString().split('T')[0],
      dateDebut: '',
      dateFin: '',
      statut: 'brouillon',
      modules: [],
      criteresRecrutement: [],
      objectifRecrutement: {
        nombreParticipants: 0,
        dateEcheance: ''
      },
      participants: []
    };

    setEtude(nouvelleEtude);
  }, [router]);

  const handleEtudeChange = (updatedEtude: Etude) => {
    setEtude(updatedEtude);
  };

  const handleBack = () => {
    router.push('/etudes');
  };

  if (!etude) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Initialisation...</p>
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