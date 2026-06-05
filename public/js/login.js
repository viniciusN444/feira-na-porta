const botaoLogin =
document.getElementById("btn-login");

const mensagemErro =
document.getElementById("mensagem-erro");

botaoLogin.addEventListener("click", () => {

    const usuario =
    document.getElementById("usuario").value;

    const senha =
    document.getElementById("senha").value;

    if(
        usuario === "admin"
        &&
        senha === "1234"
    ){

        localStorage.setItem(
            "adminLogado",
            "true"
        );

        window.location.href = "/adm";

    }else{

        mensagemErro.textContent =
        "Usuário ou senha inválidos";

    }

});