<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>start</title>
    <link rel="stylesheet" href="css/start-page.css">

</head>

<body>

 <!-- Marquee Containers -->
<div class="auto-move-container">
    <div class="images-marquee" id="marquee1">
        <img src="images/X12725 - 135002 (1).jpg" alt="Image 1">
        <img src="images/X12726 - 135003.jpg" alt="Image 2">
        <img src="images/X12727 - 135004.jpg" alt="Image 3">
        <img src="images/X12728 - 135005.jpg" alt="Image 4">
    </div>
</div>

<div class="auto-move-container">
    <div class="images-marquee" id="marquee2">
        <img src="images/X12725 - 135002 (1).jpg" alt="Image 1">
        <img src="images/X12726 - 135003.jpg" alt="Image 2">
        <img src="images/X12727 - 135004.jpg" alt="Image 3">
        <img src="images/X12728 - 135005.jpg" alt="Image 4">
    </div>
</div>

<div class="auto-move-container">
    <div class="images-marquee" id="marquee3">
        <img src="images/X12725 - 135002 (1).jpg" alt="Image 1">
        <img src="images/X12726 - 135003.jpg" alt="Image 2">
        <img src="images/X12727 - 135004.jpg" alt="Image 3">
        <img src="images/X12728 - 135005.jpg" alt="Image 4">
    </div>
</div>

<div class="auto-move-container">
    <div class="images-marquee" id="marquee4">
        <img src="images/X12725 - 135002 (1).jpg" alt="Image 1">
        <img src="images/X12726 - 135003.jpg" alt="Image 2">
        <img src="images/X12727 - 135004.jpg" alt="Image 3">
        <img src="images/X12728 - 135005.jpg" alt="Image 4">
    </div>
</div>

<div class="auto-move-container">
    <div class="images-marquee" id="marquee5">
        <img src="images/X12725 - 135002 (1).jpg" alt="Image 1">
        <img src="images/X12726 - 135003.jpg" alt="Image 2">
        <img src="images/X12727 - 135004.jpg" alt="Image 3">
        <img src="images/X12728 - 135005.jpg" alt="Image 4">
    </div>
</div>

<div class="overlay-content">
    <h1>Panorama van Utrecht</h1>
    <a href="short-info.php"><button>Start</button></a>
</div>




<script>
 const marquees = [
    { id: 'marquee1', speed: 1.2, direction: 'left' },
    { id: 'marquee2', speed: 1.2, direction: 'right' },
    { id: 'marquee3', speed: 1.4, direction: 'left' },
    { id: 'marquee4', speed: 1.6, direction: 'right' },
    { id: 'marquee5', speed: 0.8, direction: 'left' },
];

marquees.forEach(m => {
    const marquee = document.getElementById(m.id);
    const containerWidth = marquee.parentElement.offsetWidth;

    // Duplicate content until total width >= containerWidth * 2
    let totalWidth = marquee.scrollWidth;
    while (totalWidth < containerWidth * 2) {
        marquee.innerHTML += marquee.innerHTML;
        totalWidth = marquee.scrollWidth;
    }

    // For right-scrolling, start at -halfWidth; left starts at 0
    let x = (m.direction === 'right') ? -totalWidth / 2 : 0;

    function animate() {
        if (m.direction === 'left') {
            x -= m.speed;
            if (Math.abs(x) >= totalWidth / 2) x = 0;
        } else { // right
            x += m.speed;
            if (x >= 0) x = -totalWidth / 2;
        }

        marquee.style.transform = `translateX(${x}px)`;
        requestAnimationFrame(animate);
    }

    animate();
});




</script>


</body>

</html>