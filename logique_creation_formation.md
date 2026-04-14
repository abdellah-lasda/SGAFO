# Logique Complète de Création d'une Formation — SGAFO

Ce document détaille le processus complet depuis l'idée d'une formation jusqu'à son exécution et son évaluation. Deux concepts fondamentaux sont à distinguer :

---

## 🔑 Concepts Fondamentaux

### Entité de Formation vs Plan de Formation

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   ENTITÉ DE FORMATION                PLAN DE FORMATION                  │
│   ═══════════════════                ═══════════════════                 │
│   L'IDÉE / LE CONCEPT              LA MISE EN ŒUVRE CONCRÈTE            │
│                                                                         │
│   • Réutilisable                    • Unique pour une période            │
│   • Pas de dates                    • Avec dates, lieux, personnes       │
│   • Pas de participants             • Animateurs + participants nommés   │
│   • Pas de logistique               • Hébergement, transport, sites      │
│   • Thèmes indicatifs               • Thèmes finalisés avec ordres       │
│                                                                         │
│   Exemple :                         Exemple :                            │
│   "Formation React.js Avancé"       "Formation React.js Avancé —         │
│                                      Session Mai 2026, Casablanca,       │
│                                      15 participants, 3 animateurs"      │
│                                                                         │
│              1 ENTITÉ  →→→  peut générer  →→→  N PLANS                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

> **Analogie simple :** L'entité est comme un **modèle de cours** dans un catalogue. Le plan est comme un **cours planifié** avec une date, un lieu et des inscrits.

---

## PHASE 1 — CRÉATION D'UNE ENTITÉ DE FORMATION

### Qui peut créer ?
- **Responsable CDC** (`CDC`)
- **Responsable de Formation** (`RF`)

### Données à renseigner

| # | Champ | Type | Obligatoire | Exemple |
|---|---|---|---|---|
| 1 | **Titre** | Texte | ✅ Oui | "Formation React.js Avancé pour Formateurs TDI" |
| 2 | **Domaine** | Liste déroulante | ✅ Oui | "Développement Web" |
| 3 | **Description** | Texte long | Non | "Cette formation vise à renforcer les compétences des formateurs en développement frontend avec React.js..." |
| 4 | **Objectifs** | Texte long | ✅ Oui | "À l'issue de cette formation, le formateur sera capable de : concevoir des composants React, gérer le state..." |
| 5 | **Thèmes** | Liste dynamique | ✅ Oui | Voir ci-dessous |
| 6 | **Statut** | Automatique | ✅ Oui | `actif` (par défaut à la création) |

### Thèmes indicatifs de l'entité

L'entité contient une **liste de thèmes** qui servent de base. Ces thèmes seront repris et personnalisés dans chaque plan.

| Thème | Durée indicative | Objectifs du thème |
|---|---|---|
| Introduction à React et JSX | 3h | Comprendre les fondamentaux de React |
| Gestion du State et Hooks | 4h | Maîtriser useState, useEffect, useContext |
| Routing et Navigation | 3h | Implémenter React Router pour une SPA |
| Connexion API et Fetch | 4h | Gérer les appels API avec fetch/axios |
| Projet pratique intégrateur | 6h | Réaliser un mini-projet complet |

### Cycle de vie de l'entité

```
          ┌──────────┐
          │  ACTIF   │
          └────┬─────┘
               │
         CDC ou RF décide  
         d'archiver l'entité
               │
          ┌────▼─────┐
          │ ARCHIVÉ  │ ← Ne peut plus générer de nouveaux plans (RG14)
          └──────────┘     Les plans existants restent actifs
```

### Interface utilisateur attendue

```
┌────────────────────────────────────────────────────────┐
│  NOUVELLE ENTITÉ DE FORMATION                          │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Titre *                                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Formation React.js Avancé pour Formateurs TDI    │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  Domaine *                                             │
│  ┌───────────────────────────────┐                     │
│  │ Développement Web         ▼  │                     │
│  └───────────────────────────────┘                     │
│                                                        │
│  Description                                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Cette formation vise à renforcer...              │  │
│  │                                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  Objectifs *                                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │ À l'issue de cette formation, le formateur...    │  │
│  │                                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  Thèmes *                                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 1. Introduction à React et JSX     3h    [✏️][🗑️] │  │
│  │ 2. Gestion du State et Hooks       4h    [✏️][🗑️] │  │
│  │ 3. Routing et Navigation           3h    [✏️][🗑️] │  │
│  │ 4. Connexion API et Fetch          4h    [✏️][🗑️] │  │
│  │ 5. Projet pratique intégrateur     6h    [✏️][🗑️] │  │
│  │                                                  │  │
│  │  [+ Ajouter un thème]                            │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│         [Annuler]                [Créer l'entité]      │
└────────────────────────────────────────────────────────┘
```

---

## PHASE 2 — CRÉATION D'UN PLAN DE FORMATION (Stepper 6 Étapes)

