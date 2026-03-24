<?php
$host = "localhost";
$db = "ControleLc";
$user = "root";
$pass = "";

$mysqli = new mysqli($host, $user, $pass, $db);
if($mysqli->connect_errno) {
    die("Falha na conexão com o banco de dados");
}
if(isset($_GET['busca']) && !empty($_GET['busca'])) {
    $busca = $_GET['busca'];
    $sql = "SELECT * FROM sua_tabela WHERE os LIKE '%$busca%' OR cliente LIKE '%$busca%' OR equipamento LIKE '%$busca%' OR respRetirada LIKE '%$busca%' OR setor LIKE '%$busca%'";
}
?>