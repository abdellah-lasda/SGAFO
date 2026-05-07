<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bilan Régional de Formation - {{ $regions }}</title>
    <style>
        @page { margin: 20px; }
        body { font-family: 'Helvetica', sans-serif; color: #1e293b; line-height: 1.4; }
        .header { border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: 900; color: #0f172a; }
        .title { text-align: right; }
        .title h1 { margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 2px; }
        .subtitle { color: #64748b; font-size: 12px; }

        .kpi-container { width: 100%; margin-bottom: 30px; }
        .kpi-card { 
            width: 23%; 
            display: inline-block; 
            background: #f8fafc; 
            padding: 15px; 
            border-radius: 10px; 
            border: 1px solid #e2e8f0;
            text-align: center;
            margin-right: 1%;
        }
        .kpi-value { font-size: 18px; font-weight: bold; color: #0f172a; display: block; }
        .kpi-label { font-size: 9px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-top: 5px; }

        .section-title { 
            background: #f1f5f9; 
            padding: 8px 15px; 
            border-radius: 5px; 
            font-size: 13px; 
            font-weight: bold; 
            margin-bottom: 15px;
            color: #0f172a;
            border-left: 4px solid #10b981;
        }

        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #f8fafc; padding: 10px; font-size: 10px; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #e2e8f0; text-align: left; }
        td { padding: 10px; font-size: 11px; border-bottom: 1px solid #f1f5f9; }
        .status-badge { 
            padding: 3px 8px; 
            border-radius: 5px; 
            font-size: 9px; 
            font-weight: bold; 
            text-transform: uppercase;
        }
        .status-confirmé { background: #ecfdf5; color: #059669; }
        .status-validé { background: #eff6ff; color: #2563eb; }

        .radar-table { width: 40%; }
        .footer { position: fixed; bottom: 0; width: 100%; font-size: 9px; color: #94a3b8; text-align: center; padding: 10px; border-top: 1px solid #f1f5f9; }
    </style>
</head>
<body>
    <div class="header">
        <table style="border:0; margin:0;">
            <tr>
                <td style="border:0; padding:0;" class="logo">SGAFO</td>
                <td style="border:0; padding:0;" class="title">
                    <h1>Bilan Régional de Formation</h1>
                    <div class="subtitle">Région : {{ $regions }} | Date : {{ $date }}</div>
                </td>
            </tr>
        </table>
    </div>

    <div class="section-title">Synthèse de Performance Régionale</div>
    <div class="kpi-container">
        <div class="kpi-card">
            <span class="kpi-value">{{ $stats['attendance_rate'] }}%</span>
            <span class="kpi-label">Taux d'Assiduité</span>
        </div>
        <div class="kpi-card">
            <span class="kpi-value">{{ $stats['qcm_average'] }}/100</span>
            <span class="kpi-label">Performance QCM</span>
        </div>
        <div class="kpi-card">
            <span class="kpi-value">{{ $stats['total_formateurs'] }}</span>
            <span class="kpi-label">Effectif Formateurs</span>
        </div>
        <div class="kpi-card" style="margin-right: 0;">
            <span class="kpi-value">{{ $plans->count() }}</span>
            <span class="kpi-label">Plans de Formation</span>
        </div>
    </div>

    <div style="width: 100%;">
        <div style="width: 55%; display: inline-block; vertical-align: top;">
            <div class="section-title">État des Plans de Formation</div>
            <table>
                <thead>
                    <tr>
                        <th>Formation</th>
                        <th>Établissement</th>
                        <th>Statut</th>
                        <th>Date Début</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($plans as $plan)
                    <tr>
                        <td><strong>{{ $plan->entite->titre }}</strong></td>
                        <td>{{ $plan->siteFormation->nom }}</td>
                        <td><span class="status-badge status-{{ $plan->statut }}">{{ $plan->statut }}</span></td>
                        <td>{{ \Carbon\Carbon::parse($plan->date_debut)->format('d/m/Y') }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        <div style="width: 40%; display: inline-block; vertical-align: top; margin-left: 4%;">
            <div class="section-title">Qualité & Satisfaction</div>
            <table class="radar-table">
                <thead>
                    <tr>
                        <th>Catégorie</th>
                        <th>Score / 5</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($stats['satisfaction'] as $item)
                    <tr>
                        <td>{{ $item->categorie }}</td>
                        <td><strong>{{ number_format($item->average, 1) }}</strong></td>
                    </tr>
                    @endforeach
                    @if($stats['satisfaction']->isEmpty())
                    <tr>
                        <td colspan="2" style="text-align:center; color:#94a3b8;">Aucun feedback enregistré</td>
                    </tr>
                    @endif
                </tbody>
            </table>
        </div>
    </div>

    <div class="footer">
        Document généré par {{ $user }} via SGAFO - Système de Gestion Automatisé de la Formation de l'OFPPT
    </div>
</body>
</html>