### Qui peut créer ?
- **Responsable CDC** (`CDC`) — devra soumettre pour validation par le RF
- **Responsable de Formation** (`RF`) — peut confirmer directement

### Vue d'ensemble du stepper

```
┌─────────┐    ┌─────────┐    ┌──────────────┐    ┌──────────────┐    ┌────────────┐    ┌──────────────┐
│ ÉTAPE 1 │───▶│ ÉTAPE 2 │───▶│   ÉTAPE 3    │───▶│   ÉTAPE 4    │───▶│  ÉTAPE 5   │───▶│   ÉTAPE 6    │
│ Entité  │    │ Thèmes  │    │  Animateurs  │    │ Participants │    │ Logistique │    │ Récapitulatif│
│         │    │         │    │  (par thème) │    │              │    │            │    │ + Soumission │
└─────────┘    └─────────┘    └──────────────┘    └──────────────┘    └────────────┘    └──────────────┘
     ▲              ▲               ▲                    ▲                 ▲                   ▲
     │              │               │                    │                 │                   │
  Sélection     Personnali-     Affectation          Sélection        Hébergement,        Relecture
  de l'entité   sation des      d'un formateur       directe des      déplacements,       complète
  de référence  thèmes          animateur par        formateurs       site                et action
                (du plan)       thème                participants                         finale
```

> Le stepper permet de naviguer entre les étapes : **Suivant / Précédent**. Le plan est sauvegardé comme **Brouillon** automatiquement à chaque étape. L'utilisateur peut quitter et reprendre plus tard.

---

### ÉTAPE 1 — Choix de l'Entité de Référence

**Objectif :** Sélectionner l'idée de formation qui sera le socle du plan.

**Ce que voit l'utilisateur :**

```
┌──────────────────────────────────────────────────────────────────┐
│  ÉTAPE 1 / 6 — Choix de l'entité de référence                   │
│  ● ○ ○ ○ ○ ○                                                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Rechercher une entité :  [____________________] [🔍]            │
│                                                                  │
│  Filtrer par domaine :  [Tous les domaines ▼]                    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ ○ Formation React.js Avancé                               │  │
│  │   Domaine : Développement Web                             │  │
│  │   Thèmes : 5 thèmes · 20h total                          │  │
│  │   Créé par : Ahmed El Fassi (CDC Casablanca)              │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │ ○ Pédagogie Active et Numérique                           │  │
│  │   Domaine : Pédagogie                                     │  │
│  │   Thèmes : 4 thèmes · 16h total                          │  │
│  │   Créé par : Fatima Zahraoui (RF)                         │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │ ○ Sécurité Réseau et Cybersécurité                        │  │
│  │   Domaine : Infrastructure                               │  │
│  │   Thèmes : 6 thèmes · 24h total                          │  │
│  │   Créé par : Karim Bennani (CDC Rabat)                    │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ⚠️ Seules les entités avec le statut "actif" sont affichées     │
│                                                                  │
│                                        [Suivant →]               │
└──────────────────────────────────────────────────────────────────┘
```

**Données enregistrées :** `plans_formation.entite_id` = ID de l'entité choisie.

**Ce qui se passe en arrière-plan :**
- Le système charge automatiquement les thèmes de l'entité pour l'étape 2
- Le plan est créé en statut `brouillon` dès la sélection

---

### ÉTAPE 2 — Personnalisation des Thèmes

**Objectif :** Adapter les thèmes de l'entité aux besoins spécifiques de ce plan. L'utilisateur peut modifier, ajouter ou supprimer des thèmes.

**Ce que voit l'utilisateur :**

