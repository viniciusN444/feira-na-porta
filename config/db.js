const mysql = require("mysql2");

const conexao = mysql.createConnection(process.env.MYSQL_URL);

conexao.connect((erro) => {

    if (erro) {

        console.log("Erro ao conectar:", erro);

    } else {

        console.log("MySQL conectado!");

    }

});

module.exports = conexao;