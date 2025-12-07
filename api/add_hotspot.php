<?php
include 'includes/db.php';  // your database connection
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $frame_index = trim($_POST['frame_index']);
    $catalognummer = trim($_POST['catalognummer']);
    $beschrijving = trim($_POST['beschrijving']);
    $x = isset($_POST['x']) ? floatval($_POST['x']) : null;
    $y = isset($_POST['y']) ? floatval($_POST['y']) : null;
    $aanvulling = trim($_POST['aanvulling']);

    if ($frame_index !== '' && $catalognummer !== '') {
        try {
            $stmt = $pdo->prepare("INSERT INTO hotspots (frame_index, catalognummer, beschrijving, x, y, aanvulling) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$frame_index, $catalognummer, $beschrijving, $x, $y, $aanvulling]);

            $_SESSION['success_message'] = "Hotspot toegevoegd.";
            header("Location: hotspots_list.php");
            exit;

        } catch (PDOException $e) {
            $_SESSION['error_message'] = "Fout bij toevoegen: " . $e->getMessage();
        }
    } else {
        $_SESSION['error_message'] = "Vul minimaal frame_index en catalognummer in.";
    }
}
?>
<form method="post">
    <label>Frame Index:</label>
    <input type="number" name="frame_index" required>

    <label>Catalognummer:</label>
    <input type="text" name="catalognummer" required>

    <label>Beschrijving:</label>
    <textarea name="beschrijving"></textarea>

    <label>X (optioneel):</label>
    <input type="text" name="x">

    <label>Y (optioneel):</label>
    <input type="text" name="y">

    <label>Aanvulling:</label>
    <textarea name="aanvulling"></textarea>

    <button type="submit">Toevoegen</button>
</form>
