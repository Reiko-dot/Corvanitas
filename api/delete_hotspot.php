<?php
include 'includes/db.php';
session_start();

if (!isset($_GET['id'])) {
    echo "Geen hotspot ID opgegeven.";
    exit;
}

$id = intval($_GET['id']);

try {
    $stmt = $pdo->prepare("DELETE FROM hotspots WHERE hotspot_id = ?");
    $stmt->execute([$id]);

    $_SESSION['success_message'] = "Hotspot verwijderd.";
    header("Location: index.php");
    exit;
} catch (PDOException $e) {
    echo "Fout bij verwijderen: " . $e->getMessage();
}
?>
