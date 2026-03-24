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

require 'config.php';

$sqlPesquisas = "SELECT * FROM pesquisas";
$resultPesquisas = $pdo->query($sqlPesquisas);

$pesquisas = $resultPesquisas->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Tangerine">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap">
    <link rel="stylesheet" href="style.css">
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

        h1 {
            color: #333;
            display: inline; 
        }

        #btnVoltar {
            margin-left: 20px; 
            background-color: #333;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
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
        
        #msg {
            font-weight: bold;
            color: red;
        }
    </style>
<body>
    <header>
    </header>

    <main>
    <div style="display: flex; align-items: center;">
            <h1>Histórico de Pesquisa</h1> 
            <a href="index.php" id="btnVoltar">Voltar</a>
        </div>
        <form id="search-form" method="GET" action="">
                <input type="text" id="search-input" placeholder="Pesquisar termo" name="busca" value="<?= isset($_GET['busca']) ? $_GET['busca'] : ''; ?>">
                <button type="submit" id="btnPesquisar">Pesquisar</button>
                <a href="HistEdit.php" id="btnVoltar">Limpar Filtros</a>
            </form>
        <table>
            <thead>
                <tr>
                    <th>Usuário</th>
                    <th>Termo de Pesquisa</th>
                    <th>Data da Pesquisa</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $filtro = isset($_GET['busca']) ? " WHERE termo_pesquisa LIKE :busca" : "";
                $order = " ORDER BY data_pesquisa DESC";
                $sqlPesquisas = "SELECT * FROM pesquisas" . $filtro . $order;
                
                $stmt = $pdo->prepare($sqlPesquisas);

                if (isset($_GET['busca'])) {
                    $busca = '%' . $_GET['busca'] . '%';
                    $stmt->bindParam(':busca', $busca, PDO::PARAM_STR);
                }

                $stmt->execute();
                
                $pesquisas = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                foreach ($pesquisas as $pesquisa): ?>
                    <tr>
                        <td><?= $pesquisa['id_usuario']; ?></td>
                        <td><?= $pesquisa['termo_pesquisa']; ?></td>
                        <td><?= date('d/m/Y H:i:s', strtotime($pesquisa['data_pesquisa'])); ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </main>
</body>
</html>
