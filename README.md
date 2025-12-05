# 🧠 Apertum - Interface Chercheur

> **Plateforme de recherche pour l'analyse de biomarqueurs vocaux et cognitifs**

Apertum est une interface web moderne développée pour les chercheurs souhaitant mener des études sur les biomarqueurs vocaux, notamment dans le cadre de recherches sur Alzheimer, Parkinson, la dépression et d'autres pathologies neurologiques.

## 🚀 Fonctionnalités

### ✅ **Complètement implémenté**

- **🏠 Dashboard intelligent** - Vue d'ensemble avec statistiques temps réel
- **📊 Gestion des études** - Création, modification et suivi des projets de recherche
- **👥 Base de données participants** - Gestion complète des participants et leurs données
- **📋 Protocoles de recherche** - Éditeur de protocoles avec modules configurables
- **📈 Analytics avancées** - Graphiques et métriques détaillées avec données démographiques
- **📤 Export de données** - Export multi-format (CSV, Excel, JSON, PDF)
- **👥 Gestion d'équipe** - Collaboration et permissions
- **📚 Historique complet** - Journal d'activité avec filtres avancés
- **🌐 Communauté** - Hub de collaboration entre chercheurs

### 🎯 **Données de démonstration**

- **Alzheimer** - Protocole de détection précoce via biomarqueurs vocaux
- **Parkinson** - Analyse des troubles de la parole et motricité
- **Dépression** - Identification de marqueurs émotionnels dans la voix
- **Stress universitaire** - Étude d'impact sur les performances académiques

## 🛠️ Technologies

- **Frontend** : Next.js 15 avec App Router
- **Styling** : Tailwind CSS avec support dark mode
- **Icônes** : Lucide React
- **TypeScript** : Sécurité des types
- **Responsive** : Mobile-first design

## 📦 Installation

```bash
# Cloner le repository
git clone https://github.com/[votre-username]/interface-chercheur.git

# Naviguer dans le projet
cd interface-chercheur/apertum-platform

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

## 🏗️ Structure du projet

```
apertum-platform/
├── src/
│   ├── app/                    # Pages Next.js (App Router)
│   │   ├── dashboard/          # Tableau de bord
│   │   ├── etudes/             # Gestion des études
│   │   ├── protocoles/         # Éditeur de protocoles
│   │   ├── donnees/            # Base de données participants
│   │   ├── analytics/          # Statistiques avancées
│   │   ├── export/             # Export de données
│   │   ├── equipe/             # Gestion d'équipe
│   │   ├── communaute/         # Hub communauté
│   │   └── historique/         # Journal d'activité
│   ├── components/             # Composants réutilisables
│   │   ├── layout/             # Composants de mise en page
│   │   └── ui/                 # Composants UI de base
│   ├── lib/                    # Utilitaires et services
│   ├── types/                  # Définitions TypeScript
│   └── data/                   # Données de démonstration
├── public/                     # Assets statiques
└── docs/                       # Documentation
```

## 🔧 Scripts disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Vérification du code
npm run type-check   # Vérification TypeScript
```

## 📊 État d'avancement

**Progression générale : 99% TERMINÉ** ✅

- [x] **Pages principales** (100%)
- [x] **Navigation simplifiée** (100%)
- [x] **Système de notifications** (100%)
- [x] **Interface responsive** (100%)
- [x] **Support dark mode** (100%)
- [x] **Données de démonstration** (100%)
- [x] **Workflow protocole → étude** (100%)

## 🎯 Fonctionnalités clés

### 📊 **Dashboard intelligent**

- Statistiques temps réel sur les études actives
- Aperçu des participants et progression
- Activité récente avec notifications
- Actions rapides pour les tâches courantes

### 🔬 **Gestion d'études complète**

- Créateur d'études avec validation temps réel
- Protocoles configurables par modules
- Suivi des participants en temps réel
- Export de données granulaire

### 👥 **Base de données participants**

- Interface de consultation détaillée
- Filtres et recherche avancés
- Visualisation des fichiers de données
- Progression individuelle des participants

### 📈 **Analytics avancées**

- Graphiques interactifs avec Chart.js
- Métriques démographiques détaillées
- Comparaisons entre pathologies
- Exportation des visualisations

## 🔒 Sécurité et conformité

- Session management sécurisé
- Gestion des permissions par rôle
- Préparation RGPD pour les données participants
- Validation des données côté client et serveur

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add: AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**Pierre-Briac Metayer**

- Interface et expérience utilisateur
- Implémentation des fonctionnalités avancées
- Optimisation des performances

## 🔗 Liens utiles

- [Documentation technique](./docs/)
- [Guide d'utilisation](./docs/user-guide.md)
- [Changelog](./CHANGELOG.md)

---

**Apertum** - _Révolutionner la recherche sur les biomarqueurs vocaux_ 🧠🎤
