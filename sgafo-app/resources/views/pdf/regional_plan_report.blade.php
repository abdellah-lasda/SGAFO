<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bilan Stratégique Régional - {{ $regions }}</title>
    <style>
        @page { margin: 15mm; size: A4 landscape; }
        body { font-family: 'Helvetica', sans-serif; color: #1e293b; line-height: 1.4; margin: 0; }
        
        /* Design System */
        .header { border-bottom: 4px solid #4f46e5; padding-bottom: 10px; margin-bottom: 20px; }
        .logo-box { float: left; width: 150px; }
        .logo-text { font-size: 32px; font-weight: 900; color: #1e1b4b; letter-spacing: -1px; }
        .report-meta { float: right; text-align: right; }
        .report-meta h1 { margin: 0; font-size: 24px; color: #1e1b4b; text-transform: uppercase; }
        .report-meta p { margin: 5px 0 0; font-size: 11px; color: #64748b; font-weight: bold; }
        .clear { clear: both; }

        /* KPI Grid */
        /* KPI Table Design */
        .kpi-table { width: 100%; margin-bottom: 30px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; border-spacing: 0; border-collapse: separate; }
        .kpi-table td { width: 25%; padding: 20px; text-align: center; border-right: 1px solid #e2e8f0; background: #ffffff; }
        .kpi-table td:last-child { border-right: 0; }
        .kpi-table .kpi-value { font-size: 28px; font-weight: 900; color: #4f46e5; display: block; margin-bottom: 5px; }
        .kpi-table .kpi-label { font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
        .kpi-table .kpi-sub { font-size: 8px; color: #94a3b8; margin-top: 5px; }

        /* Sections */
        .section-header { 
            background: #f8fafc; 
            padding: 10px 15px; 
            border-radius: 8px; 
            font-size: 14px; 
            font-weight: 900; 
            margin-bottom: 15px;
            color: #1e1b4b;
            border-left: 5px solid #4f46e5;
            text-transform: uppercase;
        }

        /* Charts & Tables */
        .col-container { width: 100%; margin-bottom: 20px; }
        .col-left { width: 48%; float: left; }
        .col-right { width: 48%; float: right; }

        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th { background: #f1f5f9; padding: 10px; font-size: 9px; text-transform: uppercase; color: #475569; border-bottom: 2px solid #e2e8f0; text-align: left; }
        td { padding: 10px; font-size: 11px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        
        /* Mini Charts */
        .bar-container { width: 100%; background: #f1f5f9; height: 12px; border-radius: 10px; overflow: hidden; margin-top: 5px; }
        .bar-fill { height: 100%; border-radius: 10px; }
        .bg-indigo { background: #4f46e5; }
        .bg-emerald { background: #10b981; }
        .bg-amber { background: #f59e0b; }
        .bg-rose { background: #f43f5e; }

        .status-badge { 
            padding: 2px 8px; 
            border-radius: 100px; 
            font-size: 8px; 
            font-weight: 900; 
            text-transform: uppercase;
        }
        .status-confirmé { background: #ecfdf5; color: #059669; }
        .status-validé { background: #eff6ff; color: #2563eb; }
        .status-soumis { background: #fffbeb; color: #d97706; }

        .footer { position: fixed; bottom: -10mm; width: 100%; font-size: 8px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo-box">
            <div class="logo-text">SGAFO</div>
        </div>
        <div class="report-meta">
            <h1>Bilan Stratégique Régional</h1>
            <p>Région : {{ $regions }} | Période : {{ $date }} | Généré par : {{ $user }}</p>
        </div>
        <div class="clear"></div>
    </div>

    <!-- KPIs Regionaux en Tableau -->
    <table class="kpi-table">
        <tr>
            <td>
                <span class="kpi-value">{{ $stats['attendance_rate'] }}%</span>
                <span class="kpi-label">Assiduité</span>
                <div class="kpi-sub">Moyenne régionale</div>
            </td>
            <td>
                <span class="kpi-value">{{ $stats['qcm_average'] }}%</span>
                <span class="kpi-label">Réussite QCM</span>
                <div class="kpi-sub">Score pédagogique</div>
            </td>
            <td>
                <span class="kpi-value">{{ $stats['total_formateurs'] }}</span>
                <span class="kpi-label">Formateurs</span>
                <div class="kpi-sub">Effectif actif</div>
            </td>
            <td>
                <span class="kpi-value">{{ $plans->count() }}</span>
                <span class="kpi-label">Plans</span>
                <div class="kpi-sub">Formations en cours</div>
            </td>
        </tr>
    </table>
    <div class="clear"></div>

    <div class="col-container">
        <!-- Performance par Institut -->
        <div class="col-left">
            <div class="section-header">Dynamisme des Instituts</div>
            <table>
                <thead>
                    <tr>
                        <th style="width: 50%;">Institut</th>
                        <th style="width: 20%;">Sessions</th>
                        <th style="width: 30%;">Assiduité</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($stats['par_institut'] as $inst)
                    <tr>
                        <td><strong>{{ $inst['nom'] }}</strong></td>
                        <td>{{ $inst['seances_count'] }} séances</td>
                        <td>
                            <span style="font-weight: bold; color: {{ $inst['attendance'] < 80 ? '#f43f5e' : '#1e293b' }}">
                                {{ $inst['attendance'] }}%
                            </span>
                            <div class="bar-container" style="height: 6px;">
                                <div class="bar-fill {{ $inst['attendance'] < 80 ? 'bg-rose' : 'bg-indigo' }}" style="width: {{ $inst['attendance'] }}%"></div>
                            </div>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <!-- Répartition par Secteur -->
        <div class="col-right">
            <div class="section-header">Répartition par Secteur</div>
            <table>
                <thead>
                    <tr>
                        <th>Secteur d'Activité</th>
                        <th style="text-align: right;">Volume de Plans</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($stats['par_secteur'] as $secteur)
                    <tr>
                        <td><strong>{{ $secteur->nom }}</strong></td>
                        <td style="text-align: right;">
                            <span style="background: #e0e7ff; color: #4338ca; padding: 2px 8px; border-radius: 5px; font-weight: bold;">
                                {{ $secteur->total }} plans
                            </span>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

            <div class="section-header" style="margin-top: 15px; border-left-color: #10b981;">Satisfaction (Feedback)</div>
            <table style="margin-bottom: 0;">
                @foreach($stats['satisfaction'] as $item)
                <tr>
                    <td style="width: 70%; border: 0; padding: 5px 10px;">{{ $item->categorie }}</td>
                    <td style="width: 30%; border: 0; padding: 5px 10px; text-align: right;">
                        <span style="font-weight: 900; color: #059669;">{{ number_format($item->average, 1) }} / 5</span>
                    </td>
                </tr>
                @endforeach
            </table>
        </div>
        <div class="clear"></div>
    </div>

    <!-- Liste Détaillée des Plans -->
    <div class="section-header">Registre des Formations Régionales</div>
    <table>
        <thead>
            <tr>
                <th style="width: 35%;">Thématique</th>
                <th style="width: 20%;">Établissement</th>
                <th style="width: 15%;">Statut</th>
                <th style="width: 15%;">Début</th>
                <th style="width: 15%;">Fin</th>
            </tr>
        </thead>
        <tbody>
            @foreach($plans as $plan)
            <tr>
                <td><strong>{{ $plan->entite->titre }}</strong></td>
                <td>{{ $plan->siteFormation->nom }}</td>
                <td><span class="status-badge status-{{ $plan->statut }}">{{ $plan->statut }}</span></td>
                <td>{{ \Carbon\Carbon::parse($plan->date_debut)->format('d/m/Y') }}</td>
                <td>{{ \Carbon\Carbon::parse($plan->date_fin)->format('d/m/Y') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        CONFIDENTIEL - Document Stratégique SGAFO - Office de la Formation Professionnelle et de la Promotion du Travail
    </div>
</body>
</html>
