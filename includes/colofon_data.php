<?php
// Database connection
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "corvanitas";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);

// Fetch hotspot data
$sql = "SELECT id, hotspot_x, hotspot_y, catalogusnummer, beschrijving, `extra_fotos` FROM panorama_pages ORDER BY id ASC";
$result = $conn->query($sql);

$hotspots = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $hotspots[] = $row;
    }
}

$conn->close();
?>
