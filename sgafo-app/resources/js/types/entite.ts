export interface Theme {
    id?: number;
    titre: string;
    duree_heures: string | number;
    objectifs: string;
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
    createur?: { id: number; prenom: string; nom: string };
    cree_par_id?: number;
    updated_at: string;
    created_at: string;
}
