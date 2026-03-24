<?php
session_start();
require 'config.php';

$os = filter_input(INPUT_POST, 'os');
$arquivo = filter_input(INPUT_POST, 'arquivo');
$cliente = filter_input(INPUT_POST, 'cliente');
$equipamento = filter_input(INPUT_POST, 'equipamento');
$dtContratual = filter_input(INPUT_POST, 'dtContratual');
$dtRecebimento = filter_input(INPUT_POST, 'dtRecebimento');
$dtRetirada = filter_input(INPUT_POST, 'dtRetirada');
$respRetirada = filter_input(INPUT_POST, 'respRetirada');
$setor = filter_input(INPUT_POST, 'setor');

$nomeUsuario = isset($_SESSION['user']) ? $_SESSION['user'] : 'Nome de Usuário Desconhecido';

if ($os) {
    $sqlDadosAntigos = $pdo->prepare("SELECT * FROM ControleLC WHERE os = :os");
    $sqlDadosAntigos->bindValue(':os', $os);
    $sqlDadosAntigos->execute();
    $dadosAntigos = $sqlDadosAntigos->fetch(PDO::FETCH_ASSOC);

    $sqlAtualizacao = $pdo->prepare("UPDATE ControleLC SET os = :os, arquivo = :arquivo, cliente =:cliente, equipamento = :equipamento, dtContratual = :dtContratual,
    dtRecebimento = :dtRecebimento, dtRetirada = :dtRetirada, respRetirada = :respRetirada, setor = :setor WHERE os = :os");
    $sqlAtualizacao->bindValue(':arquivo', $arquivo);
    $sqlAtualizacao->bindValue(':os', $os);
    $sqlAtualizacao->bindValue(':cliente', $cliente);
    $sqlAtualizacao->bindValue(':equipamento', $equipamento);
    $sqlAtualizacao->bindValue(':dtContratual', $dtContratual);
    $sqlAtualizacao->bindValue(':dtRecebimento', $dtRecebimento);
    $sqlAtualizacao->bindValue(':dtRetirada', $dtRetirada);
    $sqlAtualizacao->bindValue(':respRetirada', $respRetirada);
    $sqlAtualizacao->bindValue(':setor', $setor);
    $sqlAtualizacao->execute();

    $sqlRegistroOperacao = $pdo->prepare("INSERT INTO registros_operacoes (id_usuario, tipo_operacao, os_afetada) VALUES (?, 'Edição', ?)");
    $sqlRegistroOperacao->execute([$nomeUsuario, $os]);

    header("Location: ControleLC.php");
    exit;
} else {
    echo "Error!";
}
?>
