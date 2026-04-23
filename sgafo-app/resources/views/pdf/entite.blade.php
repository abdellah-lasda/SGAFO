<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Fiche Descriptive - {{ $entite->titre }}</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #334155;
            line-height: 1.5;
            margin: 0;
            padding: 0;
        }
        .container {
            padding: 30px;
        }
        .header {
            border-bottom: 2px solid #2563eb;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .header table {
            width: 100%;
        }
        .logo-placeholder {
            font-size: 24px;
            font-weight: bold;
            color: #1e293b;
        }
        .doc-title {
            text-align: center;
            font-size: 18px;
            font-weight: 800;
            color: #1e293b;
            text-transform: uppercase;
            margin: 20px 0;
            background: #f8fafc;
            padding: 10px;
            border: 1px solid #e2e8f0;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            font-size: 12px;
            font-weight: 900;
            color: #2563eb;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-left: 4px solid #2563eb;
            padding-left: 10px;
            margin-bottom: 10px;
        }
        .info-grid {
            width: 100%;
            border-collapse: collapse;
        }
        .info-grid td {
            padding: 8px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 13px;
        }
        .label {
            font-weight: bold;
            color: #64748b;
            width: 30%;
        }
        .value {
            color: #1e293b;
            font-weight: 600;
        }
        .description-box {
            font-size: 13px;
            color: #334155;
            background: #fdfdfd;
            padding: 15px;
            border: 1px solid #f1f5f9;
            border-radius: 4px;
        }
        table.themes-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        table.themes-table th {
            background-color: #f8fafc;
            color: #64748b;
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            text-align: left;
            padding: 10px;
            border: 1px solid #e2e8f0;
        }
        table.themes-table td {
            padding: 10px;
            font-size: 12px;
            border: 1px solid #e2e8f0;
        }
        .total-row {
            background-color: #f8fafc;
            font-weight: bold;
        }
        .footer {
            position: fixed;
            bottom: 30px;
            width: 100%;
            text-align: center;
            font-size: 10px;
            color: #94a3b8;
            border-top: 1px solid #f1f5f9;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <table>
                <tr>
                    <td class="logo-placeholder">OFPPT</td>
                    <td style="text-align: right; font-size: 10px; color: #64748b;">
                        SGAFO - Système de Gestion de l'Offre<br>
                        Généré le : {{ date('d/m/Y H:i') }}
                    </td>
                </tr>
            </table>
        </div>

        <div class="doc-title">Fiche Descriptive de l'Entité de Formation</div>

        <div class="section">
            <div class="section-title">1. Identification</div>
            <table class="info-grid">
                <tr>
                    <td class="label">Intitulé</td>
                    <td class="value">{{ $entite->titre }}</td>
                </tr>
                <tr>
                    <td class="label">Secteur</td>
                    <td class="value">{{ $entite->secteur->nom ?? 'N/A' }}</td>
                </tr>
                <tr>
                    <td class="label">Type</td>
                    <td class="value">{{ ucfirst($entite->type) }}</td>
                </tr>
                <tr>
                    <td class="label">Mode de formation</td>
                    <td class="value">{{ ucfirst($entite->mode) }}</td>
                </tr>
            </table>
        </div>

        <div class="section">
            <div class="section-title">2. Description et Objectifs</div>
            <div class="description-box">
                <strong>Description :</strong><br>
                {{ $entite->description ?: 'Aucune description fournie.' }}
                <br><br>
                <strong>Objectifs pédagogiques globaux :</strong><br>
                {!! nl2br(e($entite->objectifs)) !!}
            </div>
        </div>

        <div class="section">
            <div class="section-title">3. Programme du parcours ({{ count($entite->themes) }} thèmes)</div>
            <table class="themes-table">
                <thead>
                    <tr>
                        <th style="width: 5%;">#</th>
                        <th style="width: 45%;">Titre du Thème</th>
                        <th style="width: 15%;">Durée</th>
                        <th style="width: 35%;">Objectifs spécifiques</th>
                    </tr>
                </thead>
                <tbody>
                    @php $totalHeures = 0; @endphp
                    @foreach($entite->themes as $index => $theme)
                        <tr>
                            <td>{{ $index + 1 }}</td>
                            <td style="font-weight: bold;">{{ $theme->titre }}</td>
                            <td>{{ number_format($theme->duree_heures, 1) }} H</td>
                            <td style="font-size: 11px; color: #64748b;">{{ $theme->objectifs }}</td>
                        </tr>
                        @php $totalHeures += $theme->duree_heures; @endphp
                    @endforeach
                    <tr class="total-row">
                        <td colspan="2" style="text-align: right; text-transform: uppercase;">Volume Horaire Total</td>
                        <td colspan="2">{{ number_format($totalHeures, 1) }} Heures</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="footer">
            Office de la Formation Professionnelle et de la Promotion du Travail - Document confidentiel généré par {{ auth()->user()->prenom }} {{ auth()->user()->nom }}
        </div>
    </div>
</body>
</html>
