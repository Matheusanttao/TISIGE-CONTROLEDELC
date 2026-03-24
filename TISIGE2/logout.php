<?php
    session_start();
    unset($_SESSION["username"]);
    unset($_SESSION["tipo"]);
    session_destroy();
    header("Location: LogIndex.php");
    exit;
?>