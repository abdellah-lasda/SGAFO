/**
 * Utilitaires de validation côté client — SGAFO
 * Ces fonctions retournent `null` si valide, ou un message d'erreur en string.
 */

// --- Types de fichiers autorisés ---
const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'application/zip',
    'image/jpeg',
    'image/png',
];
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * Valide un fichier uploadé (type et taille).
 */
export const validateFile = (file: File | null): string | null => {
    if (!file) return 'Veuillez sélectionner un fichier.';
    if (file.size > MAX_FILE_SIZE_BYTES) {
        return `Le fichier ne doit pas dépasser ${MAX_FILE_SIZE_MB} Mo (taille actuelle : ${(file.size / 1024 / 1024).toFixed(1)} Mo).`;
    }
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return 'Type de fichier non autorisé. Utilisez : PDF, Word, Excel, PowerPoint, Zip, JPG ou PNG.';
    }
    return null;
};

/**
 * Valide une URL externe.
 */
export const validateUrl = (url: string): string | null => {
    if (!url || url.trim() === '') return 'Le lien est requis.';
    try {
        new URL(url);
        return null;
    } catch {
        return 'Le lien fourni n\'est pas une URL valide (ex: https://exemple.com).';
    }
};

/**
 * Valide un champ texte simple (requis + longueur max).
 */
export const validateRequiredString = (value: string, fieldName: string, maxLength = 255): string | null => {
    if (!value || value.trim() === '') return `Le champ "${fieldName}" est requis.`;
    if (value.trim().length < 2) return `Le champ "${fieldName}" doit contenir au moins 2 caractères.`;
    if (value.trim().length > maxLength) return `Le champ "${fieldName}" ne doit pas dépasser ${maxLength} caractères.`;
    return null;
};

/**
 * Valide un format d'adresse email.
 */
export const validateEmail = (email: string): string | null => {
    if (!email || email.trim() === '') return 'L\'adresse email est requise.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'L\'adresse email n\'est pas valide.';
    return null;
};

/**
 * Valide la force d'un mot de passe.
 * Retourne { error, strength } — strength: 'weak' | 'medium' | 'strong'
 */
export const validatePassword = (password: string, required = true): { error: string | null; strength: 'weak' | 'medium' | 'strong' | null } => {
    if (!password) {
        return { error: required ? 'Le mot de passe est requis.' : null, strength: null };
    }
    if (password.length < 8) {
        return { error: 'Le mot de passe doit contenir au moins 8 caractères.', strength: 'weak' };
    }
    const hasNumber = /\d/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);

    const score = [hasNumber, hasUpper, hasSpecial].filter(Boolean).length;
    if (score === 0) return { error: null, strength: 'weak' };
    if (score <= 1) return { error: null, strength: 'medium' };
    return { error: null, strength: 'strong' };
};

/**
 * Valide la cohérence temporelle heure début / fin.
 */
export const validateTimeRange = (debut: string, fin: string): string | null => {
    if (!debut || !fin) return null; // handled individually
    if (fin <= debut) return 'L\'heure de fin doit être postérieure à l\'heure de début.';
    return null;
};

/**
 * Valide qu'une date n'est pas dans le passé.
 */
export const validateFutureDate = (date: string): string | null => {
    if (!date) return 'La date est requise.';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(date) < today) return 'La date ne peut pas être dans le passé.';
    return null;
};

/**
 * Valide la structure complète d'un QCM (questions + options).
 * Retourne un tableau de messages d'erreur (vide si tout est valide).
 */
export const validateQcmStructure = (questions: any[]): { qIndex: number; message: string }[] => {
    const errors: { qIndex: number; message: string }[] = [];

    if (!questions || questions.length === 0) {
        errors.push({ qIndex: -1, message: 'Le QCM doit contenir au moins une question.' });
        return errors;
    }

    questions.forEach((q, qIndex) => {
        if (!q.texte || q.texte.trim() === '') {
            errors.push({ qIndex, message: `Question ${qIndex + 1} : le texte de la question est vide.` });
        }
        if (!q.points || q.points < 1) {
            errors.push({ qIndex, message: `Question ${qIndex + 1} : les points doivent être ≥ 1.` });
        }
        if (!q.options || q.options.length < 2) {
            errors.push({ qIndex, message: `Question ${qIndex + 1} : il faut au moins 2 options.` });
        } else {
            const hasCorrectAnswer = q.options.some((o: any) => o.est_correcte);
            if (!hasCorrectAnswer) {
                errors.push({ qIndex, message: `Question ${qIndex + 1} : aucune réponse correcte n'est définie.` });
            }
            q.options.forEach((opt: any, oIndex: number) => {
                if (!opt.texte || opt.texte.trim() === '') {
                    errors.push({ qIndex, message: `Question ${qIndex + 1}, option ${oIndex + 1} : le texte est vide.` });
                }
            });
        }
    });

    return errors;
};
