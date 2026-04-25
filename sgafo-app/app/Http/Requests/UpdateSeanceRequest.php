<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSeanceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date' => 'required|date',
            'debut' => 'required',
            'fin' => 'required',
            'site_id' => 'nullable|exists:sites_formation,id',
            'statut' => 'required|in:planifiée,confirmée,en_cours,terminée,annulée',
            'themes' => 'required|array|min:1',
            'themes.*.id' => 'nullable|exists:seance_themes,id', // id existant lors de la modif
            'themes.*.plan_theme_id' => 'required|exists:plan_themes,id',
            'themes.*.heures_planifiees' => 'required|numeric|min:0.5',
            'themes.*.formateur_id' => 'required|exists:users,id',
        ];
    }

    public function messages(): array
    {
        return [
            'fin.after' => 'L\'heure de fin doit être postérieure à l\'heure de début.',
        ];
    }
}
