# CAHIER DES CHARGES — SGAFO v2.0
## Système de Gestion des Formations des Formateurs OFPPT

---

| Champ | Valeur |
|---|---|
| **Référence** | SGAFO-CDC-v2.0 |
| **Version** | 2.0 — Version définitive enrichie |
| **Date** | Avril 2026 |
| **Statut** | Validé pour soutenance |
| **Encadrant** | M. Zaher MECHBOUK |
| **Année académique** | 2025 – 2026 |

---

## TABLE DES MATIÈRES

1. Contexte et Introduction
2. Objectifs du Système
3. Périmètre du Projet
4. Acteurs et Rôles
5. Processus Métier de Bout en Bout
6. Exigences Fonctionnelles Détaillées
7. Règles de Gestion
8. Exigences Non Fonctionnelles
9. Architecture Applicative et Technologies
10. Modèle de Données
11. Diagrammes d'Analyse UML
12. Reporting et Analytics
13. Livrables et Planification
14. Glossaire
15. Conclusion

---

## 1. CONTEXTE ET INTRODUCTION

### 1.1 Présentation de l'OFPPT

L'Office de la Formation Professionnelle et de la Promotion du Travail (OFPPT) est un établissement public marocain chargé de la formation professionnelle. Il dispose d'un réseau de Centres de Développement des Compétences (CDC) répartis sur l'ensemble du territoire national, chacun rattaché à une Direction Régionale (DR).

La formation continue des formateurs est un levier stratégique de l'OFPPT pour garantir la qualité pédagogique de ses établissements. Ces formations permettent aux formateurs de mettre à jour leurs compétences, d'adopter de nouvelles méthodes pédagogiques et d'améliorer la qualité de l'enseignement dispensé.

### 1.2 Problématique

Le processus actuel de gestion des formations des formateurs souffre de plusieurs lacunes majeures qui freinent son efficacité et sa traçabilité :

| # | Problème identifié | Impact constaté |
|---|---|---|
| 1 | Données dispersées entre fichiers Excel, emails et supports papier | Incohérences, risque de perte de données, temps de traitement élevé |
| 2 | Absence de workflow structuré de validation des plans de formation | Plans non contrôlés, manque de gouvernance, décisions non tracées |
| 3 | Suivi des présences et absences insuffisamment formalisé | Statistiques d'assiduité inexistantes ou peu fiables |
| 4 | Gestion logistique partielle et non centralisée | Conflits de ressources non détectés, hébergements mal gérés |
| 5 | Aucune traçabilité des décisions et actions | Impossibilité d'audit, de justification ou de contrôle |
| 6 | Manque de tableaux de bord consolidés | Aide à la décision insuffisante pour la direction |
| 7 | Circuit de convocation manuel, long et non tracé | Délais importants, risque d'oublis, participants non informés à temps |

### 1.3 Solution Proposée : SGAFO

**SGAFO** (Système de Gestion des Formations des Formateurs OFPPT) est une **plateforme web centralisée** qui couvre l'intégralité du cycle de vie d'une formation : de l'idée initiale jusqu'à l'évaluation finale, en passant par la planification, la validation, l'exécution et le reporting.

```
CONCEPT  →  PLANIFICATION  →  VALIDATION  →  EXÉCUTION  →  ÉVALUATION  →  REPORTING
 (Entité)    (Plan + Sessions)  (Workflow)    (Présences)   (QCM/Feedback)  (KPI/Exports)
```

---

## 2. OBJECTIFS DU SYSTÈME

### 2.1 Objectif Général

Mettre en place une plateforme web intégrée permettant de **planifier, exécuter, suivre et évaluer** les formations des formateurs de l'OFPPT, avec une gouvernance claire, un pilotage en temps réel et une traçabilité complète de toutes les actions.

### 2.2 Objectifs Spécifiques

| # | Objectif spécifique |
|---|---|
| OS-01 | Modéliser et centraliser les idées de formation sous forme d'entités réutilisables |
| OS-02 | Structurer un workflow de validation des plans de formation entre CDC et Responsable Formation |
| OS-03 | Gérer les sessions de formation avec affectation contextuelle d'animateurs et de participants |
| OS-04 | Automatiser le suivi des présences et absences par session |
| OS-05 | Intégrer un module QCM par session pour mesurer la compréhension des participants |
| OS-06 | Collecter des feedbacks facultatifs sur la qualité des formations |
| OS-07 | Centraliser la gestion documentaire (convocations, supports, comptes rendus) |
| OS-08 | Structurer la logistique (hébergement, déplacements, sites) par session |
| OS-09 | Produire des rapports analytiques différenciés par rôle et par région |
| OS-10 | Notifier automatiquement tous les acteurs par email et notification in-app |

---

## 3. PÉRIMÈTRE DU PROJET

### 3.1 Modules Inclus

| # | Module | Description |
|---|---|---|
| 1 | Gestion des utilisateurs et rôles | Comptes, habilitations RBAC, historique connexions |
| 2 | Gestion des entités de formation | Idées de formation réutilisables (titre, objectifs, thèmes) |
| 3 | Gestion des plans de formation | Plans détaillés avec stepper guidé 6 étapes, statuts, workflow |
| 4 | Workflow validation/publication | Soumission CDC → validation RF → confirmation et publication |
| 5 | Gestion des sessions | Dates, sites, animateurs contextuels, capacité, statut |
| 6 | Gestion des participants | Sélection contextuelle par auteur du plan, affectation par session |
| 7 | Présences et absences | Saisie par animateur, statuts multiples, verrouillage, export |
| 8 | QCM par session | Création par animateur, diffusion contrôlée fin de session, statistiques |
| 9 | Feedback post-session | Formulaire facultatif, questions libres, statistiques par catégorie |
| 10 | Gestion documentaire | Upload PDFs convocations, supports pédagogiques, versioning |
| 11 | Logistique étendue | Hébergement multi-sites (affectation individuelle), déplacements, alertes conflits |
| 12 | Reporting et analytics | KPI, tableaux de bord différenciés par rôle, exports |
| 13 | Notifications | Email + in-app sur tous les événements critiques |
| 14 | Audit et traçabilité | Journal immuable de toutes les actions sensibles |
| 15 | Espace Parcours Formateur | Vues dédiées pour le parcours Animateur et Participant avec statistiques |

### 3.2 Hors Périmètre (Version 1)

- Gestion de la paie et RH complète
- E-learning synchrone natif (visioconférence intégrée)
- SSO institutionnel (option prévue en version future)
- Accès externe des établissements au système (version ultérieure)
- Confirmation de participation des établissements dans le système (actuellement hors système)

---

## 4. ACTEURS ET RÔLES

### 4.1 Principe Général du RBAC

Le système SGAFO utilise un contrôle d'accès basé sur les rôles à **deux niveaux** :

| Niveau | Type | Source | Description |
|---|---|---|---|
| **Niveau 1** | Rôle système (permanent) | Table `roles` | Détermine les accès globaux aux modules |
| **Niveau 2** | Rôle contextuel (par formation) | Tables de jointure `plan_theme_animateurs` / `plan_participants` | Détermine les actions possibles sur une formation spécifique |

