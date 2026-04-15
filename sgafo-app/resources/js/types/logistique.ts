import { Region } from './entite';

export interface Hotel {
    id: number;
    nom: string;
    ville: string;
    adresse: string | null;
    telephone: string | null;
    region_id: number;
    prix_nuitee: number;
    statut: 'actif' | 'archivé';
    region?: Region;
    created_at: string;
    updated_at: string;
}

export interface SiteFormation {
    id: number;
    nom: string;
    adresse: string | null;
    ville: string | null;
    capacite: number;
    region_id: number;
    statut: 'actif' | 'archivé';
    region?: Region;
    created_at: string;
    updated_at: string;
}

export interface Institut {
    id: number;
    nom: string;
    code: string | null;
    adresse: string | null;
    ville: string | null;
    region_id: number;
    region?: Region;
}
