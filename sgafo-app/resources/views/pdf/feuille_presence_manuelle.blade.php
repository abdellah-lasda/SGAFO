<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Feuille de Présence Manuelle</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; font-size: 11px; color: #111; margin: 0; padding: 0; }
        .header { width: 100%; border-bottom: 1.5px solid #000; padding-bottom: 8px; margin-bottom: 15px; }
        .title { text-align: center; font-size: 14px; font-weight: bold; margin: 15px 0; text-transform: uppercase; text-decoration: underline; letter-spacing: 1px; }
        
        .info-grid { width: 100%; margin-bottom: 20px; }
        .info-grid table { width: 100%; border-collapse: collapse; }
        .info-grid td { border: 1px solid #000; padding: 6px 8px; font-size: 10px; vertical-align: middle; }
        .info-grid .label { font-weight: bold; background-color: #f5f5f5; width: 12%; }
        .info-grid .value { width: 38%; }

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
        <table width="100%" style="border-collapse: collapse;">
            <tr>
                <td width="20%" style="vertical-align: middle; padding: 0;">
                    <img src="{{ public_path('logoofppt.jfif') }}" style="height: 55px; max-width: 150px; display: block;">
                </td>
                <td width="80%" align="right" style="vertical-align: middle; text-align: right; padding: 0; line-height: 1.4;">
                    <div style="font-family: 'DejaVu Sans', sans-serif; font-size: 13px; font-weight: bold; color: #000;">مكتب التكوين المهني وإنعاش الشغل</div>
                    <div style="font-size: 10px; font-weight: bold; color: #222; margin-top: 2px;">Office de la Formation Professionnelle et de la Promotion du Travail</div>
                </td>
            </tr>
        </table>
    </div>

    <div class="title">FEUILLE DE PRESENCE</div>

    <div class="info-grid">
        <table>
            <tr>
                <td class="label">Thème</td>
                <td class="value">
                    @foreach($seance->themes as $theme)
                        {{ $theme->nom }}{{ !$loop->last ? ', ' : '' }}
                    @endforeach
                </td>
                <td class="label">Animateur</td>
                <td class="value">{{ $animateur->prenom }} {{ $animateur->nom }}</td>
            </tr>
            <tr>
                <td class="label">Date</td>
                <td class="value">{{ \Carbon\Carbon::parse($seance->date)->format('d/m/Y') }} @if($seance->debut && $seance->fin) ({{ substr($seance->debut, 0, 5) }} - {{ substr($seance->fin, 0, 5) }}) @endif</td>
                <td class="label">Lieu</td>
                <td class="value">{{ $seance->site->nom ?? 'Non défini' }}</td>
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
