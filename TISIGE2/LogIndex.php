<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://kit.fontawesome.com/1ab94d0eba.js" crossorigin="anonymous"></script>
    <title>Login</title>
</head>
<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

* {
    margin: 0;
    border: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Poppins", sans-serif;
}

body {
   /* background: linear-gradient(45deg, #1bebf2, #1db9f2);*/
    background-color: #46849b ;
    background-repeat: no-repeat;
    /*Código para colocar imagem como background
    background-image: url(DataLogo.png);
    background-size: cover;
    */
    min-height: 100vh;
    min-width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
}

main.container{
    background-color: white;
    max-width: 350px;
    min-height: 50vh;
    padding: 2rem;
    box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
}

main h2 {
    font-weight: 600;
    margin-bottom: 2rem;
    position: relative;
}

main h2::before {
    content: '';
    position: absolute;
    height: 4px;
    width: 25px;
    bottom: 3px;
    left: 0;
    border-radius: 8px;
    background: linear-gradient(45deg, #65a2a5, #46849b);
}

form {
    display: flex;
    flex-direction: column;
}

 .input-field{
    position: relative;
 }

 form .input-field:first-child {
    margin-bottom: 1.5rem;
}

.input-field .underline::before{
    content: '';
    position: absolute;
    height: 1px;
    width: 100%;
    bottom: -5px;
    left: 0;
    background:rgba(0, 0, 0, 0.2)
}

.input-field .underline::after{
    content: '';
    position: absolute;
    height: 1px;
    width: 100%;
    bottom: -5px;
    left: 0;
    background: linear-gradient(45deg, #65a2a5, #46849b);
    transform: scaleX(0);
    transition: all .4s ease-in-out;
    transform-origin: left;
}

.input-field input:focus ~ .underline::after{
    transform: scaleX(1);
}

 .input-field input{
    outline: none;
    font-size: 0.9rem;
    color: rgba(0, 0, 0, 0.7)
 }

 .input-field input::placeholder {
    color: rgba(0, 0, 0, 0.5);
}

form input[type="submit"] {
    margin-top: 2rem;
    padding: 0.4rem;
    width: 100%;
    background: linear-gradient(to left, #65a2a5, #46849b);
    cursor: pointer;
    color: white;
    font-size: 0.9rem;
    font-weight: 300;
    border-radius: 4px;
    transition: all 0.4s ease;
}

form input[type="submit"]:hover {
    letter-spacing: 0.5px;
    background: linear-gradient(to right, #65a2a5, #46849b);
}

.footer {
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
}

.footer span {
    color: rgba(0, 0, 0, 0.7);
    font-size: 0.8rem;
    text-align: center;
}

.senha{
    text-decoration: none;
}
</style>
<body>
    <main class="container">
        <h2>Login</h2>
        <form action="login.php" method="POST">
             <div class="input-field">
                 <input type="text" name="username" id="username" placeholder="Insira o usuário">
                 <div class="underline"></div>
             </div>
             <div class="input-field">
                 <input type="password" name="password_hash" id="password_hash" placeholder="Insira sua senha">
                 <div class="underline"></div>
             </div>
             <div class="footer">
                 <span><a class="senha" href="esqsenha.html">Esqueci minha senha</a></span>
             </div>
             <input type="submit" value="Login">
         </form>
        </div>
    </main>
</body>
</html>