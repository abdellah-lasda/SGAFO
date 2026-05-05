<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rapport Régional de Formation</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; font-size: 10px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1a56db; padding-bottom: 10px; }
        .header h1 { color: #1a56db; margin: 0; font-size: 18px; }
        .info { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { bg-color: #f3f4f6; font-weight: bold; }
        .footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 8px; color: #999; }
        .statut { font-weight: bold; text-transform: uppercase; font-size: 8px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Rapport Régional de Formation</h1>
        <p>Région(s) : {{ $regions }}</p>
    </div>

    <div class="info">
        <p>Généré le : {{ $date }}</p>
        <p>Par : {{ $user }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Formation</th>
                <th>Plan (Code)</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Lieu / Site</th>
                <th>Statut</th>
            </tr>
        </thead>
        <tbody>
            @foreach($plans as $plan)
            <tr>
                <td><strong>{{ $plan->entite?->titre }}</strong></td>
                <td>{{ $plan->titre }}</td>
                <td>{{ \Carbon\Carbon::parse($plan->date_debut)->format('d/m/Y') }}</td>
                <td>{{ \Carbon\Carbon::parse($plan->date_fin)->format('d/m/Y') }}</td>
                <td>{{ $plan->siteFormation?->nom ?? 'À distance' }}</td>
                <td class="statut">{{ $plan->statut }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Document généré automatiquement par SGAFO - Système de Gestion de l'Apprentissage et de la Formation
    </div>
</body>
</html>
