<?php
header('Content-Type: application/json');


require "includes/db.php"; 

try {
    $stmt = $pdo->query("
        SELECT hotspot_id, frame_index, catalognummer, beschrijving, aanvulling, x, y 
        FROM hotspots 
        ORDER BY hotspot_id ASC
    ");
    $hotspots = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($hotspots as &$h) {
        $h['hotspot_id']  = (int)$h['hotspot_id'];
        $h['frame_index'] = (int)$h['frame_index'];
        $h['x']           = (float)$h['x'];
        $h['y']           = (float)$h['y'];
    }

    echo json_encode($hotspots, JSON_NUMERIC_CHECK);
    exit;
} catch (Exception $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    exit;
}
