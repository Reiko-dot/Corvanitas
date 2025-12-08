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

// Get parameters from POST, GET, or JSON body
$frame = null;
$x = null;
$y = null;

// Try POST first
if (isset($_POST['frame_index'])) {
    $frame = $_POST['frame_index'];
    $x = $_POST['x'] ?? null;
    $y = $_POST['y'] ?? null;
}
// Then try GET (for quick testing)
elseif (isset($_GET['frame_index'])) {
    $frame = $_GET['frame_index'];
    $x = $_GET['x'] ?? null;
    $y = $_GET['y'] ?? null;
}
// Finally try JSON body
else {
    $raw = file_get_contents('php://input');
    if (!empty($raw)) {
        $json = json_decode($raw, true);
        if (isset($json['frame_index'])) {
            $frame = $json['frame_index'];
            $x = $json['x'] ?? null;
            $y = $json['y'] ?? null;
        }
    }
}

if ($frame === null || $x === null || $y === null || $frame === '' || $x === '' || $y === '') {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields: frame_index, x, y"]);
    exit;
}

$catalog = trim((string)($_POST['catalognummer'] ?? $_GET['catalognummer'] ?? ''));
$besch = trim((string)($_POST['beschrijving'] ?? $_GET['beschrijving'] ?? ''));
$aanv = trim((string)($_POST['aanvulling'] ?? $_GET['aanvulling'] ?? ''));

// validate required fields more strictly
if ($catalog === '') {
    http_response_code(400);
    echo json_encode(["error" => "Missing required field: catalognummer"]);
    exit;
}

if (!is_numeric($frame) || !is_numeric($x) || !is_numeric($y)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid coordinates or frame_index; must be numeric"]);
    exit;
}

$frame = intval($frame);
$x = floatval($x);
$y = floatval($y);

try {
    $stmt = $pdo->prepare(
        "INSERT INTO hotspots (frame_index, catalognummer, beschrijving, aanvulling, x, y)\n        VALUES (:frame, :cat, :besch, :aanv, :x, :y)"
    );

    $stmt->execute([
        ":frame" => $frame,
        ":cat"   => $catalog,
        ":besch" => $besch,
        ":aanv"  => $aanv,
        ":x"     => $x,
        ":y"     => $y
    ]);

    $last = $pdo->lastInsertId();
    echo json_encode(["success" => true, "id" => $last, "hotspot_id" => $last]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
