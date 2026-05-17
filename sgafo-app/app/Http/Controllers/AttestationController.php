<?php

namespace App\Http\Controllers;

use App\Models\Attestation;
use App\Models\AttestationTemplate;
use App\Models\PlanFormation;
use App\Models\User;
use App\Notifications\AttestationPrete;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AttestationController extends Controller
{
    /**
     * Liste globale de toutes les attestations par plan de formation.
     */
    public function list()
    {
        $plans = PlanFormation::with(['entite', 'participants', 'themes.animateurs'])
            ->where('statut', 'validé')
            ->orderBy('date_validation', 'desc')
            ->get();

        $plansData = $plans->map(function ($plan) {
            $animateurIds = $plan->getAnimateurIds();
            $totalPeople = $plan->participants->count() + count($animateurIds);
            
            $generatedCount = Attestation::where('plan_id', $plan->id)->count();

            return [
                'id' => $plan->id,
                'titre' => $plan->titre,
                'entite' => $plan->entite?->titre ?? '—',
                'date_debut' => $plan->date_debut?->format('d/m/Y'),
                'date_fin' => $plan->date_fin?->format('d/m/Y'),
                'participants_count' => $plan->participants->count(),
                'animateurs_count' => count($animateurIds),
                'generated_count' => $generatedCount,
                'total_expected' => $totalPeople,
                'is_completed' => $generatedCount > 0 && $generatedCount >= $totalPeople,
            ];
        });

        return Inertia::render('Modules/Attestations/List', [
            'plans' => $plansData,
        ]);
    }

    /**
     * Page principale — RF choisit une formation et génère les attestations.
     */
    public function index(PlanFormation $plan)
    {
        $plan->load([
            'entite.secteur',
            'participants',
            'themes.animateurs',
            'validateur',
        ]);

        // Récupérer les animateurs
        $animateurIds = $plan->getAnimateurIds();
        $animateurs = User::whereIn('id', $animateurIds)->get();

        // Récupérer ou initialiser les templates (Royal par défaut)
        $participantTemplate = AttestationTemplate::where('plan_id', $plan->id)
            ->where('type', 'participant')
            ->first();
        if (!$participantTemplate) {
            $defaults = $this->getDefaultTemplate('participant', 'royal');
            $participantTemplate = new AttestationTemplate([
                'html_content' => $defaults['html_content'],
                'css_content' => $defaults['css_content']
            ]);
        }

        $animateurTemplate = AttestationTemplate::where('plan_id', $plan->id)
            ->where('type', 'animateur')
            ->first();
        if (!$animateurTemplate) {
            $defaults = $this->getDefaultTemplate('animateur', 'royal');
            $animateurTemplate = new AttestationTemplate([
                'html_content' => $defaults['html_content'],
                'css_content' => $defaults['css_content']
            ]);
        }

        // Attestations déjà générées
        $attestations = Attestation::where('plan_id', $plan->id)
            ->with('user')
            ->get()
            ->groupBy('type');

        return Inertia::render('Modules/Attestations/Index', [
            'plan' => [
                'id' => $plan->id,
                'titre' => $plan->titre,
                'statut' => $plan->statut,
                'date_debut' => $plan->date_debut?->format('d/m/Y'),
                'date_fin' => $plan->date_fin?->format('d/m/Y'),
                'entite' => $plan->entite?->titre,
                'duree_heures' => $plan->themes->sum('duree_heures'),
                'nom_rf' => $plan->validateur
                    ? "{$plan->validateur->prenom} {$plan->validateur->nom}"
                    : auth()->user()->prenom . ' ' . auth()->user()->nom,
            ],
            'participants' => $plan->participants->map(fn($u) => [
                'id' => $u->id,
                'nom_complet' => "{$u->prenom} {$u->nom}",
                'email' => $u->email,
                'has_attestation' => isset($attestations['participant']) &&
                    $attestations['participant']->firstWhere('user_id', $u->id) !== null,
            ]),
            'animateurs' => $animateurs->map(fn($u) => [
                'id' => $u->id,
                'nom_complet' => "{$u->prenom} {$u->nom}",
                'email' => $u->email,
                'has_attestation' => isset($attestations['animateur']) &&
                    $attestations['animateur']->firstWhere('user_id', $u->id) !== null,
            ]),
            'templates' => [
                'participant' => [
                    'html' => $participantTemplate->html_content,
                    'css' => $participantTemplate->css_content,
                ],
                'animateur' => [
                    'html' => $animateurTemplate->html_content,
                    'css' => $animateurTemplate->css_content,
                ]
            ],
            'already_generated' => Attestation::where('plan_id', $plan->id)->exists(),
        ]);
    }

    /**
     * Sauvegarde du template HTML/CSS pour une formation
     */
    public function saveTemplate(Request $request, PlanFormation $plan)
    {
        $request->validate([
            'type' => 'required|in:participant,animateur',
            'key' => 'nullable|string|in:royal,emerald,minimalist,indigo',
            'html_content' => 'nullable|string',
            'css_content' => 'nullable|string',
        ]);

        if ($request->filled('key')) {
            $templateData = $this->getDefaultTemplate($request->type, $request->key);
            $html = $templateData['html_content'];
            $css = $templateData['css_content'];
        } else {
            $html = $request->html_content;
            $css = $request->css_content ?? '';
        }

        AttestationTemplate::updateOrCreate(
            ['plan_id' => $plan->id, 'type' => $request->type],
            [
                'html_content' => $html,
                'css_content' => $css,
                'created_by' => auth()->id()
            ]
        );

        return back()->with('success', 'Template enregistré avec succès !');
    }

    /**
     * Téléchargement de test pour prévisualiser le rendu
     */
    public function testTemplate(Request $request, PlanFormation $plan)
    {
        $request->validate([
            'type' => 'required|in:participant,animateur',
            'key' => 'nullable|string|in:royal,emerald,minimalist,indigo',
            'html_content' => 'nullable|string',
            'css_content' => 'nullable|string',
        ]);

        $dureeHeures = $plan->themes->sum('duree_heures');
        $rfName = $plan->validateur
            ? "{$plan->validateur->prenom} {$plan->validateur->nom}"
            : auth()->user()->prenom . ' ' . auth()->user()->nom;

        // Variables de simulation
        $vars = [
            'nom_complet' => 'Mohammed El-Fassi',
            'titre_formation' => $plan->titre,
            'date_debut' => $plan->date_debut?->format('d/m/Y') ?? '01/05/2026',
            'date_fin' => $plan->date_fin?->format('d/m/Y') ?? '10/05/2026',
            'duree_heures' => $dureeHeures > 0 ? $dureeHeures : 30,
            'entite' => $plan->entite?->titre ?? 'OFPPT',
            'nom_rf' => $rfName,
            'date_emission' => now()->format('d/m/Y'),
            'reference' => 'SGAFO-TEST-000',
        ];

        if ($request->filled('key')) {
            $templateData = $this->getDefaultTemplate($request->type, $request->key);
            $html = $templateData['html_content'];
            $css = $templateData['css_content'];
        } else {
            $html = $request->html_content;
            $css = $request->css_content ?? '';
        }

        // Remplacer les variables
        foreach ($vars as $key => $val) {
            $html = str_replace('{{' . $key . '}}', $val, $html);
        }

        $pdf = Pdf::loadHTML(view('attestations.certificate', [
            'html_content' => $html,
            'css_content' => $css
        ])->render())
            ->setPaper('a4', 'landscape')
            ->setOption('dpi', 150);

        return $pdf->download("Test_Attestation_{$request->type}.pdf");
    }

    /**
     * Génère tous les PDFs pour une formation et envoie les notifications.
     */
    public function generate(PlanFormation $plan)
    {
        $plan->load(['entite', 'participants', 'themes.animateurs', 'validateur']);

        $animateurIds = $plan->getAnimateurIds();
        $animateurs = User::whereIn('id', $animateurIds)->get();

        $rfName = $plan->validateur
            ? "{$plan->validateur->prenom} {$plan->validateur->nom}"
            : auth()->user()->prenom . ' ' . auth()->user()->nom;

        $dureeHeures = $plan->themes->sum('duree_heures');

        // Récupérer les templates custom ou les defaults
        $participantTemplate = AttestationTemplate::where('plan_id', $plan->id)
            ->where('type', 'participant')
            ->first();
        if (!$participantTemplate) {
            $defaults = $this->getDefaultTemplate('participant', 'royal');
            $participantTemplate = (object) $defaults;
        }

        $animateurTemplate = AttestationTemplate::where('plan_id', $plan->id)
            ->where('type', 'animateur')
            ->first();
        if (!$animateurTemplate) {
            $defaults = $this->getDefaultTemplate('animateur', 'royal');
            $animateurTemplate = (object) $defaults;
        }

        $generated = [];

        // 1. Générer les attestations pour les PARTICIPANTS
        foreach ($plan->participants as $participant) {
            $vars = [
                'nom_complet' => "{$participant->prenom} {$participant->nom}",
                'titre_formation' => $plan->titre,
                'date_debut' => $plan->date_debut?->format('d/m/Y') ?? '',
                'date_fin' => $plan->date_fin?->format('d/m/Y') ?? '',
                'duree_heures' => $dureeHeures,
                'entite' => $plan->entite?->titre ?? 'OFPPT',
                'nom_rf' => $rfName,
                'date_emission' => now()->format('d/m/Y'),
                'reference' => "SGAFO-P-{$plan->id}-{$participant->id}",
            ];

            $html = $participantTemplate->html_content;
            foreach ($vars as $key => $val) {
                $html = str_replace('{{' . $key . '}}', $val, $html);
            }

            $attestation = $this->generatePdfFile($plan, $participant, 'participant', $html, $participantTemplate->css_content ?? '');
            $generated[] = $attestation;

            // Envoyer notification
            $participant->notify(new AttestationPrete($attestation));
        }

        // 2. Générer les attestations pour les ANIMATEURS
        foreach ($animateurs as $animateur) {
            $vars = [
                'nom_complet' => "{$animateur->prenom} {$animateur->nom}",
                'titre_formation' => $plan->titre,
                'date_debut' => $plan->date_debut?->format('d/m/Y') ?? '',
                'date_fin' => $plan->date_fin?->format('d/m/Y') ?? '',
                'duree_heures' => $dureeHeures,
                'entite' => $plan->entite?->titre ?? 'OFPPT',
                'nom_rf' => $rfName,
                'date_emission' => now()->format('d/m/Y'),
                'reference' => "SGAFO-A-{$plan->id}-{$animateur->id}",
            ];

            $html = $animateurTemplate->html_content;
            foreach ($vars as $key => $val) {
                $html = str_replace('{{' . $key . '}}', $val, $html);
            }

            $attestation = $this->generatePdfFile($plan, $animateur, 'animateur', $html, $animateurTemplate->css_content ?? '');
            $generated[] = $attestation;

            // Envoyer notification
            $animateur->notify(new AttestationPrete($attestation));
        }

        return back()->with('success', count($generated) . ' attestation(s) générée(s) et envoyées avec succès.');
    }

    /**
     * Téléchargement public via token UUID (sans authentification requise).
     */
    public function download(string $token)
    {
        $attestation = Attestation::where('download_token', $token)
            ->with(['plan', 'user'])
            ->firstOrFail();

        if (!$attestation->downloaded_at) {
            $attestation->update(['downloaded_at' => now()]);
        }

        $filePath = Storage::path($attestation->file_path);

        if (!file_exists($filePath)) {
            abort(404, 'Fichier introuvable.');
        }

        $fileName = "Attestation_{$attestation->type}_{$attestation->user->prenom}_{$attestation->user->nom}.pdf";

        return response()->download($filePath, $fileName, [
            'Content-Type' => 'application/pdf',
        ]);
    }

    /**
     * Helper privé — génère le PDF et sauvegarde l'enregistrement.
     */
    private function generatePdfFile(PlanFormation $plan, User $user, string $type, string $htmlContent, string $cssContent): Attestation
    {
        $pdf = Pdf::loadHTML(view('attestations.certificate', [
            'html_content' => $htmlContent,
            'css_content' => $cssContent
        ])->render())
            ->setPaper('a4', 'landscape')
            ->setOption('dpi', 150);

        $folder = "attestations/{$plan->id}";
        $filename = "{$type}_{$user->id}_" . time() . '.pdf';
        $path = "{$folder}/{$filename}";

        Storage::put($path, $pdf->output());

        return Attestation::updateOrCreate(
            ['plan_id' => $plan->id, 'user_id' => $user->id, 'type' => $type],
            ['file_path' => $path, 'download_token' => \Illuminate\Support\Str::uuid(), 'downloaded_at' => null]
        );
    }

    /**
     * Templates par défaut pour participants et animateurs
     */
    private function getDefaultTemplate(string $type, string $key = 'royal'): array
    {
        // ----------------------------------------------------
        // 1. Template: Classique Royal (Navy & Gold)
        // ----------------------------------------------------
        if ($key === 'royal') {
            $certTitle = $type === 'participant' ? 'Participation Active' : "Animation de Formation";
            $certLabel = $type === 'participant' ? 'Attestation de Formation' : "Attestation d'Encadrement";
            $subtitle = $type === 'participant' ? 'est décernée à' : "est décernée à l'expert";
            $descText = $type === 'participant' 
                ? "Pour avoir suivi et complété avec succès les séances d'apprentissage de la formation continue ci-dessous :"
                : "En témoignage de sa contribution remarquable dans la préparation, l'animation et l'encadrement pédagogique du plan de formation :";
            $stampLabel = $type === 'participant' ? "SGAFO<br>ROYAL<br>OFFICIEL" : "SGAFO<br>ANIMATEUR<br>OFFICIEL";

            $html = <<<HTML
<div class="certificate royal">
    <div class="border-outer"></div>
    <div class="border-inner"></div>
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>
    <div class="stripe"></div>
    <div class="stripe-logo">
        <div class="stripe-dot"></div>
        <div class="stripe-text">OFPPT · SGAFO</div>
        <div class="stripe-dot"></div>
    </div>
    <div class="content">
        <div class="logo-area">
            <div class="logo-badge">R</div>
            <div class="org-info">
                <div class="org-name">OFPPT — SGAFO</div>
                <div class="org-sub">Royaume du Maroc — Plan de Formation Continue</div>
            </div>
        </div>
        <div class="divider"></div>
        <div class="cert-label">{$certLabel}</div>
        <div class="cert-title">{$certTitle}</div>
        <div class="cert-subtitle">{$subtitle}</div>
        <div class="recipient-name">{{nom_complet}}</div>
        <p class="desc-text">{$descText}</p>
        <div class="formation-box">
            <div class="formation-title">{{titre_formation}}</div>
        </div>
        <div class="meta-row">
            <div class="meta-item">
                <div class="meta-value">{{date_debut}}</div>
                <div class="meta-label">Date début</div>
            </div>
            <div class="meta-item">
                <div class="meta-value">{{date_fin}}</div>
                <div class="meta-label">Date fin</div>
            </div>
            <div class="meta-item">
                <div class="meta-value">{{duree_heures}}h</div>
                <div class="meta-label">Volume Horaire</div>
            </div>
            <div class="meta-item">
                <div class="meta-value">{{entite}}</div>
                <div class="meta-label">Établissement</div>
            </div>
        </div>
    </div>
    <div class="footer">
        <div class="signature-block">
            <div class="signature-line"></div>
            <div class="signature-name">{{nom_rf}}</div>
            <div class="signature-role">Responsable de Formation</div>
        </div>
        <div class="stamp-area">
            <div class="stamp">
                <div class="stamp-inner">{$stampLabel}</div>
            </div>
            <div class="cert-number">Réf: {{reference}}</div>
        </div>
        <div class="signature-block">
            <div class="signature-line"></div>
            <div class="signature-name">Direction Régionale</div>
            <div class="signature-role">Émis le {{date_emission}}</div>
        </div>
    </div>
</div>
HTML;

            $css = <<<CSS
.certificate.royal {
    width: 297mm;
    height: 210mm;
    background: #ffffff;
    position: relative;
    padding: 20mm 25mm;
    box-sizing: border-box;
}
.royal .border-outer {
    position: absolute;
    top: 8mm; left: 8mm; right: 8mm; bottom: 8mm;
    border: 2.5px solid #1e3a5f;
}
.royal .border-inner {
    position: absolute;
    top: 10mm; left: 10mm; right: 10mm; bottom: 10mm;
    border: 1px solid #c9a84c;
}
.royal .corner {
    position: absolute;
    width: 18mm;
    height: 18mm;
    border-color: #c9a84c;
    border-style: solid;
}
.royal .corner-tl { top: 6mm; left: 6mm; border-width: 3px 0 0 3px; }
.royal .corner-tr { top: 6mm; right: 6mm; border-width: 3px 3px 0 0; }
.royal .corner-bl { bottom: 6mm; left: 6mm; border-width: 0 0 3px 3px; }
.royal .corner-br { bottom: 6mm; right: 6mm; border-width: 0 3px 3px 0; }
.royal .stripe {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 18mm;
    background: #1e3a5f;
}
.royal .stripe-logo {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 18mm;
    text-align: center;
    padding-top: 20mm;
}
.royal .stripe-text {
    color: rgba(255,255,255,0.7);
    font-size: 7pt;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
}
.royal .stripe-dot {
    width: 6px;
    height: 6px;
    background: #c9a84c;
    border-radius: 50%;
    margin: 4mm auto;
}
.royal .content {
    margin-left: 14mm;
    width: 100%;
    text-align: center;
}
.royal .logo-area {
    margin-bottom: 4mm;
    text-align: center;
}
.royal .logo-badge {
    display: inline-block;
    width: 14mm;
    height: 14mm;
    background: #1e3a5f;
    border-radius: 3mm;
    color: white;
    font-size: 16pt;
    font-weight: 900;
    line-height: 14mm;
    text-align: center;
}
.royal .org-info {
    display: inline-block;
    vertical-align: middle;
    text-align: left;
    margin-left: 4mm;
}
.royal .org-name { font-size: 11pt; font-weight: 700; color: #1e3a5f; letter-spacing: 1px; text-transform: uppercase; }
.royal .org-sub { font-size: 7pt; color: #5a6a7a; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 1mm; }
.royal .divider {
    width: 60mm;
    height: 1px;
    background: #c9a84c;
    margin: 4mm auto;
}
.royal .cert-label {
    font-size: 8pt;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #c9a84c;
    font-weight: 600;
    margin-bottom: 2mm;
}
.royal .cert-title {
    font-size: 24pt;
    font-weight: 900;
    color: #1e3a5f;
    line-height: 1.1;
    margin-bottom: 3mm;
}
.royal .cert-subtitle {
    font-size: 8pt;
    color: #5a6a7a;
    margin-bottom: 3mm;
}
.royal .recipient-name {
    font-size: 20pt;
    font-weight: 700;
    color: #c9a84c;
    border-bottom: 1.5px solid #1e3a5f;
    padding-bottom: 1.5mm;
    width: 120mm;
    margin: 0 auto 3mm;
}
.royal .desc-text {
    font-size: 8pt;
    color: #5a6a7a;
    margin: 0 auto 4mm;
    width: 80%;
    line-height: 1.4;
}
.royal .formation-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 2mm;
    padding: 3mm 6mm;
    margin: 0 auto 4mm;
    width: 80%;
}
.royal .formation-title {
    font-size: 10pt;
    font-weight: 700;
    color: #1e3a5f;
}
.royal .meta-row {
    margin: 0 auto 4mm;
    text-align: center;
}
.royal .meta-item {
    display: inline-block;
    margin: 0 5mm;
    text-align: center;
}
.royal .meta-value {
    font-size: 9pt;
    font-weight: 600;
    color: #1e3a5f;
}
.royal .meta-label {
    font-size: 6.5pt;
    color: #7a8a9a;
    text-transform: uppercase;
    letter-spacing: 1px;
}
.royal .footer {
    position: absolute;
    bottom: 14mm;
    left: 28mm;
    right: 14mm;
}
.royal .signature-block {
    display: inline-block;
    width: 70mm;
    text-align: center;
}
.royal .signature-line {
    width: 40mm;
    height: 1px;
    background: #1e3a5f;
    margin: 0 auto 1.5mm;
}
.royal .signature-name { font-size: 7.5pt; font-weight: 600; color: #1e3a5f; }
.royal .signature-role { font-size: 6pt; color: #7a8a9a; }
.royal .stamp-area {
    display: inline-block;
    width: 60mm;
    text-align: center;
}
.royal .stamp {
    width: 18mm;
    height: 18mm;
    border: 2px solid #1e3a5f;
    border-radius: 50%;
    margin: 0 auto 1mm;
    background: rgba(30, 58, 95, 0.03);
    text-align: center;
}
.royal .stamp-inner {
    font-size: 5.5pt;
    color: #1e3a5f;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding-top: 3.5mm;
    line-height: 1.2;
}
.royal .cert-number {
    font-size: 6pt;
    color: #9a9a9a;
}
CSS;
        }

        // ----------------------------------------------------
        // 2. Template: Moderne Émeraude (Emerald & Gold)
        // ----------------------------------------------------
        elseif ($key === 'emerald') {
            $badgeText = $type === 'participant' ? 'CERTIFIÉ' : 'EXPERT';
            $certTitle = $type === 'participant' ? 'Attestation de Formation' : "Attestation d'Animation";
            $subtitle = $type === 'participant' ? 'Ce document officiel atteste que le participant' : 'Ce document officiel atteste que le formateur expert';
            $descText = $type === 'participant'
                ? "A suivi assidûment et validé avec succès l'ensemble des modules d'apprentissage de la formation professionnelle continue mentionnée ci-après :"
                : "A préparé, structuré, animé et encadré avec un professionnalisme remarquable l'action de formation continue suivante :";
            $valLabel = $type === 'participant' ? 'Volume Horaire' : 'Heures Animées';
            $sealText = $type === 'participant' ? 'SGAFO' : 'EXPERT';

            $html = <<<HTML
<div class="certificate emerald">
    <div class="border-accent"></div>
    <div class="content">
        <div class="badge-top">{$badgeText}</div>
        <h1 class="title">{$certTitle}</h1>
        <p class="subtitle">{$subtitle}</p>
        <div class="recipient-name">{{nom_complet}}</div>
        <p class="description">{$descText}</p>
        <div class="course-badge">{{titre_formation}}</div>
        <div class="details-grid">
            <div class="detail-cell">
                <span class="val">{{date_debut}}</span>
                <span class="lbl">Date de Début</span>
            </div>
            <div class="detail-cell">
                <span class="val">{{date_fin}}</span>
                <span class="lbl">Date de Fin</span>
            </div>
            <div class="detail-cell">
                <span class="val">{{duree_heures}} h</span>
                <span class="lbl">{$valLabel}</span>
            </div>
            <div class="detail-cell">
                <span class="val">{{entite}}</span>
                <span class="lbl">Établissement</span>
            </div>
        </div>
    </div>
    <div class="footer">
        <table class="footer-table">
            <tr>
                <td class="sign-col">
                    <div class="line"></div>
                    <div class="name">{{nom_rf}}</div>
                    <div class="role">Responsable de Formation</div>
                </td>
                <td class="seal-col">
                    <div class="seal-badge">{$sealText}</div>
                    <div class="ref">Réf: {{reference}}</div>
                </td>
                <td class="sign-col">
                    <div class="line"></div>
                    <div class="name">OFPPT Maroc</div>
                    <div class="role">Généré le {{date_emission}}</div>
                </td>
            </tr>
        </table>
    </div>
</div>
HTML;

            $css = <<<CSS
.certificate.emerald {
    width: 297mm;
    height: 210mm;
    background: #fbfdfb;
    position: relative;
    padding: 25mm 30mm;
    box-sizing: border-box;
}
.emerald .border-accent {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 10mm;
    background: #0f766e;
}
.emerald .content {
    margin-left: 5mm;
    text-align: center;
}
.emerald .badge-top {
    display: inline-block;
    padding: 1.5mm 4mm;
    background: rgba(15, 118, 110, 0.08);
    color: #0f766e;
    font-size: 7.5pt;
    font-weight: 800;
    letter-spacing: 2.5px;
    border-radius: 50px;
    text-transform: uppercase;
    margin-bottom: 4mm;
}
.emerald .title {
    font-size: 24pt;
    font-weight: 800;
    color: #111827;
    margin: 0 0 2mm 0;
}
.emerald .subtitle {
    font-size: 8pt;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0 0 4mm 0;
}
.emerald .recipient-name {
    font-size: 22pt;
    font-weight: 800;
    color: #0f766e;
    margin: 0 auto 4mm;
    display: inline-block;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 1.5mm;
    min-width: 100mm;
}
.emerald .description {
    font-size: 8.5pt;
    color: #4b5563;
    line-height: 1.5;
    margin: 0 auto 5mm;
    width: 85%;
}
.emerald .course-badge {
    background: #0f766e;
    color: white;
    font-size: 11pt;
    font-weight: 700;
    padding: 2.5mm 8mm;
    border-radius: 6px;
    display: inline-block;
    margin-bottom: 6mm;
}
.emerald .details-grid {
    text-align: center;
    margin-bottom: 8mm;
}
.emerald .detail-cell {
    display: inline-block;
    margin: 0 6mm;
    text-align: center;
}
.emerald .detail-cell .val {
    display: block;
    font-size: 9.5pt;
    font-weight: 700;
    color: #1f2937;
}
.emerald .detail-cell .lbl {
    display: block;
    font-size: 6.5pt;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 0.5mm;
}
.emerald .footer {
    position: absolute;
    bottom: 14mm;
    left: 40mm;
    right: 30mm;
}
.emerald .footer-table {
    width: 100%;
    border-collapse: collapse;
}
.emerald .footer-table td {
    vertical-align: middle;
    text-align: center;
}
.emerald .sign-col {
    width: 35%;
}
.emerald .sign-col .line {
    width: 35mm;
    height: 1px;
    background: #d1d5db;
    margin: 0 auto 2mm;
}
.emerald .sign-col .name { font-size: 7.5pt; font-weight: 700; color: #111827; }
.emerald .sign-col .role { font-size: 6pt; color: #9ca3af; }
.emerald .seal-col {
    width: 30%;
}
.emerald .seal-badge {
    display: inline-block;
    width: 14mm;
    height: 14mm;
    border-radius: 50%;
    background: #0f766e;
    color: white;
    font-size: 6.5pt;
    font-weight: 850;
    line-height: 14mm;
    text-align: center;
    letter-spacing: 1.5px;
    margin-bottom: 1mm;
}
.emerald .ref {
    font-size: 6pt;
    color: #9ca3af;
}
CSS;
        }

        // ----------------------------------------------------
        // 3. Template: Chic Minimaliste (Sleek Charcoal)
        // ----------------------------------------------------
        elseif ($key === 'minimalist') {
            $tag = $type === 'participant' ? 'SGAFO · ACCRÉDITATION' : 'SGAFO · ACADÉMIQUE';
            $certTitleSub = $type === 'participant' ? 'DE PARTICIPATION EXCEPTIONNELLE' : "D'ENCADREMENT & D'ANIMATION";
            $textCertify = $type === 'participant' ? "Le comité certifie l'accomplissement de" : "Le comité certifie l'engagement pédagogique de";
            $descText = $type === 'participant'
                ? "Qui a finalisé avec dévouement l'action de perfectionnement professionnel :"
                : "Qui a préparé, structuré, dispensé et évalué l'action d'apprentissage :";
            $valLabel = $type === 'participant' ? 'Volume Horaire' : 'Heures Animées';
            $stamp = $type === 'participant' ? 'VALIDÉ' : 'EXPERT';

            $html = <<<HTML
<div class="certificate minimalist">
    <div class="thin-border"></div>
    <div class="wrapper">
        <div class="top-line">{$tag}</div>
        <div class="title-main">ATTESTATION</div>
        <div class="title-sub">{$certTitleSub}</div>
        <div class="certify-to">{$textCertify}</div>
        <div class="recipient">{{nom_complet}}</div>
        <div class="body-text">{$descText}</div>
        <div class="formation-title">« {{titre_formation}} »</div>
        <table class="grid-table">
            <tr>
                <td>
                    <span class="value">{{date_debut}}</span>
                    <span class="label">Date Début</span>
                </td>
                <td>
                    <span class="value">{{date_fin}}</span>
                    <span class="label">Date Fin</span>
                </td>
                <td>
                    <span class="value">{{duree_heures}} h</span>
                    <span class="label">{$valLabel}</span>
                </td>
                <td>
                    <span class="value">{{entite}}</span>
                    <span class="label">Établissement</span>
                </td>
            </tr>
        </table>
        <div class="footer-area">
            <table class="sigs-table">
                <tr>
                    <td>
                        <div class="name-text">{{nom_rf}}</div>
                        <div class="role-text">Responsable de Formation</div>
                    </td>
                    <td class="ref-cell">
                        <div class="stamp-circle">{$stamp}</div>
                        <div class="ref-text">ID: {{reference}}</div>
                    </td>
                    <td>
                        <div class="name-text">Direction Régionale</div>
                        <div class="role-text">Délivré le {{date_emission}}</div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</div>
HTML;

            $css = <<<CSS
.certificate.minimalist {
    width: 297mm;
    height: 210mm;
    background: #ffffff;
    position: relative;
    padding: 22mm 22mm;
    box-sizing: border-box;
}
.minimalist .thin-border {
    position: absolute;
    top: 10mm; left: 10mm; right: 10mm; bottom: 10mm;
    border: 1px solid #1e293b;
}
.minimalist .wrapper {
    position: relative;
    text-align: center;
    width: 100%;
}
.minimalist .top-line {
    font-size: 7.5pt;
    font-weight: 500;
    color: #64748b;
    letter-spacing: 3px;
    margin-bottom: 6mm;
}
.minimalist .title-main {
    font-size: 26pt;
    font-weight: 300;
    color: #0f172a;
    letter-spacing: 6px;
    margin: 0;
}
.minimalist .title-sub {
    font-size: 8pt;
    font-weight: 700;
    color: #475569;
    letter-spacing: 2px;
    margin-top: 1.5mm;
    margin-bottom: 6mm;
}
.minimalist .certify-to {
    font-size: 8pt;
    font-style: italic;
    color: #64748b;
    margin-bottom: 2.5mm;
}
.minimalist .recipient {
    font-size: 22pt;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 4mm;
    letter-spacing: 0.5px;
}
.minimalist .body-text {
    font-size: 8.5pt;
    color: #475569;
    margin-bottom: 3mm;
}
.minimalist .formation-title {
    font-size: 11.5pt;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 7mm;
}
.minimalist .grid-table {
    width: 80%;
    margin: 0 auto 8mm;
    border-collapse: collapse;
}
.minimalist .grid-table td {
    width: 25%;
    text-align: center;
}
.minimalist .grid-table .value {
    display: block;
    font-size: 9.5pt;
    font-weight: 600;
    color: #0f172a;
}
.minimalist .grid-table .label {
    display: block;
    font-size: 6.5pt;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 0.5mm;
}
.minimalist .footer-area {
    position: absolute;
    bottom: 2mm;
    left: 10mm;
    right: 10mm;
}
.minimalist .sigs-table {
    width: 100%;
    border-collapse: collapse;
}
.minimalist .sigs-table td {
    width: 33.33%;
    text-align: center;
    vertical-align: bottom;
}
.minimalist .name-text {
    font-size: 8pt;
    font-weight: 700;
    color: #0f172a;
}
.minimalist .role-text {
    font-size: 6.5pt;
    color: #64748b;
    margin-top: 0.5mm;
}
.minimalist .ref-cell {
    text-align: center;
}
.minimalist .stamp-circle {
    display: inline-block;
    padding: 1mm 3mm;
    border: 1px solid #1e293b;
    font-size: 6pt;
    font-weight: 700;
    border-radius: 4px;
    letter-spacing: 1px;
    margin-bottom: 1mm;
}
.minimalist .ref-text {
    font-size: 5.5pt;
    color: #94a3b8;
}
CSS;
        }

        // ----------------------------------------------------
        // 4. Template: Technologique Indigo (Neon Tech)
        // ----------------------------------------------------
        elseif ($key === 'indigo') {
            $tag = $type === 'participant' ? 'SGAFO DIGITAL SYSTEM' : "CORPS D'ANIMATION TECHNIQUE";
            $heading = $type === 'participant' ? 'Attestation de Spécialisation' : "Attestation d'Expertise";
            $subtitle = $type === 'participant' ? 'Ce certificat de compétence valide est décerné à' : "Ce certificat d'animation professionnelle est décerné à";
            $descText = $type === 'participant'
                ? "Pour avoir démontré des aptitudes et validé l'évaluation finale pratique de la formation professionnelle :"
                : "Pour sa contribution majeure et l'excellence de son encadrement didactique lors de la session :";
            $valLabel = $type === 'participant' ? 'Durée Certifiée' : 'Heures Encadrées';
            $badge = $type === 'participant' ? 'SGAFO VALIDÉ' : 'EXPERT TECHNIQUE';

            $html = <<<HTML
<div class="certificate indigo">
    <div class="frame">
        <div class="dot tl"></div>
        <div class="dot tr"></div>
        <div class="dot bl"></div>
        <div class="dot br"></div>
    </div>
    <div class="top-tag">{$tag}</div>
    <div class="heading">{$heading}</div>
    <div class="subtitle">{$subtitle}</div>
    <div class="name-display">{{nom_complet}}</div>
    <div class="description-block">{$descText}</div>
    <div class="title-highlight">{{titre_formation}}</div>
    <div class="grid-container">
        <table class="simple-grid">
            <tr>
                <td>
                    <span class="v">{{date_debut}}</span>
                    <span class="l">Date Début</span>
                </td>
                <td>
                    <span class="v">{{date_fin}}</span>
                    <span class="l">Date Fin</span>
                </td>
                <td>
                    <span class="v">{{duree_heures}} Heures</span>
                    <span class="l">{$valLabel}</span>
                </td>
                <td>
                    <span class="v">{{entite}}</span>
                    <span class="l">Émetteur</span>
                </td>
            </tr>
        </table>
    </div>
    <div class="sigs-area">
        <table class="sigs-layout">
            <tr>
                <td>
                    <div class="sig-name">{{nom_rf}}</div>
                    <div class="sig-title">Responsable Pédagogique</div>
                </td>
                <td class="center-col">
                    <div class="digital-badge">{$badge}</div>
                    <div class="ref-code">REF: {{reference}}</div>
                </td>
                <td>
                    <div class="sig-name">OFPPT Maroc</div>
                    <div class="sig-title">Délivré le {{date_emission}}</div>
                </td>
            </tr>
        </table>
    </div>
</div>
HTML;

            $css = <<<CSS
.certificate.indigo {
    width: 297mm;
    height: 210mm;
    background: #0b0f19;
    position: relative;
    padding: 22mm 25mm;
    box-sizing: border-box;
    color: #e2e8f0;
}
.indigo .frame {
    position: absolute;
    top: 10mm; left: 10mm; right: 10mm; bottom: 10mm;
    border: 1px solid rgba(79, 70, 229, 0.2);
}
.indigo .dot {
    position: absolute;
    width: 4px;
    height: 4px;
    background: #6366f1;
    border-radius: 50%;
}
.indigo .dot.tl { top: -2px; left: -2px; }
.indigo .dot.tr { top: -2px; right: -2px; }
.indigo .dot.bl { bottom: -2px; left: -2px; }
.indigo .dot.br { bottom: -2px; right: -2px; }

.indigo .top-tag {
    text-align: center;
    font-size: 7pt;
    font-weight: 900;
    color: #6366f1;
    letter-spacing: 4px;
    margin-bottom: 5mm;
    text-transform: uppercase;
}
.indigo .heading {
    text-align: center;
    font-size: 23pt;
    font-weight: 900;
    color: #ffffff;
    letter-spacing: 1px;
    margin: 0 0 2mm 0;
}
.indigo .subtitle {
    text-align: center;
    font-size: 8.5pt;
    color: #94a3b8;
    margin-bottom: 4.5mm;
}
.indigo .name-display {
    text-align: center;
    font-size: 22pt;
    font-weight: 900;
    color: #6366f1;
    margin-bottom: 4mm;
}
.indigo .description-block {
    text-align: center;
    font-size: 8pt;
    color: #94a3b8;
    line-height: 1.4;
    width: 80%;
    margin: 0 auto 4mm;
}
.indigo .title-highlight {
    text-align: center;
    background: rgba(99, 102, 241, 0.15);
    border: 1px solid rgba(99, 102, 241, 0.3);
    color: #818cf8;
    font-size: 10pt;
    font-weight: 700;
    padding: 2.5mm 6mm;
    border-radius: 8px;
    display: inline-block;
    margin: 0 auto 6mm;
    left: 50%;
    position: relative;
    transform: translateX(-50%);
}
.indigo .grid-container {
    margin-bottom: 6mm;
}
.indigo .simple-grid {
    width: 80%;
    margin: 0 auto;
    border-collapse: collapse;
}
.indigo .simple-grid td {
    width: 25%;
    text-align: center;
}
.indigo .simple-grid .v {
    display: block;
    font-size: 9.5pt;
    font-weight: 700;
    color: #ffffff;
}
.indigo .simple-grid .l {
    display: block;
    font-size: 6.5pt;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 0.5mm;
}
.indigo .sigs-area {
    position: absolute;
    bottom: 14mm;
    left: 25mm;
    right: 25mm;
}
.indigo .sigs-layout {
    width: 100%;
    border-collapse: collapse;
}
.indigo .sigs-layout td {
    width: 33.33%;
    text-align: center;
    vertical-align: bottom;
}
.indigo .sig-name {
    font-size: 7.5pt;
    font-weight: 700;
    color: #ffffff;
}
.indigo .sig-title {
    font-size: 6pt;
    color: #64748b;
}
.indigo .center-col {
    text-align: center;
}
.indigo .digital-badge {
    display: inline-block;
    padding: 1mm 2.5mm;
    background: rgba(99, 102, 241, 0.2);
    border: 1px solid #6366f1;
    color: #818cf8;
    font-size: 5.5pt;
    font-weight: 800;
    border-radius: 4px;
    margin-bottom: 1mm;
}
.indigo .ref-code {
    font-size: 5.5pt;
    color: #64748b;
}
CSS;
        }

        return [
            'html_content' => $html,
            'css_content' => $css
        ];
    }
}
