import { Entite, Theme } from './entite';
import { SiteFormation } from './logistique';

export interface PlanTheme {
    id?: number;
    plan_id?: number;
    nom: string;
    duree_heures: number | string;
    objectifs: string;
    ordre: number;
    animateurs?: PlanFormateur[];
    animateur_ids?: number[];
}

export interface PlanFormateur {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    is_externe: boolean;
    statut?: string;
    instituts?: { id: number; nom: string; region?: { id: number; nom: string } }[];
    regions?: { id: number; nom: string }[];
    secteurs?: { id: number; nom: string }[];
}

export interface PlanParticipant extends PlanFormateur {
    pivot?: {
        added_by: number;
        added_at: string;
    };
}

export type PlanStatut = 'brouillon' | 'soumis' | 'validé' | 'rejeté' | 'confirmé' | 'en_cours' | 'clôturé' | 'archivé';

export interface PlanHebergement {
    id?: number;
    plan_id?: number;
    user_id: number;
    hotel_id: number;
    nombre_nuits: number;
    cout_total: number;
    hotel?: {
        id: number;
        nom: string;
        ville: string;
        prix_nuitee: number;
    };
    user?: {
        id: number;
        nom: string;
        prenom: string;
    };
}

export interface PlanValidationLog {
    id: number;
    plan_id: number;
    user_id: number | null;
    action: string;
    commentaire: string | null;
    created_at: string;
    user?: { id: number; prenom: string; nom: string };
}

export interface PlanFormation {
    id: number;
    entite_id: number;
    titre: string;
    statut: PlanStatut;
    motif_rejet: string | null;
    cree_par: number;
    valide_par: number | null;
    date_soumission: string | null;
    date_validation: string | null;
    date_debut: string | null;
    date_fin: string | null;
    site_formation_id: number | null;
    created_at: string;
    updated_at: string;
    lien_visio : string | null;
    plateforme : string | null; 
    entite?: Entite;
    createur?: { id: number; prenom: string; nom: string };
    validateur?: { id: number; prenom: string; nom: string };
    themes: PlanTheme[];
    participants?: PlanParticipant[];
    animateurs?: PlanFormateur[];
    hebergements?: PlanHebergement[];
    site_formation?: SiteFormation;
    validation_logs?: PlanValidationLog[];
}

export const STATUT_CONFIG: Record<PlanStatut, { label: string; color: string; bg: string }> = {
    'brouillon': { label: 'Brouillon', color: 'text-slate-600', bg: 'bg-slate-100' },
    'soumis': { label: 'Soumis', color: 'text-amber-700', bg: 'bg-amber-50' },
    'validé': { label: 'Validé', color: 'text-blue-700', bg: 'bg-blue-50' },
    'rejeté': { label: 'Rejeté', color: 'text-red-700', bg: 'bg-red-50' },
    'confirmé': { label: 'Confirmé', color: 'text-emerald-700', bg: 'bg-emerald-50' },
    'en_cours': { label: 'En Planification', color: 'text-blue-600', bg: 'bg-blue-50' },
    'clôturé': { label: 'Clôturé', color: 'text-amber-600', bg: 'bg-amber-50' },
    'archivé': { label: 'Archivé', color: 'text-slate-500', bg: 'bg-slate-50' },
};
