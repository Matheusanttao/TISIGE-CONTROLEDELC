<?php
require 'config.php';

if ($_SESSION['tipo_usuario'] === 'B') {
    header("Location: Semacesso.php");
    exit();
}elseif ($_SESSION['tipo_usuario'] === 'A') {
    header("Location: Semacesso.php");
    exit();
}
if (empty($_SESSION['user'])) {
    header("Location: LogIndex.php");
    exit();
}
$nomeUsuario = $_SESSION['user'];
$filtro = isset($_GET['busca']) ? " WHERE termo_pesquisa LIKE :busca" : "";
$sqlPesquisas = "SELECT * FROM pesquisas" . $filtro;

$sqlPesquisas .= " ORDER BY data_pesquisa DESC";

$stmt = $pdo->prepare($sqlPesquisas);

if (isset($_GET['busca'])) {
    $busca = '%' . $_GET['busca'] . '%';
    $stmt->bindParam(':busca', $busca, PDO::PARAM_STR);
}

$stmt->execute();

$pesquisas = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="style.css">
    <title>Histórico de Edições e Exclusões</title>
</head>
<style>
     body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 0;
    }

    header {
        background-color: #333;
        color: white;
        text-align: center;
        padding: 10px;
    }

    main {
        margin: 20px;
        margin-bottom: 200px;
    }

    h2 {
        color: #333;
        margin-top: 20px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    th, td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }

    th {
        background-color: #333;
        color: white;
    }

    tbody tr:hover {
        background-color: #f5f5f5;
    }

    #btnVoltar {
            margin-left: 20px; 
            background-color: #333;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
        }

    #search-form {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    #search-input {
        padding: 8px;
        width: 200px;
    }

    #btnPesquisar {
        margin-left: 10px;
        padding: 8px;
        background-color: #333;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
</style>
<body>
    <header>
    </header>

    <main>
        <div style="display: flex; align-items: center;">
            <h1>Histórico de Edição</h1>
            <a href="index.php" id="btnVoltar">Voltar</a>
        </div>
        <form id="search-form" method="GET" action="">
            <input type="text" id="search-input" placeholder="Pesquisar operação" name="busca" value="<?= isset($_GET['busca']) ? $_GET['busca'] : ''; ?>">
            <button type="submit" id="btnPesquisar">Pesquisar</button>
            <a href="HistEdit_dell.php" id="btnVoltar">Limpar Filtros</a>
        </form>
        <table>
            <thead>
                <tr>
                    <th>Usuário</th>
                    <th>Tipo de Operação</th>
                    <th>OS Afetada</th>
                    <th>Data da Operação</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $filtro = isset($_GET['busca']) ? " WHERE id_usuario LIKE :busca OR tipo_operacao LIKE :busca OR os_afetada LIKE :busca" : "";
                $sqlRegistros = "SELECT * FROM registros_operacoes" . $filtro;
                
                $stmt = $pdo->prepare($sqlRegistros);
                
                if (isset($_GET['busca'])) {
                    $busca = '%' . $_GET['busca'] . '%';
                    $stmt->bindParam(':busca', $busca, PDO::PARAM_STR);
                }

                $stmt->execute();
                
                $registros = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $registros = array_reverse($registros);
                
                foreach ($registros as $registro): ?>
                    <tr>
                        <td><?= $registro['id_usuario']; ?></td>
                        <td><?= $registro['tipo_operacao']; ?></td>
                        <td><?= $registro['os_afetada']; ?></td>
                        <td><?= date('d/m/Y H:i:s', strtotime($registro['data_operacao'])); ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </main>
</body>
</html>
