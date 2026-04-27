<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guide Intégral SGAFO - OFPPT</title>
    <style>
        @page {
            margin: 100px 50px;
        }
        header {
            position: fixed;
            top: -60px;
            left: 0;
            right: 0;
            height: 50px;
            border-bottom: 1px solid #eee;
            text-align: right;
            font-size: 10px;
            color: #999;
            font-family: sans-serif;
        }
        footer {
            position: fixed;
            bottom: -60px;
            left: 0;
            right: 0;
            height: 30px;
            text-align: center;
            font-size: 10px;
            color: #999;
            font-family: sans-serif;
        }
        .pagenum:before {
            content: counter(page);
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #333;
            line-height: 1.6;
        }
        .cover {
            text-align: center;
            padding-top: 150px;
            page-break-after: always;
        }
        .logo {
            width: 120px;
            margin-bottom: 40px;
        }
        .title {
            font-size: 48px;
            font-weight: 900;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        .subtitle {
            font-size: 24px;
            color: #2563eb;
            font-weight: bold;
            margin-bottom: 60px;
        }
        .institution {
            font-size: 14px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .chapter {
            page-break-before: always;
            padding-top: 20px;
        }
        h1 {
            font-size: 32px;
            font-weight: 900;
            color: #111;
            border-bottom: 4px solid #2563eb;
            padding-bottom: 10px;
            margin-bottom: 30px;
        }
        h2 {
            font-size: 20px;
            font-weight: bold;
            color: #111;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        .intro-text {
            font-size: 18px;
            color: #555;
            font-style: italic;
            border-left: 5px solid #2563eb;
            padding-left: 20px;
            margin-bottom: 40px;
        }
        .step-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
        }
        .step-num {
            display: inline-block;
            width: 25px;
            height: 25px;
            background: #111;
            color: #fff;
            border-radius: 5px;
            text-align: center;
            line-height: 25px;
            font-weight: bold;
            margin-right: 10px;
        }
        .section {
            margin-bottom: 40px;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #111;
            margin-bottom: 10px;
        }
        .section-content {
            font-size: 14px;
            color: #666;
        }
    </style>
</head>
<body>
    <header>SGAFO • Système de Gestion de la Formation Continue - OFPPT</header>
    <footer>Page <span className="pagenum"></span></footer>

    <div class="cover">
        <div class="institution">Office de la Formation Professionnelle et de la Promotion du Travail</div>
        <h1 class="title">SGAFO</h1>
        <div class="subtitle">Guide Intégral Utilisateur</div>
        <div style="margin-top: 100px;">
            <p>Version 1.0.5</p>
            <p>Avril 2026</p>
        </div>
    </div>

    @foreach($docs as $key => $section)
        <div class="chapter">
            <h1>{{ $section['title'] }}</h1>
            <p class="intro-text">"{{ $section['content'] }}"</p>

            @if(isset($section['steps']))
                @foreach($section['steps'] as $index => $step)
                    <div class="step-box">
                        <span class="step-num">{{ $index + 1 }}</span>
                        <strong>{{ $step }}</strong>
                    </div>
                @endforeach
            @endif

            @if(isset($section['sections']))
                @foreach($section['sections'] as $sec)
                    <div class="section">
                        <div class="section-title">{{ $sec['subtitle'] }}</div>
                        <div class="section-content">{{ $sec['text'] }}</div>
                    </div>
                @endforeach
            @endif
        </div>
    @endforeach

</body>
</html>
