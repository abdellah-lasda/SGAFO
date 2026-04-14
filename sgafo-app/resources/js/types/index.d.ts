export interface User {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    is_externe: boolean;
    roles: string[];
    primary_role?: string;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
