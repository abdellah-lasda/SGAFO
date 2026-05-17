<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
    @page {
        size: a4 landscape;
        margin: 0;
    }
    body {
        font-family: 'Helvetica', 'Arial', sans-serif;
        background: #fff;
        margin: 0;
        padding: 0;
        width: 297mm;
        height: 210mm;
        box-sizing: border-box;
    }
    {!! $css_content ?? '' !!}
</style>
</head>
<body>
    {!! $html_content !!}
</body>
</html>
