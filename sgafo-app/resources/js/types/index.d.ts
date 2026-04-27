export interface AppNotification {
    id: string;
    type: string;
    data: {
        message: string;
        type: 'soumission' | 'success' | 'danger' | 'info' | 'feedback_received' | 'feedback_required' | 'plan_validated' | 'qcm_required';
        action_url: string;
        title?: string;
        color?: string;
        plan_id?: number;
        plan_titre?: string;
        plan_title?: string;
        participant_name?: string;
        seance_id?: number;
        qcm_id?: number;
        entite_nom?: string;
        createur_nom?: string;
        commentaire?: string;
    };
    read_at: string | null;
    created_at: string;
}

export interface User {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    is_externe: boolean;
    roles: any[];
    primary_role?: string;
    email_verified_at?: string;
    notifications: AppNotification[];
    regions?: any[];
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash: {
        success?: string;
        error?: string;
    };
};
