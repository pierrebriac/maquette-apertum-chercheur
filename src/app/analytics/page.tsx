'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SessionStorage, StudyStorage } from '@/lib/storage';
import { Chercheur, Etude } from '@/types';
import MainLayout from '@/components/layout/MainLayout';
import {
  BarChart,
  Users,
  FileText,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Download,
  TrendingUp,
  Target,
  BarChart3,
  PieChart,
  Database,
  RefreshCw,
  Eye,
  Share2
} from 'lucide-react';

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Analyses Approfondies</h3>
                  <p className="text-gray-600 dark:text-gray-400">Examinez les tendances et patterns dans vos données</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Lancer l&apos;analyse
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rapports Automatisés</h3>
                  <p className="text-gray-600 dark:text-gray-400">Générez des rapports personnalisés pour vos études</p>
                </div>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Créer un rapport
                </button>
              </div> 

                    <p className="text-gray-600 dark:text-gray-400">
                      Analysez l&apos;évolution de vos participants au fil du temps
                    </p>

                    <p className="text-gray-600 dark:text-gray-400">
                      Comparez les performances de vos différentes études
                    </p> 