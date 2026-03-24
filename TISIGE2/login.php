<?php
    session_start();
    if(empty($_POST) or (empty($_POST["username"]) or (empty($_POST["password_hash"])))){
        print "<script>
        location.href='LogIndex.php';</script>";
    }

    include ('configLogin.php');

    $user = $_POST["username"];
    $password_hash = $_POST["password_hash"];

    $sql = "SELECT * FROM users
    WHERE username = '{$user}'
    AND password_hash = '{$password_hash}'";

    $res = $conn->query($sql) or die($conn->error);

    $row = $res->fetch_object();
    $qtd = $res->num_rows;
    if($qtd > 0){
        $_SESSION["user"] = $user;
        //verificar se tipo de usuário não vai dar erro!!!
       // $_SESSION["tipo"] = $row->tipo;
        print"<script>location.href='Index.php';</script>";
    }else{
        print"<script>alert('Usuário e/ou senha incorreto(s)');</script>";
        print"<script>location.href='LogIndex.php';</script>";
    }
?>