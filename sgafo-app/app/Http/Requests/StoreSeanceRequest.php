<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSeanceRequest extends FormRequest
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
            'date' => 'required|date|after_or_equal:today',
            'debut' => 'required|date_format:H:i',
            'fin' => 'required|date_format:H:i|after:debut',
            'site_id' => 'nullable|exists:sites_formation,id',
            'themes' => 'required|array|min:1',
            'themes.*.plan_theme_id' => 'required|exists:plan_themes,id',
            'themes.*.heures_planifiees' => 'required|numeric|min:0.5',
            'themes.*.formateur_id' => 'required|exists:users,id',
            
            // Récurrence
            'recurrence' => 'nullable|array',
            'recurrence.active' => 'boolean',
            'recurrence.type' => 'required_if:recurrence.active,true|in:quotidien,hebdomadaire',
            'recurrence.date_fin' => 'required_if:recurrence.active,true|date|after_or_equal:date',
            'recurrence.skip_saturday' => 'boolean',
            'recurrence.skip_sunday' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'fin.after' => 'L\'heure de fin doit être postérieure à l\'heure de début.',
            'date.after_or_equal' => 'La date de la séance ne peut pas être dans le passé.',
        ];
    }
}
