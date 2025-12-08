<?php
header('Content-Type: application/json');
require_once "../includes/db.php"; // adjust path correctly

if (!isset($_GET["id"])) {
    echo json_encode(["error" => "Missing hotspot id"]);
    exit;
}

$id = intval($_GET["id"]);

try {
    $stmt = $pdo->prepare("
        SELECT hotspot_id, frame_index, catalognummer, beschrijving, aanvulling, x, y
        FROM hotspots
        WHERE hotspot_id = :id
        LIMIT 1
    ");
    $stmt->execute([":id" => $id]);
    $hotspot = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$hotspot) {
        echo json_encode(["error" => "Hotspot not found"]);
        exit;
    }

    // Make sure numeric fields are correct
    $hotspot['hotspot_id'] = (int)$hotspot['hotspot_id'];
    $hotspot['frame_index'] = (int)$hotspot['frame_index'];
    $hotspot['x'] = (float)$hotspot['x'];
    $hotspot['y'] = (float)$hotspot['y'];

    echo json_encode($hotspot, JSON_NUMERIC_CHECK);
    exit;
} catch (Exception $e) {
    echo json_encode(["error" => "Database error: ".$e->getMessage()]);
    exit;
}
?>
