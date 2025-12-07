<?php
header('Content-Type: application/json');
include '../includes/db.php'; // adjust path if needed

try {
    $stmt = $pdo->query("SELECT * FROM hotspots ORDER BY frame_index, hotspot_id");
    $hotspots = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($hotspots);
} catch (PDOException $e) {
    echo json_encode([
        "error" => "Fout bij ophalen van hotspots: " . $e->getMessage()
    ]);
}
