<?php

namespace App\Http\Requests\Modules\Animateur;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreRessourceRequest extends FormRequest
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
            'type' => 'required|in:file,link',
            'titre' => 'required|string|max:255',
            'file' => 'required_if:type,file|nullable|file|mimes:pdf,doc,docx,ppt,pptx,xls,xlsx,zip,jpg,jpeg,png|max:5120',
            'url' => 'required_if:type,link|nullable|url|max:500',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'file.max' => 'Le fichier ne doit pas dépasser 5 Mo.',
            'file.mimes' => 'Le fichier doit être un document (PDF, Word, Excel, PPT, Zip) ou une image (JPG, PNG).',
            'url.url' => 'Le lien fourni n\'est pas valide.',
        ];
    }
}