```
┌──────────────────────────────────────────────────────────────────┐
│  ÉTAPE 2 / 6 — Thèmes de la formation                           │
│  ● ● ○ ○ ○ ○                                                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Titre du plan * :  [Formation React.js Avancé — Mai 2026    ]   │
│                                                                  │
│  Thèmes (repris de l'entité, personnalisables) :                 │
│                                                                  │
│  ┌ Thème 1 ─────────────────────────────────────────────────┐    │
│  │ Nom * :     [Introduction à React et JSX               ] │    │
│  │ Durée * :   [3   ] heures                                │    │
│  │ Objectifs : [Comprendre les fondamentaux de React,       │    │
│  │              maîtriser JSX et le rendu conditionnel      │    │
│  │                                                        ] │    │
│  │ Ordre :     [1]                        [↑] [↓] [🗑️]     │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌ Thème 2 ─────────────────────────────────────────────────┐    │
│  │ Nom * :     [Gestion du State et Hooks                 ] │    │
│  │ Durée * :   [4   ] heures                                │    │
│  │ Objectifs : [Maîtriser useState, useEffect, useContext   │    │
│  │                                                        ] │    │
│  │ Ordre :     [2]                        [↑] [↓] [🗑️]     │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌ Thème 3 ─────────────────────────────────────────────────┐    │
│  │ Nom * :     [Routing et Navigation SPA                 ] │    │
│  │ Durée * :   [3   ] heures                                │    │
│  │ Objectifs : [Implémenter React Router                    │    │
│  │                                                        ] │    │
│  │ Ordre :     [3]                        [↑] [↓] [🗑️]     │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌ Thème 4 ─────────────────────────────────────────────────┐    │
│  │ Nom * :     [Connexion API et Fetch                    ] │    │
│  │ Durée * :   [4   ] heures                                │    │
│  │ Objectifs : [Gérer les appels API REST                   │    │
│  │                                                        ] │    │
│  │ Ordre :     [4]                        [↑] [↓] [🗑️]     │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌ Thème 5 ─────────────────────────────────────────────────┐    │
│  │ Nom * :     [Projet pratique intégrateur               ] │    │
│  │ Durée * :   [6   ] heures                                │    │
│  │ Objectifs : [Réaliser un mini-projet complet             │    │
│  │                                                        ] │    │
│  │ Ordre :     [5]                        [↑] [↓] [🗑️]     │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  [+ Ajouter un nouveau thème]                                    │
│                                                                  │
│  Durée totale : 20 heures (5 thèmes)                             │
│                                                                  │
│  [← Précédent]                            [Suivant →]            │
└──────────────────────────────────────────────────────────────────┘
```

**Données enregistrées dans `plan_themes` :**
| Champ | Valeur |
|---|---|
| `plan_id` | ID du plan en cours |
| `nom` | Nom du thème saisi |
| `duree_heures` | Durée en heures |
| `objectifs` | Texte des objectifs |
| `ordre` | Position dans la liste (1, 2, 3...) |

**Validations :**
- Au moins 1 thème obligatoire
- Nom et durée obligatoires pour chaque thème
- Durée > 0

---

### ÉTAPE 3 — Affectation des Animateurs par Thème

**Objectif :** Pour chaque thème défini à l'étape 2, affecter **un ou plusieurs formateurs OFPPT** qui l'animeront. C'est ici que le rôle contextuel **"Animateur"** est attribué.

> **Point clé :** Un thème peut avoir **plusieurs animateurs**. Par exemple, un thème de 6h peut être co-animé par deux formateurs qui se partagent les sous-parties. La table `plan_theme_animateurs` supporte nativement cette multiplicité grâce à sa clé composite `(theme_id, animateur_id)`.

**Ce que voit l'utilisateur :**

```
┌──────────────────────────────────────────────────────────────────┐
│  ÉTAPE 3 / 6 — Affectation des animateurs                        │
│  ● ● ● ○ ○ ○                                                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Affectez un ou plusieurs formateurs animateurs par thème :      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ Thème 1 : Introduction à React et JSX (3h)                  ││
│  │                                                              ││
│  │ Animateurs * :  [🔍 Rechercher un formateur...          ]    ││
│  │                                                              ││
│  │ ✅ Mohammed Alami                                    [🗑️]    ││
│  │    CDC Casablanca · Développement Web                        ││
│  │                                                              ││
│  │ [+ Ajouter un animateur]                                     ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ Thème 2 : Gestion du State et Hooks (4h)                    ││
│  │                                                              ││
│  │ Animateurs * :  [🔍 Rechercher un formateur...          ]    ││
│  │                                                              ││
│  │ ✅ Mohammed Alami                                    [🗑️]    ││
│  │    CDC Casablanca · Développement Web                        ││
│  │ ✅ Sara Benchekroun                                  [🗑️]    ││
│  │    CDC Rabat · Développement Web                             ││
│  │    ℹ️ Co-animation : 2 animateurs sur ce thème               ││
│  │                                                              ││
│  │ [+ Ajouter un animateur]                                     ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ Thème 3 : Routing et Navigation SPA (3h)                    ││
│  │                                                              ││
│  │ ✅ Sara Benchekroun                                  [🗑️]    ││
│  │    CDC Rabat · Développement Web                             ││
│  │                                                              ││
│  │ [+ Ajouter un animateur]                                     ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ Thème 4 : Connexion API et Fetch (4h)                       ││
│  │                                                              ││
│  │ ✅ Sara Benchekroun                                  [🗑️]    ││
│  │ ✅ Youssef El Idrissi                                [🗑️]    ││
│  │    CDC Fès · Développement Full Stack                        ││
│  │    ℹ️ Co-animation : 2 animateurs sur ce thème               ││
│  │                                                              ││
│  │ [+ Ajouter un animateur]                                     ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ Thème 5 : Projet pratique intégrateur (6h)                  ││
│  │                                                              ││
│  │ ✅ Youssef El Idrissi                                [🗑️]    ││
│  │    CDC Fès · Développement Full Stack                        ││
│  │                                                              ││
│  │ [+ Ajouter un animateur]                                     ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│  Récapitulatif animateurs :                                      │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Mohammed Alami      → Thème 1, 2             (7h total)    │  │
│  │ Sara Benchekroun    → Thème 2, 3, 4          (11h total)   │  │
│  │ Youssef El Idrissi  → Thème 4, 5             (10h total)   │  │
│  │                                                            │  │
│  │ Total : 3 animateurs uniques · 7 affectations · 5 thèmes  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [← Précédent]                            [Suivant →]            │
└──────────────────────────────────────────────────────────────────┘
```

