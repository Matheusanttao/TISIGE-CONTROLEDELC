<?php
    require 'config.php';

    if ($_SESSION['tipo_usuario'] === 'B') {
        header("Location: VisualizarInicio.php");
        exit();
    }
    if(empty($_SESSION)){
        print "<script>location.href='LogIndex.php'</script>";
    }
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="style.css">
    <title>Início</title>
</head>
<style>
body{
    background-color: #cfd8dc;
    text-align: center;
}
.dropdown {
        position: relative;
        display: inline-block;
    }

    .dropdown-content {
        display: none;
        position: absolute;
        background-color: #f9f9f9;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        z-index: 1;
    }

    .dropdown-content a {
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
    }

    .dropdown-content a:hover {
        background-color: #f1f1f1;
    }

    .dropdown:hover .dropdown-content {
        display: block;
    }
</style>
<header>
    <br>
    <nav class="nav-bar">
        <div class="logo">
            <img class="img" src="DataLogo.png">
        </div>
        <div class="nav-list">
            <ul>
                <li class="nav-item"><a href="ControleLC.php" class="nav-link">Controle de LC</a></li>
                <li class="nav-item"><a href="LogIndex.php" class="nav-link">Login</a></li>
                <li class="nav-item"><a href="" class="nav-link"><?php
        print "Olá, " . $_SESSION["user"];
        ?></a></li>
                <br>
            </ul>
        </div>
        <?php
        print"<a href = 'logout.php' class='nav-link'>Sair</a>";
        ?>
    </nav>    
</header>
<body>
     <a href="ControleLC.php" class="card" style="body {
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    height: 100vh;
                                    margin: 0;
                                    }">
        <img src="LogoLc.png" alt="Encontre LC's">
        <div class="card-content">
            <h2>Controle de LC</h2>
            <p>Encontre LC's</p>
        </div>
    </a>
</body>
</html>