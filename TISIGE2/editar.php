<?php
require 'config.php';
$ControleLC = [];
$os = filter_input(INPUT_GET, 'os');
if($os){
    $sql = $pdo->prepare("SELECT * FROM ControleLC WHERE os = :os");
    $sql->bindValue(':os', $os);
    $sql->execute();

    if($sql->rowCount() > 0){
        $ControleLC = $sql->fetch(PDO::FETCH_ASSOC);
    }
     else{
        header("Location: OsInexistente.html");
    }
}
 else{
    header("Location: OsInexistente.html");
}
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
    <link rel="stylesheet" href="style.css">
</head>
<style>
label {
    font-weight: bolder;
}
.form-control{
    color: lightskyblue !important;
    opacity: 3;
}
::placeholder {
    color: lightskyblue !important;
    opacity: 3;
}
::-webkit-input-placeholder { 
    color:  lightskyblue !important;
}
:-moz-placeholder { 
    color:  lightskyblue !important;
    opacity:  3;
 }
 h1 {
    text-align: center;
 }
 h5{
    text-align: center;
 }
 #msg {
     height: 60px;
 }
 #grid-lcs tbody {
     cursor: pointer;
 }
 body {
    background: #cfd8dc;  
  }
.btn-secondary{
    position: relative;
    display: flex;
    left: 980px;
    top: -35px;
.cor{
    color:  lightskyblue ;
}    
}
#inputSite tbody{
    cursor: pointer;
}
td{
    white-space: nowrap;
    font-size: 14.5px;
}
#grid-lcs td:nth-child(4) {
    white-space: normal;
}
* {
    margin: 0;
    border: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
}
.bold{
    font-weight: bold;
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
                <li class="nav-item"><a href="Index.php" class="nav-link">Início</a></li>
                <li class="nav-item"><a href="ControleLC.php" class="nav-link">Voltar</a></li>
                </form>
            </ul>
        </div>
        <div class="login-button">
        </div>

</header>
<body onload="init()">

    <br><br>
    <u><h1>Edição de OS</h1></u><h5>Preencha os dados corretamente </h5>

    <div class="container">
        <div class="row">
            <div id="msg" class="col-sm-10 offset-sm-1 ">
            </div>
        </div>

        <form id="form-lc" method="POST" action="editar_action.php">
            <div class="form-group row">
                <div class="col-sm-4">
                    <label for="os">Arquivo</label>
                    <input type="text" class="form-control" name="arquivo" id="arquivo" placeholder="Digite o arquivo" value="<?=$ControleLC['arquivo'];?>">
                </div>
                <div class="col-sm-8">
                    <label for="os">OS (*)</label>
                    <input type="text" class="form-control" name="os" id="os" required value="<?=$ControleLC['os'];?>">
                </div>
            </div>
            <div class="form-group row">
                <div class="col-sm-5">
                    <label for="cliente">Cliente (*)</label>
                    <input type="text" class="form-control" name="cliente" id="cliente" required value="<?=$ControleLC['cliente'];?>">
                </div>
                <div class="col-sm-7">
                    <label for="equipamento">Equipamento (*)</label>
                    <input type="textarea" class="form-control" name="equipamento" id="equipamento" required value="<?=$ControleLC['equipamento'];?>">
                </div>
            </div>
                
            <div class="form-group row">
                <div class="col-sm-6">
                    <label for="dtContratual">Data contratual (*)</label>
                    <input type="date" class="form-control" name="dtContratual" id="dtContratual" required value="<?=$ControleLC['dtContratual'];?>" >
                </div>
                <div class="col-sm-6">
                    <label for="dtRecebimento">Data recebimento (*)</label>
                    <input type="date" class="form-control" name="dtRecebimento" id="dtRecebimento" required value="<?=$ControleLC['dtRecebimento'];?>">
                </div>
            </div>
            
            <div class="form-group row">
                <div class="col-sm-5">
                    <label for="dtRetirada">Data retirada</label>
                    <input type="date" class="form-control" name="dtRetirada" id="dtRetirada" value="<?=$ControleLC['dtRetirada'];?>">
                </div>
                <div class="col-sm-4">
                    <label for="respRetirada">Responsável retirada</label>
                    <input type="text" class="form-control" name="respRetirada" id="respRetirada" placeholder="Responsável retirada" value="<?=$ControleLC['respRetirada'];?>">
                </div>
                <div class="col-sm-3">
                <label for="setor">Setor</label>
                <br>
                <select style="color: lightskyblue" name="setor" class="form-control" id="setor"> 
                    <option value="" hidden>Setor responsável</option>
                    <option value="Barra" <?php echo ($ControleLC['setor'] == 'Barra') ? 'selected' : ''; ?>>Barra</option>   
                    <option value="Fio Redondo" <?php echo ($ControleLC['setor'] == 'Fio Redondo') ? 'selected' : ''; ?>>Fio Redondo</option>  
                    <option value="Mecânica" <?php echo ($ControleLC['setor'] == 'Mecânica') ? 'selected' : ''; ?>>Mecânica</option>  
                    <option value="Polo" <?php echo ($ControleLC['setor'] == 'Polo') ? 'selected' : ''; ?>>Polo</option>  
                    <option value="Teste" <?php echo ($ControleLC['setor'] == 'Teste') ? 'selected' : ''; ?>>Teste</option> 
                    <option value=""></option>
                </select>
                </div>
            </div>
            <div class="form-group row">
                <div class="col-sm-4">
                    <small class="bold">(*) Campos obrigatórios</small>
                </div>
            </div>
            <div class="form-group row">
                <div class="col-sm-12">
                    <input type="submit" class="btn btn-success" id="btnInsert" value="Concluir">
                    
                    <button><a href='ControleLC.php' class='btn btn-danger'>Cancelar</a></button>
                </div>
            </div>
        </form>
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