> **Point clé :** Les rôles **Animateur** et **Participant** ne sont PAS des rôles système fixes. Ce sont des **rôles contextuels** attribués à un formateur pour une formation donnée. Un même formateur peut être *animateur* dans la Formation A et *participant* dans la Formation B.

### 4.2 Les 6 Rôles du Système

---

#### 🔵 RÔLE 1 — Responsable CDC (`CDC`)
> Centre de Développement des Compétences — entité régionale de l'OFPPT

**Positionnement :** Initiateur du processus de formation. Il est à l'origine de la grande majorité des plans de formation.

**Responsabilités :**
- Crée les **entités de formation** (concepts réutilisables : titre, domaine, objectifs, thèmes)
- Crée des **plans de formation** détaillés via un stepper guidé en 6 étapes
- **Soumet** ses plans au Responsable Formation pour validation
- Sélectionne les **formateurs participants** de la formation
- Prépare la **logistique** : hébergement, déplacements, site de formation
- Crée les **questions de feedback** pour évaluer la qualité de la formation
- En cas de rejet par le RF, **modifie et re-soumet** le même plan (avec le motif de rejet visible)

**Contrainte majeure :** Le CDC **ne peut pas valider lui-même** son plan — il dépend obligatoirement du Responsable Formation.

---

#### 🟢 RÔLE 2 — Responsable de Formation (`RF`)
> Acteur central de gouvernance et de pilotage du système

**Positionnement :** Chef d'orchestre du workflow. Il valide, planifie et supervise l'ensemble des formations.

**Responsabilités :**
- Peut créer ses propres entités et plans de formation
- **Confirme directement** ses propres plans (sans validation externe)
- **Valide ou rejette** (avec motif obligatoire) les plans soumis par les CDC
- **Planifie les sessions** : dates, sites, capacité, animateurs, participants
- **Upload les PDFs** de convocation après confirmation du plan
  - Document 1 : liste des participants (nom, prénom, ID, établissement, région, secteur, domaine)
  - Document 2 : liste des animateurs (mêmes informations)
- Envoie manuellement les convocations au Responsable DR (hors système)
- Accède aux **statistiques complètes** : QCM, feedback, absences, planning global
- Peut clôturer les sessions (déclenchant le verrouillage des présences)

**Pouvoir exclusif :** Le RF est le seul à pouvoir **publier** une formation et **planifier** ses sessions.

---

#### 🟡 RÔLE 3 — Responsable DR (`DR`)
> Direction Régionale — superviseur géographique sans droit d'écriture

**Positionnement :** Observateur régional. Il supervise sans intervenir dans la création ni la modification des données.

**Responsabilités :**
- Consulte uniquement les données de **sa région assignée** (contrainte absolue)
- Consulte les plans de formation, sessions, absences, statistiques QCM et feedback de sa région
- Suit la progression par établissement dans sa région
- Reçoit les convocations du RF **hors système** (email institutionnel)
- Transmet ces convocations aux établissements de sa région **hors système**

**Droits :** Lecture seule (R) sur toutes les données de sa région. Aucune action de création, modification ou suppression.

---

#### 🟠 RÔLE 4 — Formateur (Contexte : Participant) (`FORMATEUR / FP`)
> Formateur OFPPT affecté comme apprenant pour une formation spécifique

**Nature du rôle :** Contextuel — un formateur joue ce rôle uniquement pour les formations où il a été sélectionné comme participant par l'auteur du plan.

**Dans le contexte d'une formation où il est participant :**
- Consulte ses **convocations** et sessions à venir
- **Passe les QCM** mis à disposition à la fin de chaque session
- **Donne son avis** via le formulaire de feedback (totalement facultatif — peut choisir de ne pas répondre)
- Consulte ses **propres résultats QCM** uniquement
- Voit son **statut de présence** (Présent / Absent justifié / Absent non justifié / Retard)

**Mode :** Apprenant — consomme les ressources sans créer ni modifier de données de gestion.

---

#### 🔴 RÔLE 5 — Formateur (Contexte : Animateur) (`FORMATEUR / FA`)
> Formateur OFPPT affecté comme encadrant pour une formation spécifique

**Nature du rôle :** Contextuel — un formateur joue ce rôle uniquement pour les formations où il a été affecté comme animateur d'un thème lors de la création du plan.

**Dans le contexte d'une formation où il est animateur :**
- Consulte les sessions auxquelles il est **affecté comme animateur**
- **Saisit les présences et absences** des participants (statuts : Présent / Absent justifié / Absent non justifié / Retard)
- **Crée les QCM** avant ou pendant la session (questions à choix multiple)
- Déclenche la **mise à disposition du QCM** en fin de session
- **Upload les supports pédagogiques** (cours, comptes rendus, ressources)
- Consulte les **résultats individuels** et les statistiques globales de sa session

**Mode :** Encadrant — gère l'exécution opérationnelle de la session.

> **Dualité Animateur / Participant :**
> ```
> FORMATEUR OFPPT (compte unique dans le système)
>        │
>    ┌───┴───────────────────┐
>    │                       │
> [Formation A]         [Formation B]
> Rôle : ANIMATEUR      Rôle : PARTICIPANT
>   ↓                       ↓
> Saisit présences       Passe le QCM
> Crée QCM               Donne feedback
> Upload supports         Voit ses résultats
> ```
> C'est le **Responsable Formation** qui détermine le rôle contextuel de chaque formateur lors de la création du plan (étape 3 : animateurs par thème / étape 4 : participants).

---

#### ⚙️ RÔLE 6 — Administrateur Système (`ADMIN`)
> Super-utilisateur technique et organisationnel

**Positionnement :** Garant du bon fonctionnement du système. N'intervient pas dans le processus métier de formation.

**Responsabilités :**
- Crée, modifie et désactive les **comptes utilisateurs**
- Assigne les **rôles système** aux utilisateurs
- Gère le référentiel métier : **régions, instituts (établissements), CDCs, secteurs, domaines, sites de formation et d'hébergement**
- Consulte le **journal d'audit complet** (toutes les actions, tous les utilisateurs)
- **Déverrouille** les présences après clôture de session (seul acteur autorisé — RG08)
- Configure les **paramètres globaux** du système
- Dispose des droits CRUD complets sur toutes les entités

---

### 4.3 Matrice des Permissions par Module

| Module | CDC | RF | DR | FA* | FP* | ADMIN |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Entités de formation | C/R/U | C/R/U | R | — | — | C/R/U/D |
| Plans de formation | C/R/U/S | C/R/U/V | R (région) | — | — | R/D |
| Sessions | — | C/R/U | R (région) | R | R | R/D |
| Participants | C/R | C/R | R (région) | R | R | R |
| Présences/absences | — | R | R (région) | **C/R/U** | R | R |
| QCM | — | R stats | R stats | **C/R/U** | Passer | R |
| Feedback | C questions | C questions | R stats | — | **Répondre** | R |
| Documents | C/R | C/R/U | R | C/R | R | R/D |
| Logistique | C/R/U | C/R/U | R (région) | — | — | R |
| Rapports | R limité | R complet | R (région) | — | — | R complet |
| Administration | — | — | — | — | — | **Complet** |
| Journal audit | — | — | — | — | — | R complet |

