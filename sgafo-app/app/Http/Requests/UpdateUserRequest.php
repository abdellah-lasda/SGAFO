<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Récupère l'ID de l'utilisateur depuis la route
        $userId = $this->route('user')?->id;

        return [
            'nom'        => 'required|string|max:100',
            'prenom'     => 'required|string|max:100',
            // Ignore l'email de l'utilisateur en cours de modification (évite fausse erreur d'unicité)
            'email'      => 'required|string|email|max:150|unique:users,email,' . $userId,
            'password'   => 'nullable|string|min:8',
            'statut'     => 'required|in:actif,inactif,suspendu',
            'is_externe' => 'boolean',
            'roles'      => 'required|array|min:1',
            'roles.*'    => 'exists:roles,id',
            'regions'    => 'nullable|array',
            'regions.*'  => 'exists:regions,id',
            'cdcs'       => 'nullable|array',
            'cdcs.*'     => 'exists:cdcs,id',
            'secteurs'   => 'nullable|array',
            'secteurs.*' => 'exists:secteurs,id',
            'instituts'  => 'nullable|array',
            'instituts.*'=> 'exists:instituts,id',
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique'   => 'Cette adresse email est déjà utilisée par un autre utilisateur.',
            'password.min'   => 'Le mot de passe doit contenir au moins 8 caractères.',
            'roles.required' => 'L\'utilisateur doit avoir au moins un rôle.',
        ];
    }
}
