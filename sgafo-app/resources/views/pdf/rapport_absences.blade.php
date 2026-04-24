<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rapport d'Absences</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; font-size: 11px; color: #333; margin: 0; padding: 0; }
        .header { width: 100%; border-bottom: 3px solid #1a56db; padding-bottom: 15px; margin-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #1a56db; }
        .report-title { text-align: center; font-size: 18px; font-weight: bold; color: #d32f2f; margin: 20px 0; text-transform: uppercase; letter-spacing: 1px; }
        
        .stats-box { width: 100%; margin-bottom: 25px; border: 1px solid #ddd; background: #f8fafc; padding: 15px; border-radius: 8px; }
        .stat-item { width: 25%; float: left; text-align: center; }
        .stat-value { font-size: 14px; font-weight: bold; display: block; margin-top: 5px; }
        .stat-label { font-size: 9px; text-transform: uppercase; color: #64748b; font-weight: bold; }

        .section-title { font-size: 12px; font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-bottom: 10px; color: #1e293b; }

        table.absences { width: 100%; border-collapse: collapse; margin-top: 10px; }
        table.absences th { background: #1e293b; color: white; border: 1px solid #1e293b; padding: 10px; text-transform: uppercase; font-size: 9px; text-align: left; }
        table.absences td { border: 1px solid #e2e8f0; padding: 10px; vertical-align: top; }
        
        .badge { padding: 4px 8px; border-radius: 4px; font-size: 8px; font-weight: bold; text-transform: uppercase; }
        .badge-red { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
        .badge-green { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .badge-amber { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }

        .footer { margin-top: 60px; width: 100%; }
        .sig-box { width: 45%; float: right; border: 1px solid #e2e8f0; height: 120px; padding: 10px; background: #fff; text-align: center; }
        .sig-title { font-weight: bold; text-decoration: underline; margin-bottom: 40px; display: block; }
        
        .clear { clear: both; }
        .mt-4 { margin-top: 15px; }
    </style>
</head>
<body>

    <div class="header">
        <table width="100%">
            <tr>
                <td class="logo">OFPPT</td>
                <td align="right" style="color: #64748b; font-size: 10px;">
                    SGAFO | Direction de la Formation<br>
                    ID Séance: #SE-{{ $seance->id }}
                </td>
            </tr>
        </table>
    </div>

    <div class="report-title">Rapport de Carence et d'Absentéisme</div>

    <div class="stats-box">
        <div class="stat-item">
            <span class="stat-label">Total Participants</span>
            <span class="stat-value">{{ $stats['total'] }}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Absences / Retards</span>
            <span class="stat-value" style="color: #d32f2f;">{{ $stats['absents'] }}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Taux d'Absence</span>
            <span class="stat-value">{{ $stats['rate'] }}%</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Injustifiées</span>
            <span class="stat-value" style="color: #d32f2f;">{{ $stats['unjustified'] }}</span>
        </div>
        <div class="clear"></div>
    </div>

    <div class="section-title">Informations sur la Séance</div>
    <table width="100%" style="margin-bottom: 25px;">
        <tr>
            <td width="120" style="font-weight: bold;">Formation :</td>
            <td>{{ $seance->plan->titre }}</td>
            <td width="100" style="font-weight: bold;">Date :</td>
            <td>{{ \Carbon\Carbon::parse($seance->date)->format('d/m/Y') }}</td>
        </tr>
        <tr>
            <td style="font-weight: bold;">Module(s) :</td>
            <td>
                @foreach($seance->themes as $theme)
                    {{ $theme->nom }}{{ !$loop->last ? ', ' : '' }}
                @endforeach
            </td>
            <td style="font-weight: bold;">Animateur :</td>
            <td>{{ $animateur->prenom }} {{ $animateur->nom }}</td>
        </tr>
        <tr>
            <td style="font-weight: bold;">Lieu :</td>
            <td>{{ $seance->site->nom ?? 'Plateforme Visio' }}</td>
            <td style="font-weight: bold;">Horaires :</td>
            <td>{{ substr($seance->debut, 0, 5) }} - {{ substr($seance->fin, 0, 5) }}</td>
        </tr>
    </table>

    <div class="section-title">Liste des Participants Absents ou en Retard</div>
    <table class="absences">
        <thead>
            <tr>
                <th width="150">Nom & Prénom</th>
                <th width="100">Type</th>
                <th width="80">Justification</th>
                <th>Motif / Observations</th>
            </tr>
        </thead>
        <tbody>
            @forelse($seance->presences as $presence)
            <tr>
                <td>
                    <strong>{{ $presence->participant->prenom }} {{ $presence->participant->nom }}</strong><br>
                    <small style="color: #64748b;">{{ $presence->participant->instituts[0]->nom ?? 'OFPPT' }}</small>
                </td>
                <td>
                    @if($presence->statut === 'absent')
                        <span class="badge badge-red">ABSENCE TOTALE</span>
                    @else
                        <span class="badge badge-amber">RETARD</span>
                    @endif
                </td>
                <td align="center">
                    @if($presence->est_justifie)
                        <span class="badge badge-green">OUI</span>
                    @else
                        <span class="badge badge-red">NON</span>
                    @endif
                </td>
                <td>
                    {{ $presence->motif ?: 'Aucune observation fournie.' }}
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="4" align="center" style="padding: 30px; color: #64748b; font-style: italic;">
                    Aucune absence ou retard n'a été signalé lors de cette séance.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <div class="sig-box">
            <span class="sig-title">Cachet et Signature de l'Animateur</span>
        </div>
        <div class="clear"></div>
    </div>
    <div style="margin-top: 20px; text-align: center; color: #999; font-size: 9px;">
        Généré le {{ now()->format('d/m/Y H:i') }} par le portail SGAFO
    </div>

</body>
</html>