*FA et FP sont des rôles contextuels : les permissions s'appliquent uniquement dans le périmètre des formations où le formateur a été affecté comme Animateur ou Participant.*

**Légende :** C=Créer · R=Lire · U=Modifier · D=Supprimer · S=Soumettre · V=Valider

---

## 5. PROCESSUS MÉTIER DE BOUT EN BOUT

### 5.1 Vue d'Ensemble du Flux (14 Étapes Séquentielles)

| Étape | Action | Acteur |
|---|---|---|
| 1 | Création d'une Entité de Formation | CDC ou RF |
| 2 | Création d'un Plan de Formation basé sur l'entité | CDC ou RF |
| 3 | Soumission du plan (CDC uniquement — le RF confirme directement) | CDC |
| 4 | Validation ou rejet du plan par le RF | RF |
| 5 | Confirmation et publication du plan | RF |
| 6 | Planification des sessions (dates, sites, animateurs contextuels, participants) | RF |
| 7 | Upload des PDFs de convocation (liste participants + liste animateurs) | RF |
| 8 | Transmission manuelle des convocations au DR | RF → DR (hors système) |
| 9 | Transmission aux établissements | DR → Établissements (hors système) |
| 10 | Exécution de la session | FA (Animateur) |
| 11 | Saisie des présences/absences par l'animateur | FA |
| 12 | Diffusion du QCM en fin de session — participants notifiés | Système automatique |
| 13 | Collecte des feedbacks (si formulaire créé) | FP (Participant) |
| 14 | Consolidation des statistiques, archivage et clôture de la session | RF / ADMIN |

### 5.2 Workflow de Validation des Plans

#### Chemin A — Plan créé par le CDC

```
┌─────────────────────────────────────────────────────────────┐
│  ÉTAPE 1 : CDC crée le plan (statut : Brouillon)            │
│  ÉTAPE 2 : CDC soumet le plan (statut : Soumis)             │
│              ↓                                              │
│  ÉTAPE 3 : RF reçoit notification email + in-app            │
│              ↓                                              │
│         ┌────┴──────────────┐                               │
│    [VALIDE]              [REJETTE + motif obligatoire]       │
│         ↓                        ↓                          │
│  Statut : Confirmé        Statut : Rejeté                   │
│  Sessions planifiables    CDC notifié avec motif            │
│                                  ↓                          │
│                    ÉTAPE 4 : CDC modifie et re-soumet        │
└─────────────────────────────────────────────────────────────┘
```

#### Chemin B — Plan créé par le RF

```
┌─────────────────────────────────────────────────────────────┐
│  ÉTAPE 1 : RF crée le plan (statut : Brouillon)             │
│  ÉTAPE 2 : RF confirme directement le plan                  │
│              ↓                                              │
│  Statut : Confirmé — Sessions planifiables immédiatement    │
└─────────────────────────────────────────────────────────────┘
```

#### États d'un Plan

| Statut | Description | Transition suivante possible |
|---|---|---|
| **Brouillon** | Plan en cours de rédaction, non soumis | → Soumis (CDC) ou → Confirmé (RF) |
| **Soumis** | Envoyé au RF pour validation (CDC uniquement) | → Validé ou → Rejeté |
| **Validé** | Approuvé par le RF | → Confirmé |
| **Rejeté** | Refusé par le RF avec motif | → Brouillon (CDC modifie) |
| **Confirmé** | Plan actif, sessions planifiables | → Archivé |
| **Archivé** | Formation terminée et clôturée | — |

### 5.3 Processus de Convocation

Après confirmation du plan et planification des sessions, le RF prépare deux PDFs distincts et les uploade dans le système :

| Document | Contenu |
|---|---|
| **Convocation Participants** | Nom, prénom, ID formateur, établissement, région, secteur, domaine |
| **Convocation Animateurs** | Nom, prénom, ID formateur, établissement, région, secteur, domaine |

**Circuit de transmission :**
```
RF uploade PDFs dans SGAFO
    → DR notifié in-app + email
    → RF envoie manuellement les PDFs au DR (email institutionnel)
    → DR transmet aux établissements (hors système)
    → Établissements confirment participation (hors système — version actuelle)
```

---

## 6. EXIGENCES FONCTIONNELLES DÉTAILLÉES

### 6.1 Gestion du Catalogue (Entités de Formation)

Le module **Catalogue** a été repensé pour offrir une vue "Fiche Technique" ultra-lisible, séparant les données conceptuelles du contenu pédagogique.

#### A. Ergonomie de Consultation (Fiche Détails)
L'affichage est structuré en **deux fenêtres distinctes** :
- **Fenetre Information Globale** : Identité de la formation (ID, Titre, Secteur, Volume, Mode) et Objectifs globaux.
- **Fenetre Curriculum** : Présentation du programme sous forme de **Tableau strict** (N°, Intitule, Durée, Contenu).

#### B. Ergonomie de Saisie (Ajout/Modification)
La création suit la même logique de séparation pour une saisie rapide et sans erreur :
- **Bloc 1** : Formulaire des métadonnées (Secteur, Type, Mode).
- **Bloc 2** : **Tableau de saisie dynamique** des thèmes. Chaque ligne est un module éditable en temps réel.
- **Fonctionnalité clé** : Calcul automatique et dynamique de la durée totale de la formation à mesure que les modules sont saisis.

#### C. Règles de gestion (Entités) :
- **Mode de formation** : Définit les contraintes logistiques (Présentiel, Distance, Hybride).
- **Archivage permanent** : Une entité ne peut être supprimée physiquement si elle est liée à un plan. Elle passe au statut `archivé`, ce qui la rend invisible pour les nouveaux plans tout en conservant l'historique (RG14).
- **Consistance** : Chaque entité est rattachée à un `Secteur` et un `Type` (Technique, Pédagogique, etc.).
### 6.2 Gestion des Plans de Formation

Un plan est l'application concrète et détaillée d'une entité, créée via un **stepper guidé en 6 étapes**.

#### Stepper de Création d'un Plan

| Étape | Contenu | Acteur |
|---|---|---|
| **Étape 1** | Choix de l'entité de référence | CDC ou RF |
| **Étape 2** | Thèmes — ajout/modification (nom, durée, objectifs) | CDC ou RF |
| **Étape 3** | Animateurs — affectation d'un ou **plusieurs formateurs animateurs (co-animation)** par thème → `plan_theme_animateurs` | CDC ou RF |
| **Étape 4** | Participants — sélection directe des formateurs participants avec filtres région/établissement/domaine → `plan_participants` | CDC ou RF |
| **Étape 5** | Logistique — hébergement, déplacements, site de formation | CDC ou RF |
| **Étape 6** | Récapitulatif et soumission (CDC) ou confirmation directe (RF) | CDC ou RF |

