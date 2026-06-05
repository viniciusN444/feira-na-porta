const mysql =
require("mysql2");

const conexao =
mysql.createConnection({

    host: "localhost",

    user: "root",

    password: "",

    database: "feira_na_porta"

});

conexao.connect((erro) => {

    if(erro){

        console.log(
            "Erro ao conectar:",
            erro
        );

    }else{

        console.log(
            "MySQL conectado!"
        );

    }

});

module.exports =
conexao;