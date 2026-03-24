<?php
    session_start();
    if(empty($_SESSION)){
        print "<script>location.href='LogIndex.php'</script>";
    }
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="style.css">
    <title>Início</title>
</head>
<body>
    <header>
        <nav class="nav-bar" aria-label="Principal">
            <div class="logo">
                <img class="img" src="DataLogo.png" alt="Logo">
            </div>
            <div class="nav-list">
                <ul>
                    <li class="nav-item"><a href="ControleLC.php" class="nav-link">Controle de LC</a></li>
                    <li class="nav-item"><a href="LogIndex.php" class="nav-link">Login</a></li>
                    <li class="nav-item"><a href="#" class="nav-link" onclick="return false;">Olá, <?php echo htmlspecialchars($_SESSION["user"] ?? '', ENT_QUOTES, 'UTF-8'); ?></a></li>
                    <li class="nav-item dropdown">
                        <a href="#" class="nav-link dropdown-toggle" onclick="return false;">Painel</a>
                        <div class="dropdown-content">
                            <a href="HistEdit.php">Histórico de pesquisa</a>
                            <a href="HistEdit_dell.php">Histórico de edição</a>
                            <a href="editarUser.php">Edição de usuários</a>
                            <a href="criaruser.php">Criação de usuários</a>
                        </div>
                    </li>
                </ul>
            </div>
            <a href="logout.php" class="nav-link login-button" style="padding:0.5rem 1rem;border-radius:var(--radius-sm);background:linear-gradient(135deg,#0891b2,#06b6d4);color:#042f2e;font-weight:600;">Sair</a>
        </nav>
    </header>

    <main class="tg-home-cards">
        <a href="ControleLC.php" class="card">
            <img src="LogoLc.png" alt="">
            <div class="card-content">
                <h2>Controle de LC</h2>
                <p>Encontre e gerencie LCs</p>
            </div>
        </a>
    </main>
</body>
</html>