> **Important :** À l'étape 3, les formateurs sélectionnés comme animateurs jouent le rôle contextuel **FA** pour ce plan. À l'étape 4, les formateurs sélectionnés jouent le rôle contextuel **FP** pour ce plan. Un même formateur peut théoriquement être dans les deux listes (animateur d'un thème ET participant), mais cela doit être géré par règle métier.

### 6.3 Gestion des Sessions

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| Plan associé | FK → plans_formation | ✅ | Plan confirmé de référence |
| Date début | TIMESTAMP | ✅ | Début de la session |
| Date fin | TIMESTAMP | ✅ | Fin de la session |
| Site de formation | FK → sites_formation | ✅ | Lieu d'exécution |
| Capacité | INTEGER | ✅ | Nombre maximum de participants |
| Animateurs affectés | FK → plan_theme_animateurs | ✅ | Formateurs animateurs pour cette session |
| Participants affectés | FK → plan_participants | ✅ | Formateurs participants sélectionnés |
| Statut | ENUM | ✅ | `Planifiée` / `En cours` / `Terminée` / `Annulée` |
| Créé par | FK → utilisateurs | ✅ | RF planificateur |

### 6.4 Présences et Absences

| Aspect | Détail |
|---|---|
| **Qui saisit ?** | Uniquement le Formateur Animateur de la session (rôle contextuel FA) |
| **Statuts disponibles** | Présent · Absent justifié · Absent non justifié · Retard |
| **Restriction** | Saisie uniquement pour les participants affectés à la session |
| **Verrouillage** | Saisie verrouillée automatiquement après clôture de la session |
| **Dérogation** | Seul l'ADMIN peut déverrouiller une saisie après clôture (RG08) |
| **Export** | Liste de présence exportable en PDF |
| **Alertes** | Tableau de bord des absences avec alertes en cas de dépassement de seuil |

### 6.5 Module QCM par Session

#### Cycle de Vie du QCM

```
ANIMATEUR crée le QCM (avant/pendant la session)
    ↓
Ajoute les questions à choix multiple (librement rédigées)
    ↓
QCM sauvegardé — visible_participants = FALSE (invisible aux FP)
    ↓
RF/Animateur déclenche la fin de session
    ↓
visible_participants → TRUE
    ↓
Notification automatique aux participants : "Un QCM est disponible"
    ↓
Chaque participant accède au QCM et soumet ses réponses
    ↓
Score calculé automatiquement et enregistré en BDD
    ↓
Résultats visibles selon les droits de chaque rôle
```

#### Visibilité des Résultats QCM

| Rôle | Accès aux résultats |
|---|---|
| CDC | Statistiques : nombre de passages, moyenne, taux de réussite par session |
| RF | Statistiques complètes : par session, animateur, thème, période |
| DR | Statistiques de sa région uniquement |
| FA (Animateur) | Résultats individuels de chaque participant + statistiques globales |
| FP (Participant) | Ses propres résultats uniquement |

### 6.6 Feedback Post-Session

| Aspect | Détail |
|---|---|
| **Création** | Formulaire entièrement facultatif — RF ou CDC peut choisir de ne pas en créer |
| **Réponse** | Si créé, la réponse du participant reste facultative |
| **Questions** | Libres, créées par RF ou CDC, portant sur : animateurs, hébergement, site, organisation |
| **Timing** | Formulaire créable avant ou après chaque session |
| **Résultats** | Statistiques visibles pour CDC, RF et DR (région uniquement pour DR) |
| **Anonymat** | Non précisé dans la v2 — à définir |

### 6.7 Gestion Documentaire

| Type de document | Uploadé par | Destinataires |
|---|---|---|
| Convocation participants (PDF) | RF | DR, ADMIN |
| Convocation animateurs (PDF) | RF | DR, ADMIN |
| Support pédagogique | FA (Animateur) | FP, RF, CDC |
| Compte rendu | FA (Animateur) | RF, CDC, DR |
| Attestation | RF | FP concernés |

**Fonctionnalités documentaires :**
- Versioning : chaque nouvelle version remplace l'ancienne en vue principale, les anciennes versions sont archivées et accessibles selon le rôle
- Classement : par entité / plan / session / type de document
- Recherche avancée par métadonnées (auteur, date, type, version)
- Droits d'accès contrôlés par rôle et contexte

### 6.8 Logistique Étendue

| Sous-module | Données gérées |
|---|---|
| **Hébergement** | Multi-sites avec affectation nominative individuelle (un utilisateur → un hébergement spécifique) |
| **Déplacements** | Origine, destination, horaire, mode de transport |
| **Sites de formation** | Nom, adresse complète, ville, région, contact, téléphone, statut de disponibilité |

**Alertes de conflit :**
- Capacité d'hébergement insuffisante → alerte bloquante avant confirmation (RG13)
- Site indisponible sur la période choisie → alerte avant planification session

### 6.9 Notifications

| Événement déclencheur | Destinataires | Canal |
|---|---|---|
| Plan soumis par CDC | Responsable Formation | Email + In-app |
| Plan validé | CDC concerné | Email + In-app |
| Plan rejeté (avec motif) | CDC concerné | Email + In-app |
| Plan confirmé/publié | Animateurs + Participants | Email + In-app |
| Session planifiée | Animateurs + Participants | Email + In-app |
| Rappel J-2 avant session | Animateurs + Participants | Email + In-app |
| QCM disponible (fin session) | Participants de la session | Email + In-app |
| Feedback disponible | Participants (si formulaire créé) | Email + In-app |
| Absence enregistrée | Participant concerné | Email + In-app |
| Document uploadé (convocation) | DR concerné | Email + In-app |

---

## 7. RÈGLES DE GESTION

| ID | Règle | Impact sur l'implémentation |
|---|---|---|
| **RG01** | Un plan CDC doit obligatoirement être soumis puis validé par le RF avant publication | Gating sur les routes/actions — le plan ne passe en `Confirmé` que via validation RF |
| **RG02** | Un plan créé par le RF est confirmé directement par lui-même, sans validation externe | Distinction CDC/RF dans les contrôleurs de plan |
| **RG03** | En cas de rejet, le CDC peut modifier le même plan et le re-soumettre. Le motif de rejet est obligatoire | Validation backend : motif non vide si statut = rejeté |
| **RG04** | La même entité peut générer plusieurs plans distincts (à des périodes différentes) | Pas de contrainte UNIQUE sur entite_id dans plans_formation |
| **RG05** | Les participants sont sélectionnés directement par l'auteur du plan. Il n'y a pas d'inscription libre | Pas de page ou formulaire d'inscription publique |
| **RG06** | Un participant ne peut être affecté qu'une seule fois à une même session | Contrainte UNIQUE (session_id, participant_id) dans la table presences |
| **RG07** | Les présences/absences ne peuvent être saisies que pour les participants affectés à la session | Vérification d'appartenance avant toute saisie |
| **RG08** | La saisie des présences est verrouillée après clôture de la session, sauf dérogation ADMIN | Champ `verrouille` BOOLEAN + middleware de vérification + action ADMIN exclusive |
| **RG09** | Le QCM n'est accessible aux participants qu'après la fin officielle de la session | Champ `visible_participants` = false jusqu'à clôture |
| **RG10** | Le feedback est facultatif : le créateur peut ne pas en créer, et le participant peut ne pas répondre | Aucune validation bloquante liée au feedback |
| **RG11** | Toute transition d'état d'un plan est tracée avec horodatage et acteur | Observer Eloquent sur PlanFormation → insertion dans journal_audit |
| **RG12** | Le Responsable DR ne voit que les données de la région qui lui est assignée par l'ADMIN | GlobalScope Eloquent appliqué systématiquement |
| **RG13** | Les conflits logistiques bloquants génèrent une alerte avant confirmation | Vérification capacité hébergement avant validation de la session |
| **RG14** | Une entité archivée ne peut plus générer de nouveaux plans | Vérification du statut de l'entité lors de la création du plan |
| **RG15** | Les documents de convocation sont uploadés par le RF et transmis manuellement au DR | Upload dans le système + notification DR, transmission réelle hors système |

---

## 8. EXIGENCES NON FONCTIONNELLES

### 8.1 Sécurité

| Exigence | Détail |
|---|---|
| Authentification | Login/mot de passe sécurisé, session expirante |
| Autorisation | RBAC à deux niveaux (rôle système + rôle contextuel) |
| Protection web | CSRF, XSS, injection SQL (Laravel natif + validation stricte) |
| Chiffrement | HTTPS en transit, données sensibles chiffrées au repos |
| Journal d'audit | Immuable — aucune modification ni suppression autorisée, même par ADMIN |
| Session | Politique de session sécurisée (expiration, déconnexion automatique après inactivité) |

### 8.2 Performance

| Exigence | Critère |
|---|---|
| Temps de réponse | < 3 secondes sur les opérations courantes |
| Pagination | Automatique sur toutes les listes volumineuses |
| Requêtes | Optimisation des requêtes N+1, indexation BDD sur les clés étrangères et champs filtrés |

### 8.3 Disponibilité et Fiabilité

- Gestion gracieuse des erreurs utilisateur (messages clairs) et techniques (logs)
- Sauvegarde régulière de la base de données et des fichiers uploadés
- Procédure de reprise après incident documentée

### 8.4 Maintenabilité

- Architecture modulaire : un module = un domaine fonctionnel
- Conventions de code documentées (PSR-12 pour Laravel, ESLint pour React)
- Tests unitaires, d'intégration et fonctionnels

### 8.5 Design System & Identité Visuelle (SGAFO SaaS Modern)

Le système adopte les codes visuels des solutions SaaS haut de gamme ("Aesthetic Premium") pour maximiser l'adoption utilisateur.

| Élément | Spécification Design v2.0 |
|---|---|
| **Palette de couleurs** | **Slate 900** (Structure/Sidebar), **Blanc Pur** (Contenu), **Bleu Royal #2563eb** (Actions) |
| **Bordures (Radius)** | Style géométrique sobre : `rounded-xl` (Boutons/Inputs), `rounded-2xl` (Cartes/Modales) |
| **Typographie** | **Inter / Sans-serif** : Poids lourd (Black) pour les titres, Bold pour la navigation |
| **Navigation** | **Sidebar fixe** (Verticale gauche) et **Top Bar minimaliste** avec fil d'ariane |
| **Mise en page** | Structure en **Blocs/Fenetres** distincts délimités par des bordures légères |
| **Imagerie** | Utilisation exclusive d'icônes filaires (Outline) pour une allure industrielle |

---

## 9. ARCHITECTURE APPLICATIVE ET TECHNOLOGIES

### 9.1 Stack Technologique

| Couche | Technologie | Rôle dans SGAFO |
|---|---|---|
| **Backend** | Laravel (PHP) | Routes, règles métier, workflow, sécurité, RBAC, Observers |
| **Couche rendu** | Inertia.js | Pont Laravel/React — SPA sans API REST séparée |
| **Frontend** | React.js | Composants UI, stepper, dashboards, interactions dynamiques |
| **Base de données** | PostgreSQL | Stockage relationnel, intégrité référentielle, JSONB, reporting SQL avancé |
| **File d'attente** | Laravel Queues | Traitement asynchrone des notifications email |
| **Stockage fichiers** | Laravel Storage | PDFs convocations, supports pédagogiques |

### 9.2 Flux Applicatif

```
1. L'utilisateur interagit avec un composant React
2. La requête est envoyée à Laravel via Inertia (router Inertia)
3. Laravel vérifie l'authentification (session) et les autorisations (RBAC)
4. Laravel applique les règles métier et les scopes (ex: région DR)
5. Laravel lit/écrit dans PostgreSQL via Eloquent ORM
6. Laravel renvoie la réponse Inertia (props JSON)
7. React met à jour l'interface sans rechargement complet de la page
```

### 9.3 Pattern RBAC Contextuel (Implémentation Recommandée)

```php
// Middleware statique (rôle système)
Route::middleware(['auth', 'role:FORMATEUR'])
    ->group(function () {

    // Gate contextuelle (rôle par formation)
    Route::post('/sessions/{session}/presences', [PresenceController::class, 'store'])
         ->middleware('can:saisir-presences,session');
         // → vérifie que le formateur est dans plan_theme_animateurs pour ce plan
});

// Helper contextuel
public function isAnimateur(int $planId): bool {
    return PlanThemeAnimateur::where('animateur_id', $this->id)
        ->whereHas('theme', fn($q) => $q->where('plan_id', $planId))
        ->exists();
}

public function isParticipant(int $planId): bool {
    return PlanParticipant::where('participant_id', $this->id)
        ->where('plan_id', $planId)
        ->exists();
}
```

---

## 10. MODÈLE DE DONNÉES

### 10.1 Vue d'Ensemble

La base de données SGAFO comprend **20 tables** organisées en **6 domaines fonctionnels**.

```
DOMAINE 1 : Utilisateurs & Accès
  └── utilisateurs, roles, utilisateurs_roles, regions, instituts, region_user, institut_user

DOMAINE 2 : Entités & Plans de formation
  └── entites_formation, plans_formation, plan_themes,
      plan_theme_animateurs, plan_participants

DOMAINE 3 : Sessions & Présences
  └── sessions_formation, presences, sites_formation

DOMAINE 4 : QCM & Feedback
  └── qcm, qcm_questions, qcm_reponses,
      formulaires_feedback, feedback_questions, feedback_reponses

DOMAINE 5 : Documents & Logistique
  └── documents, hebergements, sites_formation

DOMAINE 6 : Notifications & Audit
  └── notifications, journal_audit
```

### 10.2 Domaine 1 — Utilisateurs & Accès

#### Table `utilisateurs`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | BIGSERIAL | PK | Identifiant auto-incrémenté |
| nom | VARCHAR(100) | NOT NULL | Nom de famille |
| prenom | VARCHAR(100) | NOT NULL | Prénom |
| email | VARCHAR(150) | UNIQUE NOT NULL | Email de connexion |
| password_hash | VARCHAR(255) | NOT NULL | Mot de passe hashé (bcrypt) |
| statut | ENUM | NOT NULL | `actif` / `inactif` / `suspendu` |
| is_externe | BOOLEAN | DEFAULT false | Si true, formateur externe n'ayant pas d'institut |
| created_at / updated_at | TIMESTAMP | NOT NULL | Horodatage automatique |

#### Table `roles`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | BIGSERIAL | PK | — |
| code | VARCHAR(50) | UNIQUE NOT NULL | `CDC` / `RF` / `DR` / `FORMATEUR` / `ADMIN` |
| libelle | VARCHAR(100) | NOT NULL | Libellé affiché |

> **Note :** Le code `FORMATEUR` remplace les anciens codes `FA` et `FP`. Le rôle contextuel animateur/participant est déterminé par les tables `plan_theme_animateurs` et `plan_participants`.

#### Table `utilisateurs_roles`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| utilisateur_id | BIGINT | PK, FK → utilisateurs | — |
| role_id | BIGINT | PK, FK → roles | Clé composite |
| assigned_at | TIMESTAMP | NOT NULL | Date d'affectation |
| assigned_by | BIGINT | FK → utilisateurs | Admin qui a assigné |

#### Table `regions`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | BIGSERIAL | PK | — |
| nom | VARCHAR(100) | NOT NULL | Nom de la région |
| code | VARCHAR(20) | UNIQUE NOT NULL | Code région OFPPT |

#### Table `instituts`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | BIGSERIAL | PK | — |
| nom | VARCHAR(200) | NOT NULL | Nom de l'établissement |
| code | VARCHAR(50) | UNIQUE | Code structure EFP |
| region_id | BIGINT | FK → regions | Région de rattachement |

#### Table `region_user` (Pivot d'affectation)
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| user_id | BIGINT | PK, FK → utilisateurs | Responsable DR, CDC |
| region_id | BIGINT | PK, FK → regions | Région supervisée |

#### Table `institut_user` (Pivot d'affectation)
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| user_id | BIGINT | PK, FK → utilisateurs | Formateur Interne |
| institut_id | BIGINT | PK, FK → instituts | Institut(s) où il exerce |

> **Formateur Externe vs Interne :** 
> Les utilisateurs ayant le rôle `FORMATEUR` et l'option `is_externe = true` ont un accès métier restreint au système. Contrairement aux internes, ils ne sont rattachés à aucun Institut OFPPT. Leur espace est limité à la simple consultation et animation de leurs propres sessions, sans accès aux autres modules globaux ou aux annuaires internes.

### 10.3 Domaine 2 — Entités & Plans de Formation

#### Table `entites_formation`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | BIGSERIAL | PK | — |
| titre | VARCHAR(200) | NOT NULL | Intitulé de l'idée de formation |
| domaine | VARCHAR(100) | NOT NULL | Domaine pédagogique/technique |
| description | TEXT | — | Description générale |
| objectifs | TEXT | NOT NULL | Compétences visées |
| statut | ENUM | NOT NULL | `actif` / `archivé` |
| cree_par | BIGINT | FK → utilisateurs | CDC ou RF créateur |
| created_at / updated_at | TIMESTAMP | NOT NULL | — |

#### Table `plans_formation`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | BIGSERIAL | PK | — |
| entite_id | BIGINT | FK → entites_formation | Entité de référence |
| titre | VARCHAR(200) | NOT NULL | Titre du plan |
| statut | ENUM | NOT NULL | `brouillon`/`soumis`/`validé`/`rejeté`/`confirmé`/`archivé` |
| motif_rejet | TEXT | — | Obligatoire si statut=rejeté |
| cree_par | BIGINT | FK → utilisateurs | CDC ou RF |
| valide_par | BIGINT | FK → utilisateurs | RF validateur (NULL si créé par RF) |
| date_soumission | TIMESTAMP | — | — |
| date_validation | TIMESTAMP | — | — |
| created_at / updated_at | TIMESTAMP | NOT NULL | — |

#### Table `plan_themes`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | BIGSERIAL | PK | — |
| plan_id | BIGINT | FK → plans_formation | — |
| nom | VARCHAR(200) | NOT NULL | Nom du thème |
| duree_heures | DECIMAL(5,1) | NOT NULL | Durée en heures |
| objectifs | TEXT | — | Objectifs du thème |
| ordre | INTEGER | NOT NULL | Ordre d'affichage |

#### Table `plan_theme_animateurs`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| theme_id | BIGINT | PK, FK → plan_themes | — |
| animateur_id | BIGINT | PK, FK → utilisateurs | **Formateur jouant le rôle Animateur sur ce thème** |

#### Table `plan_participants`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| plan_id | BIGINT | PK, FK → plans_formation | — |
| participant_id | BIGINT | PK, FK → utilisateurs | **Formateur jouant le rôle Participant dans ce plan** |
| added_by | BIGINT | FK → utilisateurs | Auteur du plan qui a sélectionné |
| added_at | TIMESTAMP | NOT NULL | — |

### 10.4 Domaine 3 — Sessions & Présences

#### Table `sessions_formation`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | BIGSERIAL | PK | — |
| plan_id | BIGINT | FK → plans_formation | Plan confirmé associé |
| date_debut | TIMESTAMP | NOT NULL | — |
| date_fin | TIMESTAMP | NOT NULL | — |
| site_id | BIGINT | FK → sites_formation | Lieu d'exécution |
| capacite | INTEGER | NOT NULL | Nombre max de participants |
| statut | ENUM | NOT NULL | `planifiée`/`en_cours`/`terminée`/`annulée` |
| created_by | BIGINT | FK → utilisateurs | RF planificateur |
| created_at / updated_at | TIMESTAMP | NOT NULL | — |

#### Table `presences`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| session_id | BIGINT | PK, FK → sessions_formation | — |
| participant_id | BIGINT | PK, FK → utilisateurs | Formateur participant |
| statut_presence | ENUM | NOT NULL | `présent`/`absent_justifié`/`absent_non_justifié`/`retard` |
| saisi_par | BIGINT | FK → utilisateurs | Animateur qui a saisi |
| saisi_at | TIMESTAMP | NOT NULL | — |
| verrouille | BOOLEAN | DEFAULT false | Verrouillé après clôture session |

#### Table `sites_formation`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | BIGSERIAL | PK | — |
| nom | VARCHAR(200) | NOT NULL | Nom du site |
| adresse | TEXT | NOT NULL | Adresse complète |
| ville | VARCHAR(100) | NOT NULL | — |
| region_id | BIGINT | FK → regions | — |
| contact | VARCHAR(200) | — | Personne de contact |
| telephone | VARCHAR(20) | — | — |
| statut | ENUM | NOT NULL | `disponible`/`indisponible` |

### 10.5 Domaine 4 — QCM & Feedback

#### Table `qcm`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | BIGSERIAL | PK | — |
| session_id | BIGINT | FK → sessions_formation | Session associée |
| titre | VARCHAR(200) | NOT NULL | Titre du QCM |
| cree_par | BIGINT | FK → utilisateurs | Formateur animateur |
| visible_participants | BOOLEAN | DEFAULT false | Devient true en fin de session |
| created_at | TIMESTAMP | NOT NULL | — |

#### Table `qcm_questions`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | BIGSERIAL | PK | — |
| qcm_id | BIGINT | FK → qcm | — |
| texte | TEXT | NOT NULL | Texte de la question |
| choix | JSONB | NOT NULL | Tableau des options : `[{label, is_correct}]` |
| ordre | INTEGER | NOT NULL | Ordre d'affichage |

#### Table `qcm_reponses`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| qcm_id | BIGINT | PK, FK → qcm | — |
| participant_id | BIGINT | PK, FK → utilisateurs | Formateur participant |
| reponses | JSONB | NOT NULL | Tableau `{question_id, choix_selectionne}` |
| score | DECIMAL(5,2) | NOT NULL | Score calculé en % |
| soumis_at | TIMESTAMP | NOT NULL | — |

#### Table `formulaires_feedback`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | BIGSERIAL | PK | — |
| session_id | BIGINT | FK → sessions_formation | — |
| cree_par | BIGINT | FK → utilisateurs | RF ou CDC |
| created_at | TIMESTAMP | NOT NULL | — |

#### Table `feedback_questions`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | BIGSERIAL | PK | — |
| formulaire_id | BIGINT | FK → formulaires_feedback | — |
| texte | TEXT | NOT NULL | Texte de la question |
| categorie | VARCHAR(100) | — | `animateur`/`hébergement`/`site`/`organisation` |
| ordre | INTEGER | NOT NULL | — |

#### Table `feedback_reponses`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| formulaire_id | BIGINT | PK, FK → formulaires_feedback | — |
| participant_id | BIGINT | PK, FK → utilisateurs | — |
| reponses | JSONB | NOT NULL | Tableau `{question_id, reponse_texte}` |
| soumis_at | TIMESTAMP | NOT NULL | — |

### 10.6 Domaine 5 — Documents & Logistique

#### Table `documents`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | BIGSERIAL | PK | — |
| session_id | BIGINT | FK → sessions_formation | — |
| plan_id | BIGINT | FK → plans_formation | (optionnel) |
| type | ENUM | NOT NULL | `convocation_participants`/`convocation_animateurs`/`support`/`compte_rendu`/`attestation` |
| nom_fichier | VARCHAR(255) | NOT NULL | Nom original du fichier |
| chemin_stockage | VARCHAR(500) | NOT NULL | Chemin sur le serveur |
| version | INTEGER | DEFAULT 1 | Numéro de version |
| uploade_par | BIGINT | FK → utilisateurs | — |
| created_at | TIMESTAMP | NOT NULL | — |

#### Table `hebergements`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | BIGSERIAL | PK | — |
| session_id | BIGINT | FK → sessions_formation | — |
| lieu | VARCHAR(200) | NOT NULL | Lieu d'hébergement |
| capacite | INTEGER | NOT NULL | Capacité totale |
| places_utilisees | INTEGER | DEFAULT 0 | — |
| statut | ENUM | NOT NULL | `disponible`/`complet`/`indisponible` |

### 10.7 Domaine 6 — Notifications & Audit

#### Table `notifications`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | BIGSERIAL | PK | — |
| utilisateur_id | BIGINT | FK → utilisateurs | Destinataire |
| type | VARCHAR(100) | NOT NULL | `plan_soumis`/`plan_validé`/`qcm_disponible`/... |
| titre | VARCHAR(200) | NOT NULL | Titre affiché |
| message | TEXT | NOT NULL | Corps de la notification |
| lu | BOOLEAN | DEFAULT false | — |
| lien | VARCHAR(500) | — | URL de redirection |
| created_at | TIMESTAMP | NOT NULL | — |

#### Table `journal_audit`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | BIGSERIAL | PK | — |
| utilisateur_id | BIGINT | FK → utilisateurs | Acteur de l'action |
| action | VARCHAR(200) | NOT NULL | Description de l'action |
| entite_type | VARCHAR(100) | NOT NULL | Table concernée (ex: `plans_formation`) |
| entite_id | BIGINT | NOT NULL | ID de l'enregistrement concerné |
| ancien_statut | VARCHAR(50) | — | État avant (pour transitions) |
| nouveau_statut | VARCHAR(50) | — | État après |
| metadata | JSONB | — | Données contextuelles additionnelles |
| created_at | TIMESTAMP | NOT NULL | **Immuable — aucun UPDATE/DELETE autorisé** |

---

## 11. DIAGRAMMES D'ANALYSE UML

### 11.1 Acteurs et Cas d'Utilisation Principaux

| Acteur | Cas d'utilisation principaux |
|---|---|
| CDC | Créer/modifier entité · Créer/modifier plan · Soumettre plan · Sélectionner participants · Préparer logistique · Créer questions feedback |
| RF | Créer/confirmer plan · Valider/rejeter plan CDC · Planifier sessions · Uploader convocations · Envoyer convocations DR · Créer questions feedback |
| DR | Consulter plans (région) · Consulter absences (région) · Consulter statistiques QCM/feedback (région) · Recevoir convocations |
| Formateur/Animateur | Consulter sessions · Saisir présences/absences · Créer QCM · Uploader supports pédagogiques |
| Formateur/Participant | Consulter convocations · Passer QCM · Répondre feedback (facultatif) · Consulter ses résultats |
| ADMIN | Gérer utilisateurs/rôles/régions · Configurer paramètres · Consulter journal audit · Déverrouiller présences |

### 11.2 Diagrammes de Séquence

#### DS1 — Création et soumission d'un plan par le CDC

| # | Acteur | Direction | Description |
|---|---|---|---|
| 1 | CDC | → Système | Sélectionne une entité de formation existante |
| 2 | Système | → CDC | Affiche le stepper de création du plan |
| 3 | CDC | → Système | Renseigne les 6 étapes (thèmes, animateurs, participants, logistique) |
| 4 | CDC | → Système | Clique sur "Soumettre" |
| 5 | Système | — | Passe le plan en statut "soumis", crée entrée dans journal_audit |
| 6 | Système | → RF | Envoie notification email + in-app : "Nouveau plan à valider" |

#### DS2 — Validation ou rejet du plan par le RF

| # | Acteur | Direction | Description |
|---|---|---|---|
| 1 | RF | → Système | Consulte le plan soumis |
| 2a | RF | → Système | Clique "Valider" |
| 3a | Système | — | Plan → statut "confirmé", journalise, notifie CDC |
| 4a | RF | → Système | Planifie les sessions de la formation |
| 2b | RF | → Système | Saisit le motif de rejet obligatoire et clique "Rejeter" |
| 3b | Système | — | Plan → statut "rejeté", journalise, notifie CDC avec motif |
| 4b | CDC | → Système | Consulte motif, modifie le plan, re-soumet |

#### DS3 — Saisie des présences par l'animateur

| # | Acteur | Direction | Description |
|---|---|---|---|
| 1 | Animateur | → Système | Ouvre la liste des participants de la session |
| 2 | Système | → Animateur | Affiche la liste (uniquement participants affectés à la session) |
| 3 | Animateur | → Système | Pour chaque participant : sélectionne le statut |
| 4 | Animateur | → Système | Sauvegarde les présences |
| 5 | Système | — | Enregistre en base, notifie chaque absent par email + in-app |
| 6 | RF/ADMIN | → Système | Clôture la session → présences verrouillées automatiquement |

#### DS4 — Cycle de vie du QCM

| # | Acteur | Direction | Description |
|---|---|---|---|
| 1 | Animateur | → Système | Crée le QCM (avant ou pendant la session) |
| 2 | Animateur | → Système | Ajoute les questions libres avec options de réponse |
| 3 | Système | — | QCM sauvegardé, `visible_participants` = false |
| 4 | RF/Animateur | → Système | Déclenche la fin de session |
| 5 | Système | — | QCM → `visible_participants` = true |
| 6 | Système | → Participants | Notification email + in-app : "Un QCM est disponible" |
| 7 | Participant | → Système | Accède au QCM et soumet ses réponses |
| 8 | Système | — | Score calculé automatiquement, résultat enregistré |

#### DS5 — Upload et transmission des convocations

| # | Acteur | Direction | Description |
|---|---|---|---|
| 1 | RF | → Système | Après confirmation du plan, accède à la gestion documentaire |
| 2 | RF | → Système | Uploade PDF 1 : liste des participants |
| 3 | RF | → Système | Uploade PDF 2 : liste des animateurs |
| 4 | Système | — | Documents enregistrés, DR notifié email + in-app |
| 5 | RF | → DR | Envoie manuellement les PDFs (email institutionnel, hors système) |
| 6 | DR | → Établissements | Transmet aux établissements (hors système) |

---

## 12. REPORTING ET ANALYTICS

### 12.1 Tableaux de Bord par Rôle

| Rôle | Indicateurs disponibles |
|---|---|
| **CDC** | Mes plans (statuts), participants sélectionnés, taux de complétion des sessions |
| **RF** | Plans en attente de validation, taux de validation, absences par session, statistiques QCM/feedback, planning global des sessions |
| **DR** | Plans de sa région, absences de sa région, statistiques QCM/feedback de sa région, progression par établissement |
| **Formateur/Animateur** | Sessions animées, présences saisies, résultats QCM de ses sessions |
| **Formateur/Participant** | Ses sessions, ses résultats QCM, statut de ses présences |

### 12.2 KPI Principaux

| KPI | Granularité |
|---|---|
| Taux de participation | Par session / formation / période / région |
| Taux d'absence (justifiée et non justifiée) | Par session / région / établissement |
| Taux de complétion des formations | Sessions terminées / planifiées |
| Score moyen QCM | Par session / animateur / thème / période |
| Taux de participation aux QCM | Participants ayant répondu / total affectés |
| Score moyen feedback | Par catégorie (animateur, hébergement, site, organisation) |

### 12.3 Exports

| Format | Contenu |
|---|---|
| **PDF** | Liste de présence, rapport de session, récapitulatif plan |
| **Excel/CSV** | Données brutes pour analyse externe (absences, QCM, feedback) |

---

## 13. LIVRABLES ET PLANIFICATION

### 13.1 Livrables

| # | Livrable | Description |
|---|---|---|
| 1 | Cahier des charges complet validé | Présent document |
| 2 | Maquettes UI des écrans principaux | Figma ou équivalent |
| 3 | Application SGAFO complète | Laravel + Inertia + React + PostgreSQL |
| 4 | Documentation technique | Architecture, schéma BDD, patterns |
| 5 | Guide utilisateur par rôle | CDC, RF, DR, Formateur, ADMIN |
| 6 | Plan de tests et rapport de recette | Tests unitaires, intégration, fonctionnels |

### 13.2 Phases de Réalisation

| Phase | Titre | Contenu |
|---|---|---|
| **Phase 1** | Cadrage et conception | Validation CDC, maquettes UI, schéma BDD final |
| **Phase 2** | Socle technique | Setup Laravel/Inertia/React/PostgreSQL, authentification, RBAC (statique + contextuel) |
| **Phase 3** | Modules cœur | Entités, plans, workflow validation, sessions, présences |
| **Phase 4** | Modules étendus | QCM, feedback, documentaire, logistique, notifications, reporting |
| **Phase 5** | Recette et déploiement | Tests, corrections, documentation, livraison |

---

## 14. GLOSSAIRE

| Terme | Définition |
|---|---|
| **OFPPT** | Office de la Formation Professionnelle et de la Promotion du Travail |
| **SGAFO** | Système de Gestion des Formations des Formateurs OFPPT — nom du projet |
| **CDC** | Centre de Développement des Compétences — entité régionale de l'OFPPT / Responsable de ce centre |
| **DR** | Direction Régionale — périmètre géographique de supervision |
| **RF** | Responsable Formation — acteur central de validation et de pilotage |
| **Formateur** | Employé de l'OFPPT qui peut jouer le rôle d'Animateur ou de Participant selon la formation |
| **Animateur (FA)** | Rôle contextuel — formateur qui encadre les sessions, saisit les présences, crée les QCM |
| **Participant (FP)** | Rôle contextuel — formateur qui suit la formation, passe les QCM, donne son feedback |
| **Rôle contextuel** | Rôle attribué à un formateur pour une formation spécifique, déterminé par son affectation dans le plan |
| **Entité de formation** | Idée ou concept de formation réutilisable (titre, objectifs, thèmes) |
| **Plan de formation** | Application concrète et détaillée d'une entité pour une période donnée |
| **Session** | Unité temporelle d'exécution d'une formation (date, lieu, animateurs, participants) |
| **QCM** | Questionnaire à Choix Multiples — outil de mesure de la compréhension post-session |
| **Feedback** | Formulaire d'évaluation qualitative post-session (entièrement facultatif) |
| **RBAC** | Role-Based Access Control — contrôle d'accès basé sur les rôles (statique et contextuel) |
| **KPI** | Key Performance Indicator — indicateur clé de performance |
| **Stepper** | Interface guidée étape par étape pour la création d'un plan |
| **Workflow** | Enchaînement formalisé d'étapes et d'acteurs pour un processus métier |
| **Inertia.js** | Pont entre Laravel et React — permet une SPA sans API REST séparée |
| **JSONB** | Type de données PostgreSQL pour stocker des données JSON avec indexation |

---

## 15. CONCLUSION

Le présent cahier des charges définit de manière complète et non ambiguë le système **SGAFO** pour l'OFPPT. Il couvre l'intégralité du cycle de vie de la gestion des formations des formateurs : de la conceptualisation d'une idée de formation (entité) jusqu'à l'évaluation post-session et le reporting décisionnel.

### Points Clés de la Solution

| Point clé | Description |
|---|---|
| **Workflow de validation clair** | Distinction formelle entre plans CDC (soumis → validé par RF) et plans RF (confirmés directement) |
| **Rôles contextuels des formateurs** | Un formateur peut être Animateur dans une formation et Participant dans une autre — déterminé par l'affectation dans le plan, pas par un rôle système fixe |
| **QCM par session contrôlé** | Créé par l'animateur, invisible jusqu'à la fin officielle de la session, avec calcul automatique du score |
| **Feedback entièrement facultatif** | Ni la création du formulaire ni la réponse du participant ne sont obligatoires |
| **Circuit de convocation formalisé** | Upload PDF dans le système + transmission manuelle DR pour la partie logistique hors système |
| **Visibilité régionale stricte pour le DR** | Scope de requête systématique sur toutes les données de la région assignée |
| **Traçabilité complète** | Journal d'audit immuable sur toutes les actions sensibles |
| **Modèle de données robuste** | 20 tables en 6 domaines, JSONB pour QCM/Feedback, contraintes d'intégrité référentielle complètes |

Ce système permettra à l'OFPPT de passer d'une gestion fragmentée et manuelle à une plateforme intégrée, traçable et orientée décision, renforçant ainsi la qualité des formations dispensées aux formateurs et, par extension, la qualité de l'enseignement professionnel au Maroc.

---

*SGAFO — Cahier des Charges v2.0 — OFPPT 2025–2026*
*Document enrichi le 14 Avril 2026 suite à l'analyse et aux clarifications apportées*
