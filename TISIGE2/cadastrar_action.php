<?php
require 'config.php';

$arquivo = filter_input(INPUT_POST, 'arquivo');
$os = filter_input(INPUT_POST, 'os');
$cliente = filter_input(INPUT_POST, 'cliente');
$equipamento = filter_input(INPUT_POST, 'equipamento');
$dtContratual = filter_input(INPUT_POST, 'dtContratual');
$dtRecebimento = filter_input(INPUT_POST, 'dtRecebimento');
$gaveta = filter_input(INPUT_POST, 'gaveta');
$dtRetirada = filter_input(INPUT_POST, 'dtRetirada');
$respRetirada = filter_input(INPUT_POST, 'respRetirada');
$setor = filter_input(INPUT_POST, 'setor');

$sql = $pdo->prepare("SELECT * FROM ControleLC WHERE os = :os");
$sql->bindValue(':os', $os);
$sql->execute();
if($sql->rowCount() === 0){
    $sql = $pdo ->prepare("INSERT INTO ControleLC (arquivo, os, cliente, equipamento, dtContratual, dtRecebimento, gaveta, dtRetirada, respRetirada, setor)
        VALUES (:arquivo, :os, :cliente, :equipamento, :dtContratual, :dtRecebimento, :gaveta, :dtRetirada, :respRetirada, :setor)");
    $sql->bindValue(':arquivo', $arquivo);
    $sql->bindValue(':os', $os);
    $sql->bindValue(':cliente', $cliente);
    $sql->bindValue(':equipamento', $equipamento);
    $sql->bindValue(':dtContratual', $dtContratual);
    $sql->bindValue(':dtRecebimento', $dtRecebimento);
    $sql->bindValue(':gaveta', $gaveta);
    $sql->bindValue(':dtRetirada', $dtRetirada);
    $sql->bindValue(':respRetirada', $respRetirada);
    $sql->bindValue(':setor', $setor);
    $sql->execute();
    
    header("Location: ControleLC.php");
}
// Else está tratando erro caso OS já estaja cadastrada, Puxa uma tela em html trantando o erro.
else{
    echo "
    <head>
    <meta charset='UTF-8'>
    <link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css'>
<style>
    * {
        margin: 0;
        border: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Poppins', sans-serif;
    }
    body {
    /* background: linear-gradient(45deg, #1bebf2, #1db9f2);*/
        background-color: #46849b ;
        background-repeat: no-repeat;
        /*Código para colocar imagem como background
        background-image: url(DataLogo.png);
        background-size: cover;
        */
        min-height: 100vh;
        min-width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
    }
    main.container{
        background-color: white;
        max-width: 350px;
        min-height: 50vh;
        padding: 2rem;
        box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        text-decoration: none;
    }
</style>
    <main class='container'>
        <center><h2>OS já cadastrada!</h2></center>
        <div class='login-button'>
        <br><br>
        <center><button><a href='ControleLC.php' class='btn btn-danger'>VOLTAR</a></button></center>
        </div>
    </main>";
}
?>