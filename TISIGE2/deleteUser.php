<?php
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['delete_id'])) {
    $idUsuarioExcluir = $_GET['delete_id'];
    $sqlExcluirUsuario = "DELETE FROM users WHERE id = ?";
    $stmtExcluirUsuario = $pdo->prepare($sqlExcluirUsuario);
    $stmtExcluirUsuario->execute([$idUsuarioExcluir]);

    echo json_encode(['success' => true]);
    exit();
}
