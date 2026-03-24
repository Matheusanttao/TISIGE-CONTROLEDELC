<?php
require 'config.php';

if ($_SESSION['tipo_usuario'] === 'B') {
    header("Location: VisualizarControleLC.php");
    exit();
}

if (empty($_SESSION)) {
    print "<script>location.href='LogIndex.php'</script>";
}

$nomeUsuario = $_SESSION["user"];
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Controle de LC</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Tangerine">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap">
    <link rel="stylesheet" href="style.css">
</head>
<style>
label {
    font-weight: bolder;
}
.form-control{
    background: var(--surface) !important;
    border-color: var(--border) !important;
    color: var(--text) !important;
}
::placeholder {
    color: var(--text-muted) !important;
}
::-webkit-input-placeholder { 
    color: var(--text-muted) !important;
}
:-moz-placeholder { 
    color: var(--text-muted) !important;
 }
 h1 {
    text-align: center;
    color: var(--text);
 }
 h5{
    text-align: center;
    color: var(--text-muted);
 }
 #msg {
     height: 60px;
 }
 #grid-lcs tbody {
     cursor: pointer;
 }
 body {
    background: var(--bg);
    color: var(--text);
  }
.btn-secondary{
    position: relative;
}
.cor{
    color: var(--accent);
}
#inputSite tbody{
    cursor: pointer;
}
/*Deixar as infos do motor na mesma linha:*/
td{
    white-space: nowrap;
    font-size: 14.5px;
}
#grid-lcs td:nth-child(4) {
    white-space: normal;
}
#grid-lcs td:nth-child(2) {
    font-weight: bold;
}
.bold{
    font-weight: bold;
}
#overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
    z-index: 9999; 
}

#confirmDialog {
    background: #fff;
    padding: 20px;
    text-align: center;
    z-index: 10000; 
}

#confirmDialog button {
    margin: 5px;
}
#confirmDialog {
    background: #fff;
    padding: 20px;
    text-align: center;
    z-index: 10000;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    border-radius: 5px;
}

#confirmDialog h2 {
    margin-bottom: 15px;
    color: #333;
    font-family: 'Poppins', sans-serif; 
}
#grid-lcs {
    border-collapse: collapse;
    width: 100%;
    margin-top: 20px;
}

#grid-lcs th,
#grid-lcs td {
    padding: 10px;
    text-align: left;
}

#grid-lcs th {
    background-color: var(--surface);
    color: var(--text);
}

#grid-lcs tbody tr:nth-child(even) {
    background-color: rgba(255,255,255,0.03);
}

#grid-lcs tbody tr:hover {
    background-color: rgba(34, 211, 238, 0.08);
}

#grid-lcs td {
    border: 1px solid var(--border);
    border-radius: 5px;
}

#grid-lcs th
{
    border-color: var(--border);
}

#grid-lcs td a {
    text-decoration: none;
    color: #007bff;
}

#grid-lcs td a:hover {
    text-decoration: underline;
}

#grid-lcs td button {
    padding: 5px 10px;
    cursor: pointer;
}

#grid-lcs td button:hover {
    background-color: #dc3545;
    color: #fff;
}
#grid-lcs td:nth-child(10) a {
    color: #000;
    background-color: #ffc107; 
    border: 1px solid #ffc107; 
    border-radius: 5px;
    padding: 5px 10px;
    display: inline-block;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
}

#grid-lcs td:nth-child(10) a:hover {
    background-color: #ffc107;
    border-color: #ffc107;
    color: #000;
}
#grid-lcs td:nth-child(10) a {
    color: #000; 
    background-color: #ffc107; 
    border: 1px solid #ffc107; 
    border-radius: 5px;
    padding: 5px 10px;
    display: inline-block;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    transition: box-shadow 0.3s ease-in-out; 
}
#grid-lcs td:nth-child(11) button {
    color: #fff; 
    background-color: #dc3545;
    border: 1px solid #dc3545; 
    border-radius: 5px;
    padding: 5px 10px;
    display: inline-block;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    transition: box-shadow 0.3s ease-in-out;
}

