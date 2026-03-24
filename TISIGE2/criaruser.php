<?php
require 'config.php';

if ($_SESSION['tipo_usuario'] === 'B') {
    header("Location: Semacesso.php");
    exit();
}elseif ($_SESSION['tipo_usuario'] === 'A') {
    header("Location: Semacesso.php");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    require_once 'config.php';

    $username = $_POST['Criausername'];
    $password = $_POST['password'];  
    $tipo = $_POST['tipo'];

    $conn = new mysqli($db_host, $db_user, $db_password, $db_name);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $check_user_query = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $check_user_query->bind_param("s", $username);
    $check_user_query->execute();
    $check_user_query->store_result();

    if ($check_user_query->num_rows > 0) {
        echo '<script>alert("Erro: O nome de usuário já está em uso.");</script>';
    } else {
        $insert_query = $conn->prepare("INSERT INTO users (username, password_hash, tipo) VALUES (?, ?, ?)");
        $insert_query->bind_param("sss", $username, $password, $tipo);
        $insert_query->execute();

        echo '<script>alert("Sucesso: Usuário criado. Tipo de usuário: ' . $tipo . '"); window.location.href = "index.php";</script>';
        exit();
    }

    $check_user_query->close();
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Criar Usuário</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #cfd8dc;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            flex-direction: column; 
        }

        form {
            background-color: #fff;
            max-width: 400px;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            margin-bottom: 10px; 
        }

        h2 {
            text-align: center;
            color: #333;
        }

        label {
            display: block;
            margin-bottom: 8px;
            color: #555;
        }

        input, select {
            width: 100%;
            padding: 8px;
            margin-bottom: 16px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
            color: rgba(0, 0, 0, 0.7); 
        }

        input[type="submit"] {
            background-color: #333;
            color: #fff;
            cursor: pointer;
        }

        input[type="submit"]:hover {
            background-color: #222;
        }

        .error {
            color: #f00;
            margin-top: 8px;
        }

        .password-toggle {
            position: relative;
        }

        .password-toggle input[type="password"] {
            padding-right: 30px;
        }

        .password-toggle .toggle-btn {
            position: absolute;
            top: 50%;
            right: 8px;
            transform: translateY(-50%);
            cursor: pointer;
            border: none;
            background: none;
            color: #555;
        }

        .back-btn {
            display: flex;
            justify-content: center;
            margin-top: 5px; 
        }
        .back-btn :hover{
            background-color: #222;
        }

        .back-btn a {
            background-color: #333;
            color: #fff;
            padding: 8px 64px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
        <h2>Criar Usuário</h2>
        <?php
            if (isset($mensagem_erro)) {
                echo '<p class="error">' . $mensagem_erro . '</p>';
            }
        ?>
        <label for="Criausername">Nome de usuário:</label>
        <input type="text" name="Criausername" id="Criausername" required placeholder="Digite o usuário">
        
        <label for="password" class="password-toggle">Senha:
            <input type="password" name="password" id="password" required placeholder="Digite a senha">
            <button type="button" class="toggle-btn" onclick="togglePassword('password')">Mostrar</button>
        </label>
        
        <label for="tipo">Tipo de usuário:</label>
        <select name="tipo" id="tipo" required>
            <option value="" disabled selected style="color: rgba(0, 0, 0, 0.5);">Selecione o tipo de usuário</option>
            <option value="S">Administrador (S)</option>
            <option value="A">Supervisor (A)</option>
            <option value="B">Usuário Comum (B)</option>
        </select>
        <input type="submit" value="Criar Usuário">
    </form>
    
    <div class="back-btn">
        <a href="index.php">Voltar</a>
    </div>

    <script>
        function togglePassword(fieldId) {
            var passwordField = document.getElementById(fieldId);
            var toggleBtn = document.querySelector('.toggle-btn');

            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                toggleBtn.textContent = 'Ocultar';
            } else {
                passwordField.type = 'password';
                toggleBtn.textContent = 'Mostrar';
            }
        }
    </script>
</body>
</html>
