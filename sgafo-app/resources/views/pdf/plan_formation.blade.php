<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Plan de Formation - {{ $plan->titre }}</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 11px; color: #333; line-height: 1.4; }
        .header { margin-bottom: 20px; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
        .header table { width: 100%; }
        .logo { width: 120px; }
        .doc-title { text-align: right; color: #2563eb; }
        .doc-title h1 { margin: 0; font-size: 20px; text-transform: uppercase; }
        
        .section { margin-bottom: 20px; }
        .section-title { background: #f8fafc; padding: 5px 10px; border-left: 4px solid #2563eb; font-weight: bold; text-transform: uppercase; margin-bottom: 10px; font-size: 10px; color: #1e40af; }
        
        table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        table th { background: #f1f5f9; text-align: left; padding: 8px; border: 1px solid #e2e8f0; font-size: 9px; text-transform: uppercase; color: #64748b; }
        table td { padding: 8px; border: 1px solid #e2e8f0; vertical-align: top; }
        
        .info-grid { width: 100%; }
        .info-grid td { border: none; padding: 4px 0; }
        .label { font-weight: bold; color: #64748b; width: 150px; }
        
        .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; background: #dbeafe; color: #1e40af; font-weight: bold; font-size: 9px; }
        
        .footer { margin-top: 50px; }
        .signature-table { width: 100%; margin-top: 30px; }
        .signature-box { border: 1px dashed #cbd5e1; height: 100px; padding: 10px; text-align: center; color: #94a3b8; }
        
        .page-break { page-break-after: always; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
        .text-justify { text-align: justify; }
        
        .user-card { margin-bottom: 5px; }
    </style>
</head>
<body>

    <div class="header">
        <table>
            <tr>
                <td>
                    <div style="font-size: 18px; font-weight: black; color: #2563eb;">SGAFO</div>
                    <div style="font-size: 9px; color: #64748b;">Système de Gestion Administrative des Formations</div>
                </td>
                <td class="doc-title">
                    <h1>Plan de Formation</h1>
                    <div style="margin-top: 5px;">Réf: #PF-{{ str_pad($plan->id, 5, '0', STR_PAD_LEFT) }}</div>
                    <div>Date d'émission: {{ date('d/m/Y') }}</div>
                </td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Informations Générales</div>
        <table class="info-grid">
            <tr>
                <td class="label">Titre du Plan:</td>
                <td class="font-bold">{{ $plan->titre }}</td>
            </tr>
            <tr>
                <td class="label">Entité / Direction:</td>
                <td>{{ $plan->entite->titre }} ({{ $plan->entite->secteur->nom ?? 'N/A' }})</td>
            </tr>
            <tr>
                <td class="label">Période:</td>
                <td>Du {{ date('d/m/Y', strtotime($plan->date_debut)) }} au {{ date('d/m/Y', strtotime($plan->date_fin)) }}</td>
            </tr>
            <tr>
                <td class="label">Mode de formation:</td>
                <td><span class="badge">{{ $plan->entite->mode }}</span></td>
            </tr>
        </table>
    </div>

    @if($plan->entite->description || $plan->entite->objectifs)
    <div class="section">
        <div class="section-title">Description & Objectifs du Programme</div>
        @if($plan->entite->description)
        <div style="margin-bottom: 10px;">
            <div class="font-bold" style="color: #64748b; margin-bottom: 5px; font-size: 9px;">DESCRIPTION :</div>
            <div class="text-justify" style="font-size: 10px;">{{ $plan->entite->description }}</div>
        </div>
        @endif
        @if($plan->entite->objectifs)
        <div>
            <div class="font-bold" style="color: #64748b; margin-bottom: 5px; font-size: 9px;">OBJECTIFS GLOBAUX :</div>
            <div class="text-justify" style="font-size: 10px;">{{ $plan->entite->objectifs }}</div>
        </div>
        @endif
    </div>
    @endif

    <div class="section">
        <div class="section-title">Programme de la Formation</div>
        <table>
            <thead>
                <tr>
                    <th style="width: 30px;">#</th>
                    <th>Thème / Module</th>
                    <th style="width: 60px; text-align: center;">Durée</th>
                </tr>
            </thead>
            <tbody>
                @foreach($plan->themes->sortBy('ordre') as $theme)
                <tr>
                    <td class="text-center font-bold">{{ $theme->ordre }}</td>
                    <td>
                        <div class="font-bold">{{ $theme->nom }}</div>
                        @if($theme->objectifs)
                        <div style="font-size: 9px; color: #64748b; margin-top: 4px;"><strong>Objectifs spécifiques :</strong> {{ $theme->objectifs }}</div>
                        @endif
                    </td>
                    <td class="text-center">{{ $theme->duree_heures }}h</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    @php
        $allAnimateurs = $plan->themes->flatMap->animateurs->unique('id');
    @endphp
    <div class="section">
        <div class="section-title">Liste des Animateurs ({{ $allAnimateurs->count() }})</div>
        <table style="border: none;">
            <tr>
                @foreach($allAnimateurs as $index => $anim)
                    <td style="border: 1px solid #e2e8f0; width: 33%;">
                        <div class="font-bold">{{ $anim->prenom }} {{ $anim->nom }}</div>
                        <div style="font-size: 9px; color: #64748b;">
                            @if(isset($anim->instituts) && $anim->instituts->count() > 0)
                                {{ $anim->instituts->first()->nom }}
                            @endif
                        </div>
                    </td>
                    @if(($index + 1) % 3 == 0) </tr><tr> @endif
                @endforeach
            </tr>
        </table>
    </div>

    <div class="page-break"></div>

    <div class="section">
        <div class="section-title">Liste des Participants ({{ $plan->participants->count() }})</div>
        <table>
            <thead>
                <tr>
                    <th>Nom & Prénom</th>
                    <th>Établissement</th>
                </tr>
            </thead>
            <tbody>
                @foreach($plan->participants as $part)
                <tr>
                    <td class="font-bold">{{ $part->prenom }} {{ $part->nom }}</td>
                    <td>{{ $part->instituts->first()->nom ?? '-' }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Logistique & Infrastructures</div>
        @php
            $modeLower = strtolower($plan->entite->mode);
            $hasPhysique = str_contains($modeLower, 'présentiel') || str_contains($modeLower, 'hybride');
            $hasVirtuel = str_contains($modeLower, 'distance') || str_contains($modeLower, 'hybride');
        @endphp

        <table class="info-grid">
            @if($hasPhysique)
            <tr>
                <td class="label">Site Physique:</td>
                <td>
                    @if($plan->siteFormation)
                        <strong>{{ $plan->siteFormation->nom }}</strong> ({{ $plan->siteFormation->ville }})
                    @else
                        <span style="color: #94a3b8;">Non défini</span>
                    @endif
                </td>
            </tr>
            @endif
            @if($hasVirtuel)
            <tr>
                <td class="label">Plateforme Virtuelle:</td>
                <td><strong>{{ $plan->plateforme ?? 'N/A' }}</strong></td>
            </tr>
            <tr>
                <td class="label">Lien Visioconférence:</td>
                <td style="word-break: break-all; color: #2563eb;">{{ $plan->lien_visio ?? 'Non renseigné' }}</td>
            </tr>
            @endif
        </table>
    </div>

    @php
        $hebParticipants = $plan->hebergements->filter(function($h) use ($plan) {
            return $plan->participants->contains('id', $h->user_id);
        });
        $hebAnimateurs = $plan->hebergements->filter(function($h) use ($allAnimateurs) {
            return $allAnimateurs->contains('id', $h->user_id);
        });
    @endphp

    @if($hebParticipants->count() > 0)
    <div class="section">
        <div class="section-title">Hébergement des Participants</div>
        <table>
            <thead>
                <tr>
                    <th>Participant</th>
                    <th>Hôtel</th>
                    <th class="text-center">Nuits</th>
                    <th class="text-right">Coût Estimé</th>
                </tr>
            </thead>
            <tbody>
                @foreach($hebParticipants as $heb)
                <tr>
                    <td class="font-bold">{{ $heb->user->prenom }} {{ $heb->user->nom }}</td>
                    <td>{{ $heb->hotel->nom }} ({{ $heb->hotel->ville }})</td>
                    <td class="text-center">{{ $heb->nombre_nuits }}</td>
                    <td class="text-right">{{ number_format($heb->cout_total, 2, ',', ' ') }} MAD</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    @if($hebAnimateurs->count() > 0)
    <div class="section">
        <div class="section-title">Hébergement des Animateurs</div>
        <table>
            <thead>
                <tr>
                    <th>Animateur</th>
                    <th>Hôtel</th>
                    <th class="text-center">Nuits</th>
                    <th class="text-right">Coût Estimé</th>
                </tr>
            </thead>
            <tbody>
                @foreach($hebAnimateurs as $heb)
                <tr>
                    <td class="font-bold">{{ $heb->user->prenom }} {{ $heb->user->nom }}</td>
                    <td>{{ $heb->hotel->nom }} ({{ $heb->hotel->ville }})</td>
                    <td class="text-center">{{ $heb->nombre_nuits }}</td>
                    <td class="text-right">{{ number_format($heb->cout_total, 2, ',', ' ') }} MAD</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    <div class="footer">
        <table class="signature-table">
            <tr>
                <td style="width: 50%; padding-right: 20px;">
                    <div style="font-weight: bold; margin-bottom: 10px;">L'Émetteur (CDC / Responsable)</div>
                    <div class="signature-box">
                        {{ $plan->createur->prenom }} {{ $plan->createur->nom }}<br>
                        <span style="font-size: 8px;">Date: ________________</span>
                    </div>
                </td>
                <td style="width: 50%; padding-left: 20px;">
                    <div style="font-weight: bold; margin-bottom: 10px;">Validation (Responsable Formation)</div>
                    <div class="signature-box">
                        @if($plan->validateur)
                            {{ $plan->validateur->prenom }} {{ $plan->validateur->nom }}
                        @else
                            Cachet et Signature
                        @endif
                        <br>
                        <span style="font-size: 8px;">Date: ________________</span>
                    </div>
                </td>
            </tr>
        </table>
        
        <div style="text-align: center; margin-top: 40px; font-size: 8px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px;">
            Document généré automatiquement par SGAFO - OFPPT. Toute reproduction doit être validée par la direction régionale.
        </div>
    </div>

</body>
</html>
