# 9606 Capital AI Tenant Research - Frontend

Interface web React + TypeScript pour l'outil d'analyse de marché immobilier industriel **9606 Capital** spécialisé dans la découverte de **locataires émergents**.

## 🚀 Fonctionnalités

### 🎯 **Analyse de Locataires 9606 (Emerging Companies)**

- **Découverte intelligente** de locataires émergents pour propriétés industrielles
- **Scoring avancé** sur 5 critères (50 points total)
- **Configuration IA dynamique** via interface utilisateur
- **Export** vers Google Docs automatique

### 🧮 **Calculateur Cap Rate**

- **Calcul automatique** des taux de capitalisation
- **Analyse de marché** avec données comparatives
- **Interface intuitive** avec validation en temps réel
- **Multiples méthodes** de calcul et assumptions

## 🛠️ Stack Technique

- **React 19** + **TypeScript** - Framework frontend moderne
- **Vite** - Build tool ultra-rapide avec HMR
- **Tailwind CSS** - Framework CSS utilitaire
- **React Router** - Navigation SPA
- **Heroicons** - Icônes modernes
- **ESLint** - Linting et qualité de code

## ⚡ Installation & Démarrage

```bash
cd client
npm install

# Copier et configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec l'URL de votre API backend

npm run dev
```

**URL locale :** http://localhost:3000

## ⚙️ Configuration

### Variables d'Environnement

Créez un fichier `.env` dans le dossier `client/` :

```env
# URL de l'API backend (sans slash final)
VITE_API_BASE_URL=http://localhost:8080
```

Pour le déploiement sur Vercel, configurez la variable d'environnement `VITE_API_BASE_URL` avec l'URL de votre API de production.

## 🔧 Scripts Disponibles

```bash
npm run dev      # Démarrage développement avec HMR
npm run build    # Build de production (TypeScript + Vite)
npm run lint     # Vérification ESLint
npm run preview  # Prévisualisation du build
```

## 📁 Structure du Projet

```
client/src/
├── components/
│   ├── common/
│   │   └── Navigation.tsx          # Navigation principale
│   ├── tenant-research/
│   │   └── TenantResearch.tsx      # Interface principale 9606
│   └── cap-rate/
│       ├── CapRateCalculator.tsx   # Calculateur principal
│       ├── Assumptions.tsx         # Gestion des assumptions
│       ├── ManualEntry.tsx         # Saisie manuelle
│       ├── MarketStudy.tsx         # Étude de marché
│       ├── NOICalculator.tsx       # Calcul NOI
│       └── Results.tsx             # Affichage résultats
├── types/
│   └── index.ts                    # Types TypeScript
├── utils/
│   └── calculations.ts             # Utilitaires de calcul
└── assets/                         # Assets statiques
```

## 🎨 Interface Utilisateur

### **Page Tenant Research (Route: `/`)**

- **Formulaire d'analyse** : Adresse, type, surface, caractéristiques
- **Configuration IA** : Bouton ⚙️ pour personnaliser les prompts
- **Résultats dynamiques** : Cartes de locataires avec scoring détaillé

### **Page Cap Rate Calculator (Route: `/cap-rate`)**

- **Calculateur interactif** avec validation temps réel
- **Assumptions modifiables** pour personnaliser l'analyse
- **Résultats visuels** avec graphiques et métriques
- **Export** des analyses

### **Configuration IA Dynamique**

- **Paramètres modifiables** : Nom entreprise, focus, critères
- **Sauvegarde instantanée** des modifications
- **Réinitialisation** aux valeurs par défaut
- **Interface modale** intuitive

## 🔌 Intégration API

### **Backend Requis**

Le frontend communique avec le serveur Node.js sur `http://localhost:8080`

### **Endpoints Utilisés**

- `POST /api/tenant-research/analyze-9606` - Analyse principale
- `GET/POST /api/config/prompt` - Configuration IA

## 🎯 Méthodologie 9606 Capital

### **Stratégie Emerging Companies**

- **Focus** sur entreprises émergentes (non Amazon/Walmart/etc.)
- **Scoring intelligent** basé sur 5 critères métier
- **Analyse contextuelle** de la zone et du bâtiment
- **Recommandations personnalisées** par propriété

### **Critères de Scoring (10 pts chacun)**

1. **area_growth_trends** - Tendances de croissance locale
2. **operational_needs_match** - Adéquation besoins opérationnels
3. **capacity_requirements** - Exigences de capacité
4. **industry_growth** - Croissance du secteur
5. **building_fit** - Compatibilité avec le bâtiment

### **Build de Production**

```bash
npm run build    # Génère ./dist/
npm run preview  # Test du build localement
```

**Version :** 2.0 - Interface optimisée 9606 Capital  
**Build :** Vite + React 19 + TypeScript  
**Design :** Tailwind CSS avec composants modernes  
**Backend :** Requiert serveur Node.js sur port 8080
