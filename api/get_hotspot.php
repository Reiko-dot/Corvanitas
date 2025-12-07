<?php
header('Content-Type: application/json');
include '../includes/db.php'; // adjust path if needed

if (!isset($_GET['id'])) {
    echo json_encode(["error" => "Geen hotspot ID opgegeven."]);
    exit;
}

$id = intval($_GET['id']);

try {
    $stmt = $pdo->prepare("SELECT * FROM hotspots WHERE hotspot_id = ?");
    $stmt->execute([$id]);
    $hotspot = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$hotspot) {
        echo json_encode(["error" => "Hotspot niet gevonden."]);
        exit;
    }

    echo json_encode($hotspot);
} catch (PDOException $e) {
    echo json_encode(["error" => "Fout bij ophalen: " . $e->getMessage()]);
}
