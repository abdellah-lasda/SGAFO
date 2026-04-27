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
        $plan = $this->route('plan');

        $rules = [
            'date' => [
                'required',
                'date',
            ],
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
            'recurrence.date_fin' => [
                'required_if:recurrence.active,true',
                'date',
                'after_or_equal:date',
            ],
            'recurrence.skip_saturday' => 'boolean',
            'recurrence.skip_sunday' => 'boolean',
        ];

        // Règle 4 : Contrôle strict des dates
        if ($plan) {
            $rules['date'][] = 'after_or_equal:' . $plan->date_debut->toDateString();
            $rules['date'][] = 'before_or_equal:' . $plan->date_fin->toDateString();
            
            if ($this->input('recurrence.active')) {
                $rules['recurrence.date_fin'][] = 'before_or_equal:' . $plan->date_fin->toDateString();
            }
        }

        return $rules;
    }

    public function messages(): array
    {
        $plan = $this->route('plan');
        $debut = $plan?->date_debut ? $plan->date_debut->format('d/m/Y') : '';
        $fin = $plan?->date_fin ? $plan->date_fin->format('d/m/Y') : '';

        return [
            'fin.after' => 'L\'heure de fin doit être postérieure à l\'heure de début.',
            'date.after_or_equal' => "La date de la séance ne peut pas être avant la date de début du plan ($debut).",
            'date.before_or_equal' => "La date de la séance ne peut pas dépasser la date de fin du plan ($fin).",
            'recurrence.date_fin.before_or_equal' => "La date de fin de récurrence ne peut pas dépasser la date de fin du plan ($fin).",
        ];
    }

    public function after(): array
    {
        return [
            function (\Illuminate\Validation\Validator $validator) {
                if ($validator->errors()->isNotEmpty()) {
                    return; // S'il y a déjà des erreurs de format, on arrête.
                }

                $plan = $this->route('plan');
                if (!$plan) return;

                $validated = $validator->validated();
                
                // 1. Générer toutes les dates (incluant la récurrence)
                $dates = [$validated['date']];
                if ($validated['recurrence']['active'] ?? false) {
                    $currentDate = new \DateTime($validated['date']);
                    $endDate = new \DateTime($validated['recurrence']['date_fin']);
                    $type = $validated['recurrence']['type'];
                    $skipSaturday = $validated['recurrence']['skip_saturday'] ?? false;
                    $skipSunday = $validated['recurrence']['skip_sunday'] ?? false;

                    while (true) {
                        if ($type === 'quotidien') {
                            $currentDate->modify('+1 day');
                        } else {
                            $currentDate->modify('+1 week');
                        }

                        if ($currentDate > $endDate) break;

                        $dayOfWeek = (int)$currentDate->format('N');
                        
                        if ($dayOfWeek === 6 && $skipSaturday) {
                            $currentDate->modify('+1 day');
                            $dayOfWeek = 7;
                        }
                        if ($dayOfWeek === 7 && $skipSunday) {
                            $currentDate->modify('+1 day');
                        }

                        if ($currentDate > $endDate) break;
                        
                        $dates[] = $currentDate->format('Y-m-d');
                    }
                }

                $debut = $validated['debut'];
                $fin = $validated['fin'];
                $formateurIds = collect($validated['themes'])->pluck('formateur_id')->filter()->unique()->toArray();
                
                // Récupérer les IDs des participants du plan
                $participantIds = $plan->participants()->pluck('users.id')->toArray();

                foreach ($dates as $date) {
                    $dateFormatted = date('d/m/Y', strtotime($date));

                    // Règle 3 : Interdiction des Séances Simultanées (Même Plan)
                    $planOverlap = \App\Models\Seance::where('plan_id', $plan->id)
                        ->where('date', $date)
                        ->where('debut', '<', $fin)
                        ->where('fin', '>', $debut)
                        ->exists();

                    if ($planOverlap) {
                        $validator->errors()->add('debut', "Il y a déjà une séance prévue pour ce plan le $dateFormatted sur cette plage horaire.");
                        return; // Stop early
                    }

                    // Règle 1 : Disponibilité des Formateurs
                    if (!empty($formateurIds)) {
                        $busyFormateurId = \App\Models\SeanceTheme::whereIn('formateur_id', $formateurIds)
                            ->whereHas('seance', function($sq) use ($date, $debut, $fin) {
                                $sq->where('date', $date)
                                   ->where('debut', '<', $fin)
                                   ->where('fin', '>', $debut);
                            })->value('formateur_id');

                        if ($busyFormateurId) {
                            $busyFormateur = \App\Models\User::find($busyFormateurId);
                            $validator->errors()->add('debut', "Le formateur {$busyFormateur->nom} {$busyFormateur->prenom} n'est pas disponible le $dateFormatted (il anime déjà une séance sur ce créneau).");
                            return;
                        }
                    }

                    // Règle 2 : Disponibilité des Participants
                    if (!empty($participantIds)) {
                        $busyParticipantId = \App\Models\User::whereIn('id', $participantIds)
                            ->whereHas('plans', function($q) use ($date, $debut, $fin, $plan) {
                                $q->where('plans_formation.id', '!=', $plan->id)
                                  ->whereHas('seances', function($sq) use ($date, $debut, $fin) {
                                      $sq->where('date', $date)
                                         ->where('debut', '<', $fin)
                                         ->where('fin', '>', $debut);
                                  });
                            })->value('id');

                        if ($busyParticipantId) {
                            $busyParticipant = \App\Models\User::find($busyParticipantId);
                            $validator->errors()->add('debut', "Le participant {$busyParticipant->nom} {$busyParticipant->prenom} n'est pas disponible le $dateFormatted (il a déjà une séance prévue dans une autre formation sur ce créneau).");
                            return;
                        }
                    }
                }
            }
        ];
    }
}
