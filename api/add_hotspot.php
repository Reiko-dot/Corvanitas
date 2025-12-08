<?php
header("Content-Type: application/json");
require_once "../db.php";

// Required fields check
$required = ["frame_index", "catalognummer", "x", "y"];
foreach ($required as $field) {
    if (!isset($_POST[$field]) || $_POST[$field] === "") {
        echo json_encode(["error" => "Missing field: $field"]);
        exit;
    }
}

$frame_index   = intval($_POST["frame_index"]);
$catalognummer = trim($_POST["catalognummer"]);
$beschrijving  = isset($_POST["beschrijving"]) ? trim($_POST["beschrijving"]) : "";
$aanvulling    = isset($_POST["aanvulling"]) ? trim($_POST["aanvulling"]) : "";

$x = floatval($_POST["x"]);  // stored relative to panoramaGroup.left
$y = floatval($_POST["y"]);  // stored relative to panoramaGroup.top

try {
    $stmt = $pdo->prepare("
        INSERT INTO hotspots 
            (frame_index, catalognummer, beschrijving, aanvulling, x, y)
        VALUES 
            (:frame_index, :catalognummer, :beschrijving, :aanvulling, :x, :y)
    ");

    $stmt->execute([
        ":frame_index"   => $frame_index,
        ":catalognummer" => $catalognummer,
        ":beschrijving"  => $beschrijving,
        ":aanvulling"    => $aanvulling,
        ":x"             => $x,
        ":y"             => $y
    ]);

    $newId = $pdo->lastInsertId();

    echo json_encode([
        "success" => true,
        "hotspot_id" => (int)$newId
    ]);

} catch (Exception $e) {
    echo json_encode([
        "error" => "Database error: " . $e->getMessage()
    ]);
}
?>