**Logique de la recherche d'animateur :**
```
Rechercher parmi tous les utilisateurs ayant le rôle système FORMATEUR
Filtres disponibles :
  - Par nom / prénom
  - Par région
  - Par établissement
  - Par domaine de compétence
  
Exclusion :
  - Les utilisateurs inactifs / suspendus
  
Règles :
  - Au moins 1 animateur par thème (obligatoire)
  - Plusieurs animateurs par thème (co-animation autorisée)
  - Un même formateur peut animer plusieurs thèmes
  - Pas de doublon : un formateur ne peut être ajouté 2 fois au même thème
```

**Données enregistrées dans `plan_theme_animateurs` :**
| theme_id | animateur_id | Commentaire |
|---|---|---|
| 1 (Intro React) | 42 (Mohammed Alami) | Seul animateur |
| 2 (State/Hooks) | 42 (Mohammed Alami) | Co-animation |
| 2 (State/Hooks) | 78 (Sara Benchekroun) | Co-animation |
| 3 (Routing) | 78 (Sara Benchekroun) | Seule animatrice |
| 4 (API/Fetch) | 78 (Sara Benchekroun) | Co-animation |
| 4 (API/Fetch) | 103 (Youssef El Idrissi) | Co-animation |
| 5 (Projet) | 103 (Youssef El Idrissi) | Seul animateur |

> **C'est cette table qui détermine le rôle contextuel "Animateur"** pour ce plan. Mohammed, Sara et Youssef sont des FORMATEURS dans le système, mais ils deviennent **Animateurs** spécifiquement pour cette formation. Un thème peut avoir plusieurs animateurs (co-animation).

---

### ÉTAPE 4 — Sélection des Participants

**Objectif :** Choisir les formateurs OFPPT qui suivront cette formation. C'est ici que le rôle contextuel **"Participant"** est attribué.

**Ce que voit l'utilisateur :**

```
┌──────────────────────────────────────────────────────────────────┐
│  ÉTAPE 4 / 6 — Sélection des participants                        │
│  ● ● ● ● ○ ○                                                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─ FILTRES ──────────────────────────────────────────────────┐  │
│  │ Région : [Toutes ▼]  Établissement : [Tous ▼]             │  │  
│  │ Domaine : [Développement Web ▼]  Recherche : [________]   │  │
│  │                                      [Appliquer filtres]  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Formateurs disponibles :                               Sélectionnés :  │
│  ┌──────────────────────────────────┐  ┌──────────────────────────────┐ │
│  │ ☑ Rachid Touzani                 │  │ ✅ Rachid Touzani             │ │
│  │   ISTA Meknès · Dév Web          │  │    ISTA Meknès               │ │
│  │                                  │  │                              │ │
│  │ ☑ Amina Dakir                    │  │ ✅ Amina Dakir                │ │
│  │   ISTA Casablanca · Dév Web      │  │    ISTA Casablanca           │ │
│  │                                  │  │                              │ │
│  │ ☐ Khalid Ouazzani                │  │ ✅ Hassan Lamrani             │ │
│  │   ISTA Oujda · Dév Web           │  │    ISTA Tanger               │ │
│  │                                  │  │                              │ │
│  │ ☑ Leila Fassi                    │  │ ✅ Leila Fassi                │ │
│  │   ISTA Rabat · Dév Web           │  │    ISTA Rabat                │ │
│  │                                  │  │                              │ │
│  │ ☐ Nadia Berrada                  │  │ ✅ Omar Cherkaoui             │ │
│  │   ISGI Marrakech · Réseaux       │  │    ISTA Agadir               │ │
│  │                                  │  │                              │ │
│  │ ...12 autres formateurs          │  │ ...+ 10 autres               │ │
│  └──────────────────────────────────┘  └──────────────────────────────┘ │
│                                                                  │
│  ⚠️ 3 animateurs exclus de la liste (déjà affectés comme        │
│     animateurs à l'étape 3)                                      │
│                                                                  │
│  📊 Total sélectionné : 15 participants                          │
│                                                                  │
│  [← Précédent]                            [Suivant →]            │
└──────────────────────────────────────────────────────────────────┘
```

