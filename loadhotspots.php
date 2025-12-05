<?php
include 'includes/db.php';
$id = intval($_GET['id']);
$sql = $conn->prepare("SELECT * FROM corvanitas WHERE id=?");
$sql->execute([$id]);
$data = $sql->fetch(PDO::FETCH_ASSOC);
echo json_encode($data);
?>
