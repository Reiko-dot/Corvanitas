<?php
header("Content-Type: application/json");
require_once __DIR__ . "/../includes/db.php";

// Manually parse query string from REQUEST_URI if QUERY_STRING is empty
if (empty($_GET) && empty($_SERVER['QUERY_STRING']) && !empty($_SERVER['REQUEST_URI'])) {
    $uri = $_SERVER['REQUEST_URI'];
    if (strpos($uri, '?') !== false) {
        $query = substr($uri, strpos($uri, '?') + 1);
        parse_str($query, $_GET);
    }
} elseif (empty($_GET) && !empty($_SERVER['QUERY_STRING'])) {
    parse_str($_SERVER['QUERY_STRING'], $_GET);
}

// Try to get id from various sources (use isset so '0' is accepted)
$id = null;
if (isset($_GET['id'])) {
    $id = $_GET['id'];
} elseif (isset($_GET['hotspot_id'])) {
    $id = $_GET['hotspot_id'];
} elseif (isset($_POST['id'])) {
    $id = $_POST['id'];
} elseif (isset($_POST['hotspot_id'])) {
    $id = $_POST['hotspot_id'];
} else {
    $raw = file_get_contents('php://input');
    if (!empty($raw)) {
        $json = json_decode($raw, true);
        if (isset($json['id'])) {
            $id = $json['id'];
        } elseif (isset($json['hotspot_id'])) {
            $id = $json['hotspot_id'];
        }
    }
}

if (!isset($id) || $id === '') {
    http_response_code(400);
    echo json_encode(["error" => "Missing hotspot id"]);
    exit;
}

$id = intval($id);

try {
    // Check exists
    $check = $pdo->prepare("SELECT COUNT(*) FROM hotspots WHERE hotspot_id = :id");
    $check->execute([":id" => $id]);
    $count = (int)$check->fetchColumn();
    if ($count === 0) {
        http_response_code(404);
        echo json_encode(["error" => "Hotspot not found or already deleted", "hotspot_id" => $id]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM hotspots WHERE hotspot_id = :id");
    $stmt->execute([":id" => $id]);
    $rows = $stmt->rowCount();

    echo json_encode(["success" => true, "hotspot_id" => $id, "deleted_rows" => $rows]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
