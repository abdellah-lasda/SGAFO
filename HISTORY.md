
# 📜 Historique de Développement — SGAFO

Ce document répertorie les phases de création du système et les modifications majeures apportées.

---

## 📅 Phase 1 : Fondations & Authentification
- Installation de Laravel 11 et Inertia (React).
- Configuration du système d'authentification (Breeze).
- Mise en place du layout de base inspiré de la charte OFPPT.

## 📅 Phase 2 : Rôles & Accès (RBAC)
- **Modifications :** Création des tables `roles` et `user_roles`.
- **Rôles implémentés :** Admin, Responsable CDC, Directeur Régional (DR), Responsable Formation (RF), Formateur.
- **Ajout :** Gestion du `statut` (Actif/Inactif) pour les utilisateurs.

## 📅 Phase 3 : Architecture CDC & Secteurs (Refonte Majeure)
- **Problème initial :** Les utilisateurs étaient liés uniquement à des régions.
- **Solution :** Mise en place d'une structure nationale pour les disciplines techniques.
- **Modifications :**
    - Création du modèle **CDC** (Centre de Développement des Compétences).
    - Création du modèle **Secteur** (Métier/Discipline).
    - Relation : Un CDC gère plusieurs Secteurs.
    - Affectation : Le Responsable CDC est lié à son Centre, le Formateur est lié à son Métier.

## 📅 Phase 3.5 : Optimisation de l'Interface (UI/UX)
- **Modifications :**
    - Suppression des checkboxes pour les rôles ➡️ Remplacement par un **Select** propre.
    - **Logiciel de Modal :** Correction du bug de défilement (Scroll interne) et du fond gris (Backdrop).
    - **Tableau Utilisateurs :** Simplification des titres de colonnes pour plus de clarté ("Entité / Région", "Spécialité / Institut").
    - **Design Premium :** Ajout de sections colorées et d'icônes dans le formulaire d'ajout d'utilisateur.

---

## 🔜 Prochaine Étape : Phase 4
- Lancement du module **Ingénierie de Formation** (Recueil des besoins).