**Logique de sélection :**
```
Critères de la liste des formateurs disponibles :
  ✅ Rôle système = FORMATEUR
  ✅ Statut = actif
  ✅ Filtrable par : région, établissement, domaine de compétence

Exclusions automatiques :
  ❌ Les formateurs déjà affectés comme ANIMATEURS sur ce plan (étape 3)
  ❌ Les utilisateurs avec statut inactif ou suspendu

Règle RG05 : Pas d'inscription libre — la sélection est faite 
             directement par l'auteur du plan (CDC ou RF)
Règle RG06 : Un participant ne peut être sélectionné qu'une seule fois par plan
```

**Données enregistrées dans `plan_participants` :**
| plan_id | participant_id | added_by | added_at |
|---|---|---|---|
| 7 | 55 (Rachid) | 12 (CDC Ahmed) | 2026-05-01 |
| 7 | 61 (Amina) | 12 (CDC Ahmed) | 2026-05-01 |
| 7 | 73 (Hassan) | 12 (CDC Ahmed) | 2026-05-01 |
| 7 | 89 (Leila) | 12 (CDC Ahmed) | 2026-05-01 |
| 7 | 94 (Omar) | 12 (CDC Ahmed) | 2026-05-01 |
| ... | ... | ... | ... |

> **C'est cette table qui détermine le rôle contextuel "Participant"** pour ce plan.

---

### ÉTAPE 5 — Logistique

**Objectif :** Configurer le site de formation, les hébergements (avec affectation individuelle) et les déplacements. La logistique est liée aux sessions, mais elle est pré-planifiée au niveau du plan.

> **Point clé :** L'hébergement supporte **plusieurs sites** avec une **affectation individuelle** par personne. Par exemple, l'animateur X peut être hébergé à l'Hôtel A tandis que le participant Y est à l'Hôtel B.

**Ce que voit l'utilisateur :**

```
┌──────────────────────────────────────────────────────────────────┐
│  ÉTAPE 5 / 6 — Logistique                                        │
│  ● ● ● ● ● ○                                                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SITE DE FORMATION                                               │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Site * : [Centre de formation OFPPT Casablanca Ain Sebaâ ▼]│  │
│  │ Adresse : 123 Bd Mohammed V, Casablanca                    │  │
│  │ Capacité : 30 places                                       │  │
│  │ Contact : Said Amrani · 0522-XXX-XXX                       │  │
│  │ Statut : ✅ Disponible                                     │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ═══════════════════════════════════════════════════════════════  │
│  HÉBERGEMENTS (plusieurs sites possibles)                        │
│  ═══════════════════════════════════════════════════════════════  │
│                                                                  │
│  ┌─ Site d'hébergement 1 ─────────────────────────────────────┐  │
│  │ Lieu * : [Hôtel Ibis Casablanca Centre                   ]│  │
│  │ Capacité : 15 places                                       │  │
│  │                                                            │  │
│  │ Personnes affectées à ce site (8 / 15 places) :            │  │
│  │ ┌──────────────────────────────────────────────────────┐   │  │
│  │ │ ✅ Mohammed Alami        (Animateur)          [🗑️]   │   │  │
│  │ │ ✅ Sara Benchekroun      (Animateur)          [🗑️]   │   │  │
│  │ │ ✅ Rachid Touzani        (Participant)        [🗑️]   │   │  │
│  │ │ ✅ Amina Dakir           (Participant)        [🗑️]   │   │  │
│  │ │ ✅ Hassan Lamrani        (Participant)        [🗑️]   │   │  │
│  │ │ ✅ Leila Fassi           (Participant)        [🗑️]   │   │  │
│  │ │ ✅ Omar Cherkaoui        (Participant)        [🗑️]   │   │  │
│  │ │ ✅ Nadia Berrada         (Participant)        [🗑️]   │   │  │
│  │ └──────────────────────────────────────────────────────┘   │  │
│  │ [+ Affecter une personne]                                  │  │
│  │ Statut : ✅ Disponible (8/15 places)                       │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─ Site d'hébergement 2 ─────────────────────────────────────┐  │
│  │ Lieu * : [Résidence Al Firdaous                          ]│  │
│  │ Capacité : 10 places                                       │  │
│  │                                                            │  │
│  │ Personnes affectées à ce site (4 / 10 places) :            │  │
│  │ ┌──────────────────────────────────────────────────────┐   │  │
│  │ │ ✅ Youssef El Idrissi    (Animateur)          [🗑️]   │   │  │
│  │ │ ✅ Khalid Ouazzani       (Participant)        [🗑️]   │   │  │
│  │ │ ✅ Zineb Mouhib          (Participant)        [🗑️]   │   │  │
│  │ │ ✅ Yassine Tahiri        (Participant)        [🗑️]   │   │  │
│  │ └──────────────────────────────────────────────────────┘   │  │
│  │ [+ Affecter une personne]                                  │  │
│  │ Statut : ✅ Disponible (4/10 places)                       │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [+ Ajouter un site d'hébergement]                               │
│                                                                  │
│  Récapitulatif hébergement :                                     │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ 2 sites · 12 personnes hébergées / 18 total                │  │
│  │ 6 personnes locales (pas d'hébergement nécessaire)         │  │
│  │ ⚠️ 0 personnes non affectées (toutes hébergées ou locales)│  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ═══════════════════════════════════════════════════════════════  │
│  DÉPLACEMENTS                                                    │
│  ═══════════════════════════════════════════════════════════════  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Origine       │ Destination  │ Mode      │ Horaire         │  │
│  │───────────────┼──────────────┼───────────┼─────────────────│  │
│  │ Rabat         │ Casablanca   │ Train     │ 07:00           │  │
│  │ Fès           │ Casablanca   │ Train     │ 06:00           │  │
│  │ Meknès        │ Casablanca   │ Bus OFPPT │ 05:30           │  │
│  │ Tanger        │ Casablanca   │ Train     │ 05:00           │  │
│  │ Agadir        │ Casablanca   │ Avion     │ 08:00           │  │
│  │                                                            │  │
│  │ [+ Ajouter un trajet]                                      │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [← Précédent]                            [Suivant →]            │
└──────────────────────────────────────────────────────────────────┘
```

