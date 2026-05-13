# 🚀 SGAFO - Système de Gestion des Activités des Formateurs OFPPT

SGAFO est une plateforme intégrée conçue pour optimiser et automatiser la gestion des plans de formation, le suivi des sessions pédagogiques et la coordination logistique pour les formateurs de l'OFPPT.

---

## 🛠️ Stack Technique

Le projet repose sur une architecture moderne et robuste, garantissant performance et scalabilité.

| Composant | Technologie |
| :--- | :--- |
| **Backend** | [Laravel 12](https://laravel.com/) (PHP 8.2+) |
| **Frontend** | [React 18](https://reactjs.org/) avec [TypeScript](https://www.typescriptlang.org/) |
| **Communication** | [Inertia.js](https://inertiajs.com/) (Monolithe moderne) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) & [Headless UI](https://headlessui.com/) |
| **Bundler** | [Vite 7](https://vitejs.dev/) |
| **Reporting** | Recharts (Analytics) & DomPDF (Génération de documents) |
| **Database** | MySQL / MariaDB |

---

## ✨ Fonctionnalités Clés

- **Gestion des Plans de Formation** : Création, soumission et validation (régionale/nationale) des plans.
- **Planification Pédagogique** : Gestion des séances, des ressources et de la logistique (Hôtels, Sites).
- **Suivi des Présences** : Appel numérique pour les animateurs et rapports d'absence automatisés.
- **Évaluation & Feedback** : Système de QCM interactif et formulaires de feedback post-formation.
- **Tableaux de Bord Analytiques** : Visualisation en temps réel des statistiques de formation.
- **Reporting Automatisé** : Génération de convocations et de rapports PDF.

---

## 👥 Rôles Utilisateurs

| Rôle | Description |
| :--- | :--- |
| **Administrateur** | Gestion globale du système, des utilisateurs, et de la logistique nationale. |
| **RF / CDC** | Responsable Formation / Chef de Complexe : Gestion et validation des plans. |
| **Animateur (Formateur)** | Préparation des séances, gestion des ressources et appel des participants. |
| **Participant** | Accès aux ressources, passage des QCM et soumission de feedbacks. |
| **Direction Régionale** | Supervision, consultation des indicateurs et reporting régional. |

---

## 🚀 Installation & Configuration

### Prérequis
- PHP >= 8.2
- Composer
- Node.js & NPM
- MySQL

### Étapes d'installation

1. **Cloner le dépôt** :
   ```bash
   git clone <repository-url>
   cd SGAFO/sgafo-app
   ```

2. **Installation des dépendances Backend** :
   ```bash
   composer install
   ```

3. **Installation des dépendances Frontend** :
   ```bash
   npm install
   ```

4. **Configuration de l'environnement** :
   ```bash
   cp .env.example .env
   # Configurez vos accès base de données dans le fichier .env
   php artisan key:generate
   ```

5. **Migration de la base de données** :
   ```bash
   php artisan migrate --seed
   ```

6. **Lancer le serveur de développement** :
   ```bash
   # Utiliser concurrently pour lancer Laravel et Vite
   composer run dev
   ```

---

## 📁 Structure du Projet

```text
SGAFO/
├── sgafo-app/             # Application Laravel principale
│   ├── app/               # Logique métier (Models, Controllers)
│   ├── resources/js/      # Composants React & Pages
│   ├── routes/            # Définitions des routes (web.php, auth.php)
│   └── public/            # Assets statiques
├── principale_interface/  # Captures d'écran de l'interface
└── README.md              # Documentation principale
```

---

## 📄 Licence

Ce projet est sous licence **Propriétaire - OFPPT**. Tous droits réservés.
