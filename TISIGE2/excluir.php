<?php
require 'config.php';

session_start(); 

$os = filter_input(INPUT_GET, 'os');

if ($os) {
    $sqlSelect = $pdo->prepare("SELECT * FROM ControleLC WHERE os = :os");
    $sqlSelect->bindValue(':os', $os);
    $sqlSelect->execute();

    $dadosExcluidos = $sqlSelect->fetch(PDO::FETCH_ASSOC);

    $sqlDelete = $pdo->prepare("DELETE FROM ControleLC WHERE os = :os");
    $sqlDelete->bindValue(':os', $os);
    $sqlDelete->execute();

    $sqlLog = $pdo->prepare("INSERT INTO registros_operacoes (id_usuario, tipo_operacao, os_afetada, dados_afetados) VALUES (?, 'Exclusão', ?, ?)");
    
    $usuario = isset($_SESSION['user']) ? $_SESSION['user'] : 'Desconhecido';

    $sqlLog->execute([$usuario, $os, json_encode($dadosExcluidos)]);
}

header("Location: ControleLC.php");
?>