#grid-lcs td:nth-child(10) a:hover {
    box-shadow: 0 0 15px #ffc107;
}
#grid-lcs td:nth-child(11) button:hover {
    box-shadow: 0 0 10px #dc3545;
    transition: box-shadow 0.3s ease-in-out;
}
#grid-lcs td {
    vertical-align: middle; 
}
#grid-lcs tbody tr:hover {
    cursor: pointer;
}
</style>
<body onload="init()">
<header>
    <nav class="nav-bar">
        <div class="logo">
            <img class="img" src="DataLogo.png" alt="Logo">
        </div>
        <div class="nav-list">
            <ul>
                <li class="nav-item"><a href="Index.php" class="nav-link">Início</a></li>
                <li class="nav-item">
                <form action="" class="d-flex flex-wrap align-items-center" style="gap:0.5rem" role="search">
        <input class="form-control" style="min-width:140px;max-width:220px" type="search" placeholder="Pesquisar LC" value="<?php if(isset($_GET['busca'])) echo htmlspecialchars($_GET['busca'], ENT_QUOTES, 'UTF-8');?>" aria-label="Search" name="busca">
        <button onclick="searchData()" class="btn btn-outline-info" type="submit">Buscar</button>
        </form>
                </li>
                <li class="nav-item"><a href="ControleLC.php" class="nav-link">Limpar filtros</a></li>
            </ul>
        </div>
        <div class="login-button">
            <a href="logout.php" class="nav-link">Sair</a>
        </div>
    </nav>
</header>
<div class="box-search">
                </div>
    <br><br>
    <u><h1>Controle de LC</h1></u><h5>Preencha os dados corretamente </h5>

    <div class="container">
        <div class="row">
            <div id="msg" class="col-sm-10 offset-sm-1 ">
            </div>
        </div>
        <form id="form-lc" method="POST" action="cadastrar_action.php">
            <div class="form-group row">
                <div class="col-sm-4">
                    <label for="os">Arquivo</label>
                    <input type="text" class="form-control" name="arquivo" id="arquivo" placeholder="Digite o arquivo">
                </div>
                <div class="col-sm-8">
                    <label for="os">OS (*)</label>
                    <input type="text" class="form-control" name="os" id="os" required placeholder="Digite a OS">
                </div>
            </div>
            <div class="form-group row">
                <div class="col-sm-5">
                    <label for="cliente">Cliente (*)</label>
                    <input type="text" class="form-control" name="cliente" id="cliente" required placeholder="Digite o cliente">
                </div>
                <div class="col-sm-7">
                    <label for="equipamento">Equipamento (*)</label>
                    <input type="textarea" class="form-control" name="equipamento" id="equipamento" required placeholder="Digite o equipamento">
                </div>
            </div>
                
            <div class="form-group row">
                <div class="col-sm-6">
                    <label for="dtContratual">Data contratual (*)</label>
                    <input type="date" class="form-control" name="dtContratual" id="dtContratual" required placeholder="Digite a data de contrato" >
                </div>
                <div class="col-sm-6">
                    <label for="dtRecebimento">Data recebimento (*)</label>
                    <input type="date" class="form-control" name="dtRecebimento" id="dtRecebimento" required placeholder="Digite a data de recebimento">
                </div>
            </div>
            
            <div class="form-group row">
                <div class="col-sm-5">
                    <label for="dtRetirada">Data retirada</label>
                    <input type="date" class="form-control" name="dtRetirada" id="dtRetirada" placeholder="Digite a data de contrato">
                </div>
                <div class="col-sm-4">
                    <label for="respRetirada">Responsável retirada</label>
                    <input type="text" class="form-control" name="respRetirada" id="respRetirada" placeholder="Responsável pela retirada">
                </div>
                <div class="col-sm-3">
                    <label for="setor">Setor</label>
                    <br>
            <select name="setor" class="form-control" id="setor"> 
                <option value="" hidden>Setor responsável</option>
                <option value="Barra">Barra</option>   
                <option value="Fio Redondo">Fio Redondo</option>  
                <option value="Mecânica">Mecânica</option>  
                <option value="Polo">Polo</option>  
                <option value="Teste">Teste</option> 
            </select>
                </div>
            </div>
            <div class="form-group row">
                <div class="col-sm-4">
                <small class="bold">(*) Campos obrigatórios</small><br>
                <small class="bold">G1: </small> <small>01 ao 30 - </small><small class="bold">G2: </small> <small> 31 ao 60 - </small><small class="bold">G3: </small> <small> 61+</small>
                </div>
            </div>
            <div class="form-group row">
                <div class="col-sm-12">
                    <input type="submit" class="btn btn-success" id="btnInsert" value="Inserir">
                    <input type="submit" class="btn btn-secondary" id="btnClear" value="Limpar Form">
                </div>
            </div>
        </form>
    <?php
        $lista = [];
        $sql = $pdo->query("SELECT * FROM ControleLC");
        if($sql->rowCount() > 0){
            $lista = $sql->fetchAll(PDO::FETCH_ASSOC);
        }
        function compararPorArquivo($a, $b) {
            if ($a['arquivo'] == '' && $b['arquivo'] != '') {
                return 1;
            } elseif ($a['arquivo'] != '' && $b['arquivo'] == '') {
                return -1;
            }
    
            $numeroA = (int)$a['arquivo'];
            $numeroB = (int)$b['arquivo'];
    
            return $numeroA - $numeroB;
        }
    
        usort($lista, 'compararPorArquivo');
        if (isset($_GET['busca']) && !empty($_GET['busca'])) {
            $termoPesquisa = $_GET['busca'];
            $inserirPesquisa = $pdo->prepare("INSERT INTO pesquisas (id_usuario, termo_pesquisa) VALUES (?, ?)");
        
            foreach ($lista as $ControleLC) {
            }
        
            $inserirPesquisa->execute([$nomeUsuario, $termoPesquisa]);
        }
        
    ?>