**Logique multi-site d'hébergement :**
```
Règles :
  - Plusieurs sites d'hébergement possibles par plan/session
  - Chaque animateur et participant est affecté individuellement à un site
  - Une personne ne peut être affectée qu'à UN seul site d'hébergement
  - Les personnes locales ne nécessitent pas d'hébergement (optionnel)
  - Pas de doublon : une personne ne peut apparaître sur 2 sites

Alertes automatiques (RG13) :
  ⛔ Capacité d'un site dépassée → alerte bloquante
  ⛔ Site de formation indisponible → alerte bloquante
  ⚠️ Personne non locale sans hébergement affecté → avertissement
```

**Impact sur le modèle de données :**

Une nouvelle table de jointure est nécessaire pour l'affectation individuelle :

| Table | Champs | Description |
|---|---|---|
| `hebergement_affectations` | `hebergement_id` (FK), `utilisateur_id` (FK) | Lie une personne (animateur ou participant) à un site d'hébergement spécifique |

**Exemple de données :**

| hebergement_id | utilisateur_id | Personne | Site |
|---|---|---|---|
| 1 (Ibis) | 42 | Mohammed Alami (Animateur) | Hôtel Ibis |
| 1 (Ibis) | 78 | Sara Benchekroun (Animateur) | Hôtel Ibis |
| 1 (Ibis) | 55 | Rachid Touzani (Participant) | Hôtel Ibis |
| 2 (Al Firdaous) | 103 | Youssef El Idrissi (Animateur) | Résidence Al Firdaous |
| 2 (Al Firdaous) | 67 | Khalid Ouazzani (Participant) | Résidence Al Firdaous |

---

### ÉTAPE 6 — Récapitulatif et Soumission / Confirmation

**Objectif :** Relecture complète du plan avant l'action finale.

**Ce que voit l'utilisateur :**

