<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Feuille de Présence Manuelle</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; font-size: 11px; color: #333; margin: 0; padding: 0; }
        .header { width: 100%; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
        .logo { font-size: 20px; font-weight: bold; color: #1a56db; }
        .title { text-align: center; font-size: 16px; font-weight: bold; margin: 15px 0; text-transform: uppercase; }
        
        .info-grid { width: 100%; margin-bottom: 20px; border: 1px solid #ddd; padding: 10px; }
        .info-grid td { padding: 4px; }
        .label { font-weight: bold; width: 120px; }

        table.presence { width: 100%; border-collapse: collapse; margin-top: 10px; }
        table.presence th { background: #f2f2f2; border: 1px solid #000; padding: 8px; text-transform: uppercase; font-size: 9px; }
        table.presence td { border: 1px solid #000; padding: 8px; }
        
        .check-box { width: 40px; text-align: center; font-size: 8px; color: #ccc; }
        .check-box div { width: 15px; height: 15px; border: 1px solid #000; margin: 0 auto; }

        .footer { margin-top: 50px; width: 100%; }
        .footer-col { width: 45%; float: left; border: 1px solid #000; height: 100px; padding: 10px; }
        .footer-col-right { float: right; }
        .footer-title { font-weight: bold; text-decoration: underline; margin-bottom: 10px; display: block; }
        
        .clear { clear: both; }
        .page-break { page-break-after: always; }
    </style>
</head>
<body>

    <div class="header">
        <table width="100%">
            <tr>
                <td class="logo">OFPPT</td>
                <td align="right" style="color: #666;">SGAFO - Système de Gestion de Formation</td>
            </tr>
        </table>
    </div>

    <div class="title">Feuille d'Émargement Manuelle</div>

    <div class="info-grid">
        <table width="100%">
            <tr>
                <td class="label">Formation :</td>
                <td>{{ $seance->plan->titre }}</td>
                <td class="label">Date :</td>
                <td>{{ \Carbon\Carbon::parse($seance->date)->format('d/m/Y') }}</td>
            </tr>
            <tr>
                <td class="label">Module/Thème :</td>
                <td>
                    @foreach($seance->themes as $theme)
                        {{ $theme->nom }}{{ !$loop->last ? ', ' : '' }}
                    @endforeach
                </td>
                <td class="label">Horaires :</td>
                <td>{{ substr($seance->debut, 0, 5) }} - {{ substr($seance->fin, 0, 5) }}</td>
            </tr>
            <tr>
                <td class="label">Formateur :</td>
                <td>{{ $animateur->prenom }} {{ $animateur->nom }}</td>
                <td class="label">Lieu :</td>
                <td>{{ $seance->site->nom ?? 'Non défini' }}</td>
            </tr>
        </table>
    </div>

    <table class="presence">
        <thead>
            <tr>
                <th width="30">N°</th>
                <th>Nom & Prénom</th>
                <th width="120">Institut d'Origine</th>
                <th width="60">ENTRÉE</th>
                <th width="60">SORTIE</th>
                <th width="150">OBSERVATIONS</th>
            </tr>
        </thead>
        <tbody>
            @foreach($participants as $idx => $p)
            <tr>
                <td align="center">{{ $idx + 1 }}</td>
                <td><strong>{{ $p->prenom }} {{ $p->nom }}</strong></td>
                <td>{{ $p->instituts[0]->nom ?? '—' }}</td>
                <td class="check-box">
                    <div></div>
                </td>
                <td class="check-box">
                    <div></div>
                </td>
                <td></td>
            </tr>
            @endforeach
            
            {{-- Ajouter quelques lignes vides pour les imprévus --}}
            @for($i = 0; $i < 3; $i++)
            <tr>
                <td align="center">{{ count($participants) + $i + 1 }}</td>
                <td></td>
                <td></td>
                <td class="check-box"><div></div></td>
                <td class="check-box"><div></div></td>
                <td></td>
            </tr>
            @endfor
        </tbody>
    </table>

    <div class="footer">
        <div class="footer-col">
            <span class="footer-title">Signature du Formateur :</span>
        </div>
        <div class="footer-col footer-col-right">
            <span class="footer-title">Cachet de l'Établissement :</span>
        </div>
        <div class="clear"></div>
    </div>

    <div style="margin-top: 20px; text-align: center; color: #999; font-size: 9px;">
        Généré le {{ now()->format('d/m/Y H:i') }} par le portail SGAFO
    </div>

</body>
</html>