<script>
    function redirecionarParaExcluir() {
        var os = document.getElementById('btnConfirm').getAttribute('data-os');
        window.location.href = 'excluir.php?os=' + os;
    }

    function confirmarExcluir(os) {
        document.getElementById('btnConfirm').setAttribute('data-os', os);

        document.getElementById('overlay').style.display = 'flex';
    }
</script>

<div id="overlay" onclick="fecharDialog()">
    <div id="confirmDialog">
        <img src="alert2.png" alt="Alert" style="width: 70px; height: 70px; margin-bottom: 10px;">
        <h2>Tem certeza que deseja excluir esta OS?</h2>
        <button id="btnConfirm" class="btn btn-success" onclick="redirecionarParaExcluir()">Sim</button>
        <button id="btnCancel" class="btn btn-danger" onclick="fecharDialog()">Cancelar</button>
    </div>
</div>

<script>
    function fecharDialog() {
        document.getElementById('overlay').style.display = 'none';
    }
</script>
   

        <div class="row">
        <div class="col-sm-12">
    <table id="grid-lcs" class="table table-striped">
        <thead>
            <tr>
                <th scope="col">Arquivo</th>
                <th scope="col">OS</th>
                <th scope="col">Cliente</th>
                <th scope="col">Equipamento</th>
                <th scope="col">Data contratual</th>
                <th scope="col">Data recebimento</th>
                <th scope="col">Data retirada</th>
                <th scope="col">Responsável retirada</th>
                <th scope="col">Setor</th>
                <th scope="col">Editar</th>
                <th scope="col">Excluir</th>
            </tr>
        </thead>
        
        <tbody id="grid-lcs">
        <?php
                foreach($lista as $ControleLC):
                    if(isset($_GET['busca']) && !empty($_GET['busca'])) {
                        $busca = $_GET['busca'];
                        if(
                            strpos($ControleLC['os'], $busca) === false &&
                            strpos($ControleLC['cliente'], $busca) === false &&
                            strpos($ControleLC['equipamento'], $busca) === false &&
                            strpos($ControleLC['respRetirada'], $busca) === false &&
                            strpos($ControleLC['setor'], $busca) === false
                        ) {
                            continue; 
                        }
                    }
            ?>
                <td><?=$ControleLC['arquivo'];?></td>
                <td><?=$ControleLC['os'];?></td>
                <td><?=$ControleLC['cliente'];?></td>
                <td><?=$ControleLC['equipamento'];?></td>
                <td><?=date('d/m/Y', strtotime($ControleLC['dtContratual']));?></td>
                <td><?=date('d/m/Y', strtotime($ControleLC['dtRecebimento']));?></td>
                <td><?=($ControleLC['dtRetirada'] != '0000-00-00') ? date('d/m/Y', strtotime($ControleLC['dtRetirada'])) : '';?></td>                            
                <td><?=$ControleLC['respRetirada'];?></td>
                <td><?=$ControleLC['setor'];?></td>
                <td>
                    <a href='editar.php?os=<?=$ControleLC['os'];?>' class='btn btn-warning'>Editar</a>
                </td>
                <td>
                    <button class='btn btn-danger' onclick="confirmarExcluir('<?=$ControleLC['os'];?>')">Excluir</button>
                </td>
            </tr>    
            <?php
                endforeach;
            ?>
        </tbody>
    </table>
</div>
</div>
</div>
    <?php
    ?>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
    <script>
         $("#btnClear").click(function () {
                $("#form-lc")[0].reset();
            });
    </script>
    <br><br>
    <br><br>
    <footer>
        <div id="footer_copyright">
            2023-24 Controle de LC | PCP Motor | DATA Engenharia
            <br>Desenvolvido por Saul Eduardo Mendes Netto
        </div>
    </footer>
</body>
</html>