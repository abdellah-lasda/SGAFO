# Plan d'implémentation — Phase 4 (RÉFORMÉE) : Plans de Formation

Ce plan remplace le module "Idées de formation" par le **Cœur du système** : la planification des formations massives.

## 🎯 Objectif
Permettre au **Responsable CDC** de créer, structurer et soumettre le plan de formation annuel pour ses secteurs techniques.

## Proposed Changes

### 🏗️ 1. Base de Données (Référentiel & Plans)
- **[NEW] Table `entites_formation`** : Le catalogue (Titre, Domaine, Objectifs).
- **[NEW] Table `plans_formation`** : L'entité centrale (Titre, Année, Statut).
- **[NEW] Table `plan_themes`** : Les modules inclus dans un plan particulier.
- **[NEW] Table `plan_participants`** : Liste des formateurs inscrits à ce plan.

### 🎮 2. Backend (Logique de Workflow)
- **`PlanFormationController`** : Gestion du cycle de vie (Brouillon -> Soumis -> Validé -> Confirmé).
- **Scopes de sécurité** : S'assurer que chaque CDC ne voit que les plans de ses propres secteurs.

### 🎨 3. Frontend (Expérience Utilisateur)
- **Tableau de bord CDC** : Vue d'ensemble des plans en cours.
- **Le Stepper (Multi-étapes)** :
  1. Choix du module (Catalogue).
  2. Détail des thèmes.
  3. Sélection des participants (Filtres par institut/région).
  4. Logistique (Lieu, Hébergement).

## Open Questions

> [!IMPORTANT]
> 1. **Catalogue Initial** : Souhaites-tu que je pré-remplisse le catalogue avec quelques exemples de formations standards (Secteur Digital, BTP, etc.) ?
> 2. **Validation** : Doit-on activer tout de suite le bouton "Valider" pour le rôle **RF** ou on se concentre d'abord sur la création par le **CDC** ?

## Plan de Vérification
1. Créer un plan complet en tant que CDC.
2. Vérifier que les participants sélectionnés reçoivent une "pré-alerte".
3. Simuler la validation par le RF.
