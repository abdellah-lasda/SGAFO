<?php

namespace App\Http\Requests\Modules\Animateur;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreQcmStructureRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'questions' => 'required|array|min:1',
            'questions.*.texte' => 'required|string|max:500',
            'questions.*.type' => 'required|in:unique,multiple',
            'questions.*.points' => 'required|integer|min:1',
            'questions.*.ordre' => 'required|integer|min:1',
            'questions.*.options' => 'required|array|min:2',
            'questions.*.options.*.texte' => 'required|string|max:255',
            'questions.*.options.*.est_correcte' => 'required|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'questions.required' => 'Le QCM doit contenir au moins une question.',
            'questions.min' => 'Le QCM doit contenir au moins une question.',
            'questions.*.options.min' => 'Chaque question doit avoir au moins 2 options.',
            'questions.*.points.min' => 'Chaque question doit valoir au moins 1 point.',
        ];
    }
}
