const express = require('express');
const conexao =
require("./config/db");

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get("/adm", (req, res) => {

    res.sendFile(__dirname + "/views/adm.html");

});

app.get("/login", (req, res) => {

    res.sendFile(__dirname + "/views/login.html");

});

app.use(express.json({
    limit: "50mb"
}));

app.use(express.urlencoded({
    limit: "50mb",
    extended: true
}));

app.post("/produtos", (req, res) => {

    const {
        nome,
        preco,
        imagem,
        categoria
    } = req.body;

    const sql = `
        INSERT INTO produtos
        (nome, preco, imagem, categoria)
        VALUES (?, ?, ?, ?)
    `;

    conexao.query(
        sql,
        [
            nome,
            preco,
            imagem,
            categoria
        ],
        (erro, resultado) => {

            if(erro){

                console.log(erro);

                res.status(500).send(
                    "Erro ao cadastrar produto"
                );

            }else{

                res.status(201).send(
                    "Produto cadastrado!"
                );

            }

        }
    );

});

app.get("/produtos", (req, res) => {

    const sql =
    "SELECT * FROM produtos";

    conexao.query(sql, (erro, resultados) => {

        if(erro){

            console.log(erro);

            res.status(500).send(
                "Erro ao buscar produtos"
            );

        }else{

            res.json(resultados);

        }

    });

});


app.delete("/produtos/:id", (req, res) => {

    const id = req.params.id;

    const sql =
    "DELETE FROM produtos WHERE id = ?";

    conexao.query(
        sql,
        [id],
        (erro, resultado) => {

            if(erro){

                console.log(erro);

                res.status(500).send(
                    "Erro ao remover produto"
                );

            }else{

                res.send(
                    "Produto removido!"
                );

            }

        }
    );

});

app.put("/produtos/:id", (req, res) => {

    const { id } = req.params;

    const {
        nome,
        preco,
        imagem,
        categoria
    } = req.body;

    const sql = `
        UPDATE produtos
        SET
        nome = ?,
        preco = ?,
        imagem = ?,
        categoria = ?
        WHERE id = ?
    `;

    conexao.query(

        sql,

        [
            nome,
            preco,
            imagem,
            categoria,
            id
        ],

        (erro) => {

            if(erro){

                console.log(erro);

                res.status(500).send(
                    "Erro ao editar produto"
                );

            }else{

                res.send(
                    "Produto atualizado!"
                );

            }

        }

    );

});

app.post("/pedidos", (req, res) => {

    const {

        cliente,
        telefone,
        endereco,
        produtos,
        total

    } = req.body;

    const sql = `

        INSERT INTO pedidos
        (
            cliente,
            telefone,
            endereco,
            produtos,
            total
        )

        VALUES (?, ?, ?, ?, ?)

    `;

    conexao.query(

        sql,

        [
            cliente,
            telefone,
            endereco,
            produtos,
            total
        ],

        (erro) => {

            if(erro){

                console.log(erro);

                res.status(500).send(
                    "Erro ao salvar pedido"
                );

            }else{

                res.send(
                    "Pedido realizado!"
                );

            }

        }

    );

});

app.get("/pedidos", (req, res) => {

    const sql =
    "SELECT * FROM pedidos ORDER BY id DESC";

    conexao.query(

        sql,

        (erro, resultados) => {

            if(erro){

                console.log(erro);

                res.status(500).send(
                    "Erro ao buscar pedidos"
                );

            }else{

                res.json(resultados);

            }

        }

    );

});

app.put("/pedidos/:id", (req, res) => {

    const { id } = req.params;

    const { status } = req.body;

    const sql = `

        UPDATE pedidos
        SET status_pedido = ?
        WHERE id = ?

    `;

    conexao.query(

        sql,

        [status, id],

        (erro) => {

            if(erro){

                console.log(erro);

                res.status(500).send(
                    "Erro ao atualizar status"
                );

            }else{

                res.send(
                    "Status atualizado!"
                );

            }

        }

    );

});

app.delete("/pedidos/:id", (req, res) => {

    const id = req.params.id;

    const sql =
    "DELETE FROM pedidos WHERE id = ?";

    conexao.query(

        sql,

        [id],

        (erro) => {

            if(erro){

                console.log(erro);

                res.status(500).send(
                    "Erro ao excluir pedido"
                );

            }else{

                res.send(
                    "Pedido excluído!"
                );

            }

        }

    );

});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});