```
┌──────────────────────────────────────────────────────────────────┐
│  ÉTAPE 6 / 6 — Récapitulatif                                     │
│  ● ● ● ● ● ●                                                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─ ENTITÉ DE RÉFÉRENCE ────────────────────────────────────┐   │
│  │ Formation React.js Avancé pour Formateurs TDI             │   │
│  │ Domaine : Développement Web                               │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─ PLAN ───────────────────────────────────────────────────┐   │
│  │ Titre : Formation React.js Avancé — Mai 2026              │   │
│  │ Créé par : Ahmed El Fassi (CDC Casablanca)                │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─ THÈMES (5) ─────────────────────────────────────────────┐   │
│  │ #  Thème                          Durée   Animateurs      │   │
│  │ 1  Introduction à React et JSX    3h      M. Alami        │   │
│  │ 2  Gestion du State et Hooks      4h      M. Alami,       │   │
│  │                                           S. Benchekroun  │   │
│  │ 3  Routing et Navigation SPA      3h      S. Benchekroun  │   │
│  │ 4  Connexion API et Fetch         4h      S. Benchekroun, │   │
│  │                                           Y. El Idrissi   │   │
│  │ 5  Projet pratique intégrateur    6h      Y. El Idrissi   │   │
│  │                                                           │   │
│  │ Total : 20 heures · 3 animateurs · 7 affectations         │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─ PARTICIPANTS (15) ──────────────────────────────────────┐   │
│  │ Rachid Touzani (ISTA Meknès) · Amina Dakir (ISTA Casa)   │   │
│  │ Hassan Lamrani (ISTA Tanger) · Leila Fassi (ISTA Rabat)   │   │
│  │ Omar Cherkaoui (ISTA Agadir) · ...+ 10 autres             │   │
│  │                                                           │   │
│  │ Régions représentées : 5 (Casablanca, Rabat, Fès,        │   │
│  │                          Tanger, Agadir)                   │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─ LOGISTIQUE ─────────────────────────────────────────────┐   │
│  │ Site : Centre OFPPT Ain Sebaâ, Casablanca (30 places)     │   │
│  │ Hébergement :                                             │   │
│  │   • Hôtel Ibis (8/15 places) → 2 animateurs + 6 FP ✅    │   │
│  │   • Résidence Al Firdaous (4/10) → 1 animateur + 3 FP ✅  │   │
│  │ Déplacements : 5 trajets planifiés                        │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─ VALIDATION ─────────────────────────────────────────────┐   │
│  │ ✅ Tous les thèmes ont un animateur affecté               │   │
│  │ ✅ Au moins 1 participant sélectionné                     │   │
│  │ ✅ Site de formation défini                               │   │
│  │ ✅ Capacité hébergement suffisante                        │   │
│  │ ✅ Aucun conflit logistique détecté                       │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Si auteur = CDC :                                         │  │
│  │  [← Précédent] [Enregistrer brouillon] [📤 Soumettre au RF]│  │
│  │                                                            │  │
│  │  Si auteur = RF :                                          │  │
│  │  [← Précédent] [Enregistrer brouillon] [✅ Confirmer]     │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

**L'action finale dépend de l'auteur :**

| Auteur | Bouton | Action | Statut résultant | Notification |
|---|---|---|---|---|
| **CDC** | 📤 Soumettre au RF | Envoie le plan pour validation | `soumis` | RF reçoit email + in-app |
| **RF** | ✅ Confirmer | Confirme directement le plan | `confirmé` | Animateurs + Participants notifiés |
| *Les deux* | Enregistrer brouillon | Sauvegarde sans action | `brouillon` | Aucune |

---

## PHASE 3 — WORKFLOW DE VALIDATION (CDC uniquement)

Ce workflow ne concerne que les plans **créés par le CDC**. Les plans créés par le RF sont confirmés directement (voir Étape 6).

```
┌──────────┐     ┌──────────┐     ┌──────────────────────────┐
│CDC soumet│────▶│ RF reçoit │────▶│ RF examine le plan       │
│le plan   │     │ notif    │     │                          │
└──────────┘     └──────────┘     └─────────┬────────────────┘
                                            │
                              ┌─────────────┴─────────────┐
                              │                           │
                        ┌─────▼─────┐              ┌──────▼──────┐
                        │ VALIDE ✅ │              │ REJETTE ❌  │
                        └─────┬─────┘              └──────┬──────┘
                              │                           │
                              │                    Motif obligatoire
                              │                    (champ texte non vide)
                              │                           │
                   ┌──────────▼──────────┐   ┌───────────▼───────────┐
                   │ Statut : confirmé   │   │ Statut : rejeté       │
                   │ Sessions planifiables│   │ CDC notifié avec motif│
                   │ Animateurs + FP     │   │                       │
                   │ notifiés             │   │ CDC modifie le plan   │
                   └─────────────────────┘   │ et re-soumet          │
                                             │      │                │
                                             └──────┼────────────────┘
                                                    │
                                                    ▼
                                            Retour à "RF examine"
```

### Ce que voit le RF lors de la validation

```
┌──────────────────────────────────────────────────────────────────┐
│  VALIDATION DU PLAN — Soumis par Ahmed El Fassi (CDC Casablanca) │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Récapitulatif complet du plan : même vue que l'Étape 6]        │
│                                                                  │
│  ─────────────────────────────────────────────────────────────── │
│                                                                  │
│  DÉCISION :                                                      │
│                                                                  │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐ │
│  │                          │  │                              │ │
│  │  [✅ Valider ce plan]     │  │  [❌ Rejeter ce plan]       │ │
│  │                          │  │                              │ │
│  └──────────────────────────┘  │  Motif de rejet * :          │ │
│                                │  ┌──────────────────────────┐│ │
│                                │  │ Le thème 3 ne correspond ││ │
│                                │  │ pas aux besoins actuels. ││ │
│                                │  │ Veuillez remplacer par   ││ │
│                                │  │ un thème sur TypeScript. ││ │
│                                │  └──────────────────────────┘│ │
│                                │  [Confirmer le rejet]         │ │
│                                └──────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

**Journal d'audit enregistré à chaque transition :**

| utilisateur_id | action | entite_type | ancien_statut | nouveau_statut | metadata |
|---|---|---|---|---|---|
| 12 (CDC Ahmed) | Soumission plan | plans_formation | brouillon | soumis | `{plan_id: 7}` |
| 5 (RF Fatima) | Rejet plan | plans_formation | soumis | rejeté | `{motif: "Thème 3 inadapté..."}` |
| 12 (CDC Ahmed) | Re-soumission plan | plans_formation | rejeté | soumis | `{plan_id: 7, tentative: 2}` |
| 5 (RF Fatima) | Validation plan | plans_formation | soumis | confirmé | `{plan_id: 7}` |

---

## PHASE 4 — PLANIFICATION DES SESSIONS

