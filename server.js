const express = require('express');
const conexao = require("./config/db");

const app = express();

/* =========================
   MIDDLEWARES
========================= */
app.use(express.static('public'));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

/* =========================
   ROTAS PÁGINAS
========================= */
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get("/adm", (req, res) => {
    res.sendFile(__dirname + "/views/adm.html");
});

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/views/login.html");
});

/* =========================
   PRODUTOS
========================= */

app.post("/produtos", (req, res) => {

    const { nome, preco, imagem, categoria } = req.body;

    const sql = `
        INSERT INTO produtos
        (nome, preco, imagem, categoria)
        VALUES (?, ?, ?, ?)
    `;

    conexao.query(sql, [nome, preco, imagem, categoria], (erro) => {

        if (erro) {
            console.log(erro);
            return res.status(500).send("Erro ao cadastrar produto");
        }

        res.status(201).send("Produto cadastrado!");
    });
});

app.get("/produtos", (req, res) => {

    const sql = "SELECT * FROM produtos";

    conexao.query(sql, (erro, resultados) => {

        if (erro) {
            console.log(erro);
            return res.status(500).send("Erro ao buscar produtos");
        }

        res.json(resultados);
    });
});

app.delete("/produtos/:id", (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM produtos WHERE id = ?";

    conexao.query(sql, [id], (erro) => {

        if (erro) {
            console.log(erro);
            return res.status(500).send("Erro ao remover produto");
        }

        res.send("Produto removido!");
    });
});

app.put("/produtos/:id", (req, res) => {

    const { id } = req.params;
    const { nome, preco, imagem, categoria } = req.body;

    const sql = `
        UPDATE produtos
        SET nome = ?, preco = ?, imagem = ?, categoria = ?
        WHERE id = ?
    `;

    conexao.query(sql, [nome, preco, imagem, categoria, id], (erro) => {

        if (erro) {
            console.log(erro);
            return res.status(500).send("Erro ao editar produto");
        }

        res.send("Produto atualizado!");
    });
});

/* =========================
   PEDIDOS
========================= */

app.post("/pedidos", (req, res) => {

    const { cliente, telefone, endereco, produtos, total } = req.body;

    const sql = `
        INSERT INTO pedidos
        (cliente, telefone, endereco, produtos, total)
        VALUES (?, ?, ?, ?, ?)
    `;

    conexao.query(sql, [cliente, telefone, endereco, produtos, total], (erro) => {

        if (erro) {
            console.log(erro);
            return res.status(500).send("Erro ao salvar pedido");
        }

        res.send("Pedido realizado!");
    });
});

app.get("/pedidos", (req, res) => {

    const sql = "SELECT * FROM pedidos ORDER BY id DESC";

    conexao.query(sql, (erro, resultados) => {

        if (erro) {
            console.log(erro);
            return res.status(500).send("Erro ao buscar pedidos");
        }

        res.json(resultados);
    });
});

app.put("/pedidos/:id", (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    const sql = `
        UPDATE pedidos
        SET status_pedido = ?
        WHERE id = ?
    `;

    conexao.query(sql, [status, id], (erro) => {

        if (erro) {
            console.log(erro);
            return res.status(500).send("Erro ao atualizar status");
        }

        res.send("Status atualizado!");
    });
});

app.delete("/pedidos/:id", (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM pedidos WHERE id = ?";

    conexao.query(sql, [id], (erro) => {

        if (erro) {
            console.log(erro);
            return res.status(500).send("Erro ao excluir pedido");
        }

        res.send("Pedido excluído!");
    });
});

/* =========================
   PORTA (OBRIGATÓRIO RENDER)
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});