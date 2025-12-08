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

// Try to get id from various sources
$id = null;

// Check GET parameters first (most common for GET requests)
if (!empty($_GET['id'])) {
    $id = $_GET['id'];
} elseif (!empty($_GET['hotspot_id'])) {
    $id = $_GET['hotspot_id'];
}

// Check POST if GET didn't have it
if ($id === null && !empty($_POST['id'])) {
    $id = $_POST['id'];
} elseif ($id === null && !empty($_POST['hotspot_id'])) {
    $id = $_POST['hotspot_id'];
}

// Check JSON body
if ($id === null) {
    $raw = file_get_contents('php://input');
    if (!empty($raw)) {
        $json = json_decode($raw, true);
        if (!empty($json['id'])) {
            $id = $json['id'];
        } elseif (!empty($json['hotspot_id'])) {
            $id = $json['hotspot_id'];
        }
    }
}

try {
    // If id is provided, get single hotspot
    if ($id !== null && $id !== '') {
        $id = intval($id);
        $stmt = $pdo->prepare("SELECT * FROM hotspots WHERE hotspot_id = :id LIMIT 1");
        $stmt->execute([":id" => $id]);
        $hotspot = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$hotspot) {
            http_response_code(404);
            echo json_encode(["error" => "Hotspot not found"]);
            exit;
        }

        echo json_encode($hotspot);
    } else {
        // If no id, return all hotspots
        $stmt = $pdo->prepare("SELECT * FROM hotspots");
        $stmt->execute();
        $hotspots = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($hotspots);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
