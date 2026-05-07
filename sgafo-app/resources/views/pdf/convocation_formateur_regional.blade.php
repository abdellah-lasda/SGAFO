<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Convocation Animateur - Direction Régionale</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; font-size: 11px; color: #333; line-height: 1.6; }
        .header { border-bottom: 3px solid #1a56db; padding-bottom: 15px; margin-bottom: 30px; }
        .dr-info { font-weight: bold; color: #1a56db; font-size: 14px; }
        .title { text-align: center; font-size: 20px; font-weight: black; text-transform: uppercase; margin: 30px 0; color: #1e293b; }
        .section { margin-bottom: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; }
        .label { font-weight: bold; color: #64748b; width: 150px; display: inline-block; }
        .value { color: #0f172a; font-weight: bold; }
        .formateur-card { border: 1px solid #e2e8f0; padding: 15px; margin-bottom: 15px; border-left: 5px solid #1a56db; }
        .footer { position: fixed; bottom: 30px; width: 100%; text-align: center; font-size: 9px; color: #94a3b8; border-top: 1px solid #e2e8f0; pt: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="dr-info">DIRECTION RÉGIONALE : {{ $region_dr }}</div>
        <div>SGAFO - Système de Gestion de l'Apprentissage et de la Formation</div>
    </div>

    <div class="title">Convocation Officielle des Animateurs</div>

    <div class="section">
        <p><span class="label">Formation :</span> <span class="value">{{ $plan->entite?->titre }}</span></p>
        <p><span class="label">Plan / Session :</span> <span class="value">{{ $plan->titre }}</span></p>
        <p><span class="label">Lieu de formation :</span> <span class="value">{{ $plan->siteFormation?->nom ?? 'À distance' }}</span></p>
        <p><span class="label">Période :</span> <span class="value">Du {{ \Carbon\Carbon::parse($plan->date_debut)->format('d/m/Y') }} au {{ \Carbon\Carbon::parse($plan->date_fin)->format('d/m/Y') }}</span></p>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
            <tr style="background: #f1f5f9;">
                <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: left; font-size: 10px; text-transform: uppercase; color: #64748b;">Nom & Prénom</th>
                <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: left; font-size: 10px; text-transform: uppercase; color: #64748b;">Établissement</th>
                <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: left; font-size: 10px; text-transform: uppercase; color: #64748b;">Code</th>
                <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: left; font-size: 10px; text-transform: uppercase; color: #64748b;">Rôle</th>
            </tr>
        </thead>
        <tbody>
            @forelse($formateurs as $formateur)
            <tr>
                <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">{{ $formateur->nom }} {{ $formateur->prenom }}</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">{{ $formateur->instituts->first()?->nom ?? 'N/A' }}</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">{{ $formateur->instituts->first()?->code ?? 'N/A' }}</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0; font-size: 9px;">
                    <span style="color: {{ $formateur->role_dans_plan === 'Animateur' ? '#1e293b' : '#64748b' }}">
                        {{ $formateur->role_dans_plan }}
                    </span>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="4" style="padding: 30px; text-align: center; color: #64748b; font-style: italic; border: 1px solid #e2e8f0;">
                    Aucun animateur de la région n'est encore assigné à ce plan.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div style="margin-top: 50px;">
        <p>Le Directeur Régional est chargé de la transmission de la présente convocation aux établissements d'origine des intéressés pour exécution.</p>
        <div style="float: right; text-align: center; margin-top: 20px;">
            <p>Cachet et Signature</p>
            <div style="height: 80px;"></div>
            <p><strong>Direction Régionale {{ $region_dr }}</strong></p>
        </div>
    </div>

    <div class="footer">
        Ceci est un document officiel généré par la plateforme SGAFO. Toute modification manuelle rend le document caduc.
    </div>
</body>
</html>
