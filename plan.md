# 🚀 Documentation Complète du Système SGAFO

SGAFO (Système de Gestion des Activités des Formateurs OFPPT) est une plateforme intégrée et moderne destinée à optimiser, automatiser et centraliser la gestion des plans de formation, le suivi pédagogique et la coordination logistique pour les formateurs de l'OFPPT.

---

## 🏗️ 1. Architecture et Stack Technique

SGAFO repose sur une architecture monolithique moderne (Client-Serveur unifié) garantissant de hautes performances et une maintenance facilitée.

### 🔧 Technologies Utilisées :
* **Backend :** Laravel 12 (PHP 8.2+)
* **Frontend :** React 18 avec TypeScript
* **Pont de communication (SSR/SPA) :** Inertia.js (Évite la création d'une API REST lourde tout en gardant une interface réactive)
* **Design & UI :** Tailwind CSS, Headless UI (pour l'accessibilité et les composants interactifs)
* **Outil de compilation (Bundler) :** Vite 7
* **Base de données :** PostgreSQL
* **Outils tiers intégrés :**
  * *Recharts* : Pour la génération de graphiques et de dashboards analytiques.
  * *DomPDF* : Pour la génération automatisée de documents (Convocations, rapports d'absence, plans de formation).

---

## ✨ 2. Modules et Fonctionnalités Clés

Le système est divisé en plusieurs modules fonctionnels pour couvrir l'intégralité du cycle de vie d'une formation :

1. **Gestion des Plans de Formation (Pilotage)**
   * Création, modification et soumission des plans de formation.
   * Circuit de validation complexe (Niveau Régional -> Niveau Central/National).
   * Archivage et gestion des historiques.

2. **Planification Pédagogique et Logistique**
   * Programmation des séances de formation (Planning dynamique).
   * Gestion avancée des ressources logistiques (Salles, Hôtels, Sites d'hébergement).
   * Gestion des capacités et des quotas (multi-groupes).

3. **Suivi des Présences (Gestion d'Absence)**
   * Système d'appel numérique en temps réel (pour les animateurs).
   * Génération de rapports d'absence automatiques et exportables (PDF/Excel).
   * Possibilité de réouverture des listes de présence en cas d'erreur.

4. **Évaluation & Feedback (Pédagogie)**
   * Moteur de création de QCM interactifs (Questions/Réponses) par les animateurs.
   * Formulaires de satisfaction (Feedback) post-formation dynamiques (Form Builder).
   * Notation et émission d'attestations ou de certificats.

5. **Tableaux de Bord Analytiques & Reporting**
   * Tableaux de bord personnalisés selon le rôle (Admin, DR, RF).
   * Visualisation en temps réel des statistiques (taux de participation, réussite, évaluations).
   * Génération de convocations personnalisées pour les participants.

---

## 👥 3. Gestion des Rôles et des الصلاحيات (Permissions)

SGAFO gère **5 types d'acteurs principaux** avec des accès stricts (Contrôle d'accès basé sur les rôles - RBAC) :

### 👑 A. Administrateur (ADMIN)
Il a une vue globale et le contrôle total sur le système.
* **Paramétrage :** Gestion des instituts, spécialités (Domaines, Secteurs, Métiers), et affectation des CDC.
* **Logistique :** Ajout et paramétrage des hôtels, sites et salles.
* **Supervision :** Tableau de bord de pilotage (Dashboard), accès aux analyses globales.
* **Gestion des Formulaires :** Création et déploiement de modèles de feedback personnalisés (Builder).
* **Gestion des Utilisateurs :** Opérations CRUD sur tous les comptes du système.

### 👨‍💼 B. Responsable Formation (RF)
C'est le chef d'orchestre des plans de formation pour son pôle/entité.
* **Plans de formation :** Création, soumission, validation, annulation ou clôture.
* **Plannings :** Programmation des sessions pour les plans approuvés.
* **Suivi :** Tableau de bord des présences/absences et statistiques liées à ses propres plans.
* **Feedback :** Supervision et validation des évaluations, émission de certificats.

### 🎓 C. Mnsiq / Chef de Complexe (CDC)
Responsable de la validation pédagogique.
* **Validation :** Approbation ou rejet des plans de formation soumis par les RF.
* **Suivi :** Accès en lecture aux entités, au suivi des absences et aux rapports analytiques.
* *(Ne peut pas paramétrer les formulaires de feedback contraîrement au RF ou à l'Admin).*

### 🏢 D. Direction Régionale (DR)
Superviseur (Observateur) pour une région géographique spécifique.
* **Dashboard DR :** Vue d'ensemble de l'activité de sa région.
* **Consultation :** Lecture des plans de formation régionaux, des calendriers et suivi des ressources (Instituts et formateurs locaux).
* **Documents :** Exportation des plans régionaux et téléchargement des convocations.

### 👨‍🏫 E. Formateur (Rôle Double)
Le formateur est l'utilisateur final. Il peut agir en tant qu'**Animateur** (professeur) ou **Participant** (élève) selon la session.

* **En tant qu'Animateur :**
  * Gère ses propres cours et séances.
  * Dépose et gère les ressources pédagogiques (cours, PDF).
  * Fait l'appel numérique (présences) et clôture les feuilles de présence.
  * Crée et corrige les QCM (Quiz) pour ses participants.
* **En tant que Participant :**
  * Consulte son emploi du temps et les ressources des formations auxquelles il est inscrit.
  * Passe les examens QCM en ligne.
  * Remplit les formulaires de feedback (satisfaction) à la fin de la formation.

---

## 🔒 4. Sécurité et Règles de Gestion
* **Authentification centralisée :** Connexion sécurisée (et workflows d'invitation sécurisés/tokens pour certaines actions spécifiques).
* **Cloisonnement des données :** Un DR ne voit que les données de sa région. Un RF ne voit que les données de son secteur.
* **Génération de documents dynamiques :** Les convocations, listes de présence et rapports de plans sont des documents générés dynamiquement via des templates centralisés pour garantir l'uniformité visuelle (Thème "Premium" vert émeraude).
* **Accessibilité :** L'interface utilisateur est responsive et respecte les bonnes pratiques d'ergonomie (UI/UX).

---

*Note: Ce document synthétise l'architecture, les fonctionnalités et les acteurs du projet SGAFO, et constitue la base de référence pour le rapport de projet de synthèse.*
