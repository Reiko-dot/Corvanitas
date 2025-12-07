<?php
include '../includes/db.php';
session_start();

if (!isset($_GET['id'])) {
    echo "Geen hotspot ID opgegeven.";
    exit;
}

$id = intval($_GET['id']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $catalognummer = trim($_POST['catalognummer']);
    $beschrijving = trim($_POST['beschrijving']);
    $x = isset($_POST['x']) ? floatval($_POST['x']) : null;
    $y = isset($_POST['y']) ? floatval($_POST['y']) : null;
    $aanvulling = trim($_POST['aanvulling']);

    if ($catalognummer !== '') {
        try {
            $stmt = $pdo->prepare("UPDATE hotspots SET catalognummer = ?, beschrijving = ?, x = ?, y = ?, aanvulling = ? WHERE hotspot_id = ?");
            $stmt->execute([$catalognummer, $beschrijving, $x, $y, $aanvulling, $id]);

            $_SESSION['success_message'] = "Hotspot bijgewerkt.";
            header("Location: ../index.php"); // redirect to main page
            exit;
        } catch (PDOException $e) {
            $_SESSION['error_message'] = "Fout bij bijwerken: " . $e->getMessage();
        }
    } else {
        $_SESSION['error_message'] = "Catalognummer is verplicht.";
    }
}

// Haal de hotspot op om te tonen in het formulier
$stmt = $pdo->prepare("SELECT * FROM hotspots WHERE hotspot_id = ?");
$stmt->execute([$id]);
$hotspot = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$hotspot) {
    echo "Hotspot niet gevonden.";
    exit;
}
?>

<form method="post">
    <label>Catalognummer:</label>
    <input type="text" name="catalognummer" value="<?= htmlspecialchars($hotspot['catalognummer']) ?>" required>

    <label>Beschrijving:</label>
    <textarea name="beschrijving"><?= htmlspecialchars($hotspot['beschrijving']) ?></textarea>

    <label>X (optioneel):</label>
    <input type="text" name="x" value="<?= htmlspecialchars($hotspot['x']) ?>">

    <label>Y (optioneel):</label>
    <input type="text" name="y" value="<?= htmlspecialchars($hotspot['y']) ?>">

    <label>Aanvulling:</label>
    <textarea name="aanvulling"><?= htmlspecialchars($hotspot['aanvulling']) ?></textarea>

    <button type="submit">Opslaan</button>
</form>


<style>
body {
    font-family: Arial, sans-serif;
    background: #f9f9f9;
    padding: 40px;
}
form {
    max-width: 500px;
    margin: auto;
    background: #fff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
label {
    font-weight: bold;
    display: block;
    margin-top: 15px;
}
input, textarea {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 6px;
    box-sizing: border-box;
}
button {
    background: #3498db;
    color: #fff;
    padding: 10px;
    margin-top: 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    width: 100%;
}
button:hover {
    background: #2980b9;
}
</style>

