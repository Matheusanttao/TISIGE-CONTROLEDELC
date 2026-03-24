<?php
require 'config.php';

if ($_SESSION['tipo_usuario'] === 'B') {
    header("Location: Semacesso.php");
    exit();
} elseif ($_SESSION['tipo_usuario'] === 'A') {
    header("Location: Semacesso.php");
    exit();
}

if (empty($_SESSION['user'])) {
    header("Location: LogIndex.php");
    exit();
}

$nomeUsuario = $_SESSION['user'];

require 'config.php';

$sqlUsuarios = "SELECT * FROM users WHERE 1";

if (isset($_GET['busca']) && !empty($_GET['busca'])) {
    $termoBusca = $_GET['busca'];
    $sqlUsuarios .= " AND (username LIKE '%$termoBusca%' OR tipo LIKE '%$termoBusca%')";
}

$resultUsuarios = $pdo->query($sqlUsuarios);

$usuarios = $resultUsuarios->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="style.css">
    <title>Gerenciar Usuários</title>
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
            <h1>Gerenciar Usuários</h1>
            <a href="index.php" id="btnVoltar">Voltar</a>
        </div>
        <form id="search-form" method="GET" action="">
            <input type="text" id="search-input" placeholder="Pesquisar usuário" name="busca" value="<?= isset($_GET['busca']) ? $_GET['busca'] : ''; ?>">
            <button type="submit" id="btnPesquisar">Pesquisar</button>
            <a href="editarUser.php" id="btnVoltar">Limpar Filtros</a>
        </form>
        <h4><span style="color: red; font-weight: bold;">ATENÇÃO!</span> Ao conceder a um usuário a permissão de nível S, ele terá acesso completo ao sistema.</h4>        
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Tipo</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($usuarios as $usuario) : ?>
                    <tr>
                        <td><?= $usuario['id']; ?></td>
                        <td><?= $usuario['username']; ?></td>
                        <td><?= $usuario['tipo']; ?></td>
                        <td>
                            <a href="editar_usuario.php?id=<?= $usuario['id']; ?>" class='btn btn-dark'>Editar</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </main>
</body>

</html>
