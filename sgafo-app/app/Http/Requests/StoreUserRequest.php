<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
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
        return [
            'nom'        => 'required|string|max:100',
            'prenom'     => 'required|string|max:100',
            'email'      => 'required|string|email|max:150|unique:users,email',
            'password'   => 'required|string|min:8',
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
            'email.unique'    => 'Cette adresse email est déjà utilisée par un autre utilisateur.',
            'password.min'    => 'Le mot de passe doit contenir au moins 8 caractères.',
            'roles.required'  => 'L\'utilisateur doit avoir au moins un rôle.',
        ];
    }
}
