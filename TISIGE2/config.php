<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

$db_name = 'ControleLc';
$db_host = 'localhost:3306';
$db_user = 'root';
$db_password = '';

$pdo = new PDO("mysql:dbname=".$db_name.";host=".$db_host, $db_user, $db_password);

if (isset($_SESSION['user'])) {
    $sqlTipoUsuario = $pdo->prepare("SELECT tipo FROM users WHERE username = ?");
    $sqlTipoUsuario->execute([$_SESSION['user']]);
    $tipoUsuario = $sqlTipoUsuario->fetchColumn();
    $_SESSION['tipo_usuario'] = $tipoUsuario;
}
?>