Après confirmation du plan, le **RF** planifie les sessions concrètes.

### Relation Plan → Sessions

```
PLAN CONFIRMÉ (Formation React.js — Mai 2026)
     │
     ├──▶ SESSION 1 : 12-14 Mai 2026 (Groupe A : 8 participants)
     │     Site : Centre OFPPT Ain Sebaâ
     │     Animateurs : Mohammed Alami, Sara Benchekroun
     │
     ├──▶ SESSION 2 : 19-21 Mai 2026 (Groupe B : 7 participants)
     │     Site : Centre OFPPT Ain Sebaâ
     │     Animateurs : Mohammed Alami, Youssef El Idrissi
     │
     └──▶ SESSION 3 (optionnel) : Session de rattrapage si besoin
```

> **Un plan peut avoir 1 ou plusieurs sessions.** Cela permet de diviser les 15 participants en groupes plus petits si la capacité du site est limitée, ou de planifier des sessions à des dates différentes.

### Données d'une session

| Champ | Exemple Session 1 | Exemple Session 2 |
|---|---|---|
| Plan associé | Plan #7 | Plan #7 |
| Date début | 12 Mai 2026, 09:00 | 19 Mai 2026, 09:00 |
| Date fin | 14 Mai 2026, 17:00 | 21 Mai 2026, 17:00 |
| Site | Centre OFPPT Ain Sebaâ | Centre OFPPT Ain Sebaâ |
| Capacité | 10 | 10 |
| Animateurs | M. Alami, S. Benchekroun | M. Alami, Y. El Idrissi |
| Participants | 8 sélectionnés du plan | 7 sélectionnés du plan |
| Statut | Planifiée | Planifiée |

### Cycle de vie d'une session

```
┌───────────┐     ┌──────────┐     ┌───────────┐     ┌──────────┐
│ PLANIFIÉE │────▶│ EN COURS │────▶│ TERMINÉE  │     │ ANNULÉE  │
└───────────┘     └──────────┘     └───────────┘     └──────────┘
                       │                 │
                       │            Présences verrouillées
                       │            QCM visible
                       │            Feedback ouvert
                       │
                  Animateur saisit
                  les présences
```

---

## PHASE 5 — EXÉCUTION ET ÉVALUATION

### Pendant la session

| Action | Qui | Quand |
|---|---|---|
| Saisir les présences | Animateur (FA contextuel) | Chaque jour/demi-journée |
| Créer le QCM | Animateur | Avant ou pendant la session |
| Uploader des supports | Animateur | Pendant la session |

### Fin de session

| Action | Qui | Détail |
|---|---|---|
| Clôturer la session | RF ou ADMIN | Statut → `terminée` |
| Présences verrouillées | Automatique | `verrouille` = true (dérogation ADMIN) |
| QCM diffusé | Automatique | `visible_participants` = true |
| Notification QCM | Automatique | Email + in-app : "Un QCM est disponible" |
| Participants passent le QCM | FP contextuels | Score calculé automatiquement |
| Feedback ouvert | Système | Si formulaire créé par RF/CDC |
| Participants répondent au feedback | FP contextuels | Totalement facultatif |

---

## RÉSUMÉ VISUEL COMPLET

```
═══════════════════════════════════════════════════════════════════
                    CYCLE DE VIE COMPLET — SGAFO
═══════════════════════════════════════════════════════════════════

  [1] ENTITÉ DE FORMATION (concept réutilisable)
       │ Titre, domaine, objectifs, thèmes indicatifs
       │
       │  1 entité → N plans possibles
       │
  [2] PLAN DE FORMATION (stepper 6 étapes)
       │ É1: Choix entité
       │ É2: Personnaliser thèmes
       │ É3: Affecter ANIMATEURS (→ rôle contextuel FA)
       │ É4: Sélectionner PARTICIPANTS (→ rôle contextuel FP)
       │ É5: Logistique
       │ É6: Récapitulatif + Soumettre/Confirmer
       │
  [3] VALIDATION (si plan CDC)
       │ CDC soumet → RF valide/rejette
       │ RF confirme directement ses propres plans
       │
  [4] SESSIONS (1 plan → N sessions)
       │ RF planifie dates, sites, rattache animateurs et participants
       │ RF uploade PDFs de convocation
       │
  [5] EXÉCUTION
       │ Animateur saisit présences
       │ Animateur crée + diffuse QCM
       │ Animateur uploade supports pédagogiques
       │
  [6] ÉVALUATION
       │ Participants passent le QCM → score automatique
       │ Participants répondent au feedback (facultatif)
       │
  [7] REPORTING
       │ Tableaux de bord par rôle
       │ KPI : absences, QCM, feedback
       │ Exports PDF + Excel/CSV
       │
  [8] CLÔTURE
         Session terminée, présences verrouillées, archivage

═══════════════════════════════════════════════════════════════════
```
