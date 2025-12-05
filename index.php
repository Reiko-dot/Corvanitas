<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Panorama Viewer</title>
<link rel="stylesheet" href="css/style.css">
</head>
<body>

<header>
    <img src="images/HUA logo.png" alt="HUA Logo" class="logo">
</header>

<div class="canvas-wrapper">
    <canvas id="panoramaCanvas"></canvas>
</div>

<!-- Colofon sliding panel -->
<div id="colofon">
    <button id="close-colofon">&times;</button>
    <div id="colofon-content">
    </div>
</div>

<!-- Progress bar -->
<div id="progress-bar">
    <div id="progress-fill"></div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.2.4/fabric.min.js"></script>
<script src="script.js"></script>
</body>
</html>
