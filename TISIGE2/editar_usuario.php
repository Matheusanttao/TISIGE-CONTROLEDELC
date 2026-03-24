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

if (isset($_GET['delete_id'])) {
    $idUsuarioExcluir = $_GET['delete_id'];
    $sqlExcluirUsuario = "DELETE FROM users WHERE id = ?";
    $stmtExcluirUsuario = $pdo->prepare($sqlExcluirUsuario);
    $stmtExcluirUsuario->execute([$idUsuarioExcluir]);

    header("Location: editarUser.php");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'];
    $tipo = $_POST['tipo'];
    $senha = $_POST['senha']; 

    if (empty($senha)) {
        $sqlSenhaAnterior = "SELECT password_hash FROM users WHERE id = ?";
        $stmtSenhaAnterior = $pdo->prepare($sqlSenhaAnterior);
        $stmtSenhaAnterior->execute([$id]);
        $senhaAnterior = $stmtSenhaAnterior->fetchColumn();

        $senha = $senhaAnterior;
    } else {
        $senha = password_hash($senha, PASSWORD_DEFAULT);
    }

    $sqlEditarUsuario = "UPDATE users SET tipo = ?, password_hash = ? WHERE id = ?";
    $stmt = $pdo->prepare($sqlEditarUsuario);
    $stmt->execute([$tipo, $senha, $id]);

    header("Location: editarUser.php");
    exit();
}

if (isset($_GET['id'])) {
    $idUsuario = $_GET['id'];
    $sqlUsuario = "SELECT * FROM users WHERE id = ?";
    $stmtUsuario = $pdo->prepare($sqlUsuario);
    $stmtUsuario->execute([$idUsuario]);
    $usuario = $stmtUsuario->fetch(PDO::FETCH_ASSOC);
} else {
    header("Location: users.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="style.css">
    <title>Editar Usuário</title>
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

        h1 {
            color: #333;
            margin-top: 20px;
        }

        form {
            max-width: 400px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        label {
            display: block;
            margin-bottom: 8px;
            color: #333;
        }

        select,
        input {
            width: 100%;
            padding: 10px;
            margin-bottom: 16px;
            box-sizing: border-box;
        }

        button, .button, #btnVoltar, #btnDell {
        background-color: #333;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
    }

    #btnVoltar {
        background-color: #333;
    }
    #btnDell {
        background-color: red;
    }


</style>
<script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
    <script>
        $(document).ready(function () {
            $("#btnDell").click(function () {
                if (confirm("Tem certeza que deseja excluir o usuário?")) {
                    var userId = <?= $usuario['id']; ?>;

                    $.ajax({
                        type: "GET",
                        url: "deleteUser.php?delete_id=" + userId,
                        success: function (response) {
                            var result = JSON.parse(response);
                            if (result.success) {
                                window.location.href = "editarUser.php";
                            } else {
                                alert("Erro ao excluir o usuário.");
                            }
                        },
                        error: function () {
                            alert("Erro ao excluir o usuário.");
                        }
                    });
                }
            });
        });
    </script>

<body>
    <header>
    </header>

    <main>
        <h1>Editar Usuário</h1><br><br>
        <form method="POST" action="">
            <h5>Usuário selecionado: <?= $usuario['username']; ?></h5>
            <input type="hidden" name="id" value="<?= $usuario['id']; ?>">
            <label for="tipo">Tipo de Usuário:</label>
            <select id="tipo" name="tipo">
                <option value="S" <?= $usuario['tipo'] === 'S' ? 'selected' : ''; ?>>Administrador (S)</option>
                <option value="A" <?= $usuario['tipo'] === 'A' ? 'selected' : ''; ?>>Supervisor (A)</option>
                <option value="B" <?= $usuario['tipo'] === 'B' ? 'selected' : ''; ?>>Usuário Comum (B)</option>
            </select>
            <br>
            <label for="senha">Nova Senha:</label>
            <input type="password" id="senha" name="senha">
            <br>
            <button type="submit">Salvar</button>
            <a href="editarUser.php" id="btnVoltar">Voltar</a>
            <a href="editarUser.php" id="btnDell" >Excluir usuário</a>
        </form>
    </main>

    <footer>
    <div id="footer_copyright">
            2023-24 Controle de LC | PCP Motor | DATA Engenharia
            <br>Desenvolvido por Saul Eduardo Mendes Netto
        </div>
    </footer>
</body>

</html>
