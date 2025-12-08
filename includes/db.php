<?php
$host = "localhost";    // usually always this
$dbname = "corvanitas"; // your database name
$username = "root";     // default for local servers
$password = "";         // empty for XAMPP/MAMP/WAMP usually

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // echo "Connected successfully"; 
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>
