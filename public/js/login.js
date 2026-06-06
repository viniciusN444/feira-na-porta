const botaoLogin =
document.getElementById("btn-login");

const mensagemErro =
document.getElementById("mensagem-erro");

botaoLogin.addEventListener("click", () => {

    const usuario =
document.getElementById("usuario").value.trim();

const senha =
document.getElementById("senha").value.trim();

    if(
        usuario === "luizFelipe"
        &&
        senha === "feiraLuiz10"
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