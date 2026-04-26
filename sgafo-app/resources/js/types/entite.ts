export interface Region {
    id: number;
    nom: string;
    code: string;
}

export interface Theme {
    id?: number;
    titre: string;
    duree_heures: string | number;
    objectifs: string;
}

export interface Metier {
    id: number;
    nom: string;
}

export interface Entite {
    id: number;
    titre: string;
    type: string;
    mode: string;
    description: string;
    objectifs: string;
    statut: string;
    secteur_id: number;
    secteur?: { id: number; nom: string };
    themes: Theme[];
    metiers?: Metier[];
    createur?: { id: number; prenom: string; nom: string };
    cree_par_id?: number;
    updated_at: string;
    created_at: string;
}
