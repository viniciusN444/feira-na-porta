const adminLogado = localStorage.getItem("adminLogado");

if (adminLogado !== "true") {
  window.location.href = "/login";
}

const botaoCadastrar = document.querySelector(".btn-cadastrar");

const listaProdutos = document.getElementById("lista-produtos");

const totalProdutos = document.getElementById("total-produtos");

const totalPedidos = document.getElementById("total-pedidos");

const pedidosPendentes = document.getElementById("pedidos-pendentes");

const valorVendido = document.getElementById("valor-vendido");

const campoBuscaAdm = document.getElementById("campo-busca-adm");

const listaPedidos = document.getElementById("lista-pedidos");

const buscaCliente = document.getElementById("busca-cliente");

const filtroStatus = document.getElementById("filtro-status");

const pedidosPreparo = document.getElementById("pedidos-preparo");

const pedidosEntrega = document.getElementById("pedidos-entrega");

const pedidosEntregues = document.getElementById("pedidos-entregues");

let produtos = [];

let produtoEditando = null;

buscarProdutos();

function buscarProdutos() {
  fetch("/produtos")
    .then((res) => res.json())

    .then((dados) => {
      produtos = dados;

      mostrarProdutos();

      atualizarDashboard();
    });
}

function mostrarProdutos() {
  listaProdutos.innerHTML = "";

  produtos.forEach((produto) => {
    const card = document.createElement("div");

    card.classList.add("card", "p-3", "mb-3");

    card.classList.add("card-produto-adm", "p-3");

    card.innerHTML = `

            <img
            src="${produto.imagem}"
            class="imagem-produto-adm">

            <h5 class="nome-produto-adm">
                ${produto.nome}
            </h5>

            <p class="preco-produto-adm">
                ${produto.preco}
            </p>

            <p class="categoria-produto-adm">
                ${produto.categoria}
            </p>

            <div class="d-flex gap-2 mt-2">

                <button
                class="btn btn-warning btn-editar">

                    Editar

                </button>

                <button
                class="btn btn-danger btn-remover">

                    Remover

                </button>

            </div>

        `;

    listaProdutos.appendChild(card);

    const botaoRemover = card.querySelector(".btn-remover");

    const botaoEditar = card.querySelector(".btn-editar");

    botaoEditar.addEventListener("click", () => {
      document.getElementById("nome-produto").value = produto.nome;

      document.getElementById("preco-produto").value = produto.preco;

      document.getElementById("categoria-produto").value = produto.categoria;

      produtoEditando = produto.id;
    });

    botaoRemover.addEventListener("click", () => {
      fetch(`/produtos/${produto.id}`, {
        method: "DELETE",
      })
        .then((res) => res.text())

        .then((dados) => {
          console.log(dados);

          buscarProdutos();
        });
    });
  });
}

botaoCadastrar.addEventListener("click", () => {
  const nome = document.getElementById("nome-produto").value;

  const preco = document.getElementById("preco-produto").value;

  const categoria = document.getElementById("categoria-produto").value;

  const arquivoImagem = document.getElementById("imagem-produto").files[0];

  // EDITANDO SEM TROCAR IMAGEM
  if (produtoEditando && !arquivoImagem) {
    const produtoAtual = produtos.find(
      (produto) => produto.id === produtoEditando,
    );

    atualizarProduto(nome, preco, produtoAtual.imagem, categoria);

    return;
  }

  // CADASTRO NORMAL
  if (!arquivoImagem) {
    alert("Selecione uma imagem!");

    return;
  }

  const leitor = new FileReader();

  leitor.readAsDataURL(arquivoImagem);

  leitor.onload = () => {
    const imagem = leitor.result;

    atualizarProduto(nome, preco, imagem, categoria);
  };
});

function atualizarProduto(nome, preco, imagem, categoria) {
  const url = produtoEditando ? `/produtos/${produtoEditando}` : "/produtos";

  const metodo = produtoEditando ? "PUT" : "POST";

  fetch(url, {
    method: metodo,

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      nome,
      preco,
      imagem,
      categoria,
    }),
  })
    .then((res) => res.text())

    .then((dados) => {
      console.log(dados);

      buscarProdutos();

      produtoEditando = null;

      document.getElementById("nome-produto").value = "";

      document.getElementById("preco-produto").value = "";

      document.getElementById("categoria-produto").value = "";

      document.getElementById("imagem-produto").value = "";
    });
}

campoBuscaAdm.addEventListener(
  "input",

  () => {
    const valorBusca = campoBuscaAdm.value.toLowerCase();

    const produtosFiltrados = produtos.filter((produto) =>
      produto.nome.toLowerCase().includes(valorBusca),
    );

    listaProdutos.innerHTML = "";

    produtosFiltrados.forEach((produto) => {
      const card = document.createElement("div");

      card.classList.add("card-produto-adm", "p-3");

      card.innerHTML = `

                <img
                src="${produto.imagem}"
                class="imagem-produto-adm">

                <h5 class="nome-produto-adm">
                    ${produto.nome}
                </h5>

                <p class="preco-produto-adm">
                    ${produto.preco}
                </p>

                <p class="categoria-produto-adm">
                    ${produto.categoria}
                </p>

                <div class="d-flex gap-2 mt-2">

                    <button
                    class="btn btn-warning btn-editar">

                        Editar

                    </button>

                    <button
                    class="btn btn-danger btn-remover">

                        Remover

                    </button>

                </div>

            `;

      listaProdutos.appendChild(card);
    });
  },
);

buscarPedidos();

function buscarPedidos() {
  fetch("/pedidos")
    .then((res) => res.json())

    .then((pedidos) => {
      const textoBusca = buscaCliente.value.toLowerCase();

      const statusSelecionado = filtroStatus.value;

      listaPedidos.innerHTML = "";

      const pedidosFiltrados = pedidos.filter((pedido) => {
        const clienteOk = pedido.cliente.toLowerCase().includes(textoBusca);

        const statusOk =
          statusSelecionado === "Todos" ||
          pedido.status_pedido === statusSelecionado;

        return clienteOk && statusOk;
      });

      if (pedidosFiltrados.length === 0) {

    listaPedidos.innerHTML = `

        <div class="alert alert-warning">

            Nenhum pedido encontrado.

        </div>

    `;

    return;

}

      pedidosFiltrados.forEach((pedido) => {
        const card = document.createElement("div");

        card.classList.add("card", "p-3", "mb-3");

        card.innerHTML = `

                <h4>
                    Pedido #${pedido.id}
                </h4>

                <p>
                    <strong>Cliente:</strong>
                    ${pedido.cliente}
                </p>

                <p>
                    <strong>Telefone:</strong>
                    ${pedido.telefone}
                </p>

                <p>
                    <strong>Endereço:</strong>
                    ${pedido.endereco}
                </p>

                <p>
                    <strong>Total:</strong>
                    R$ ${pedido.total}
                </p>

                <p>

                    <strong>Data:</strong>

                    ${new Date(pedido.data_pedido).toLocaleString("pt-BR")}

                </p>

                <p>

                    <strong>Status:</strong>

                    <span class="status-pedido">

                        ${pedido.status_pedido}

                    </span>

                </p>

                <p>
                    <strong>Produtos:</strong>
                </p>

                <div class="lista-produtos-pedido">

                    ${JSON.parse(pedido.produtos)

                      .map(
                        (produto) => `

                            <div class="produto-pedido-item">

                                🛒 ${produto.nome}
                                - ${produto.quantidade}x

                            </div>

                        `,
                      )

                      .join("")}

                </div>

                <select
                class="form-select mt-3 seletor-status">

                    <option value="Pendente">
                        Pendente
                    </option>

                    <option value="Em preparo">
                        Em preparo
                    </option>

                    <option value="Saiu para entrega">
                        Saiu para entrega
                    </option>

                    <option value="Entregue">
                        Entregue
                    </option>

                </select>

                <button
                class="btn btn-success mt-2 btn-status">

                    Atualizar Status

                </button>

                <button
                class="btn btn-danger mt-2 btn-excluir-pedido">

                Excluir Pedido

                </button>

            `;

        listaPedidos.appendChild(card);

        const statusPedido = card.querySelector(".status-pedido");

        if (pedido.status_pedido === "Pendente") {
          statusPedido.classList.add("status-pendente");
        }

        if (pedido.status_pedido === "Em preparo") {
          statusPedido.classList.add("status-preparo");
        }

        if (pedido.status_pedido === "Saiu para entrega") {
          statusPedido.classList.add("status-entrega");
        }

        if (pedido.status_pedido === "Entregue") {
          statusPedido.classList.add("status-entregue");
        }

        const seletorStatus = card.querySelector(".seletor-status");

        seletorStatus.value = pedido.status_pedido;

        const botaoStatus = card.querySelector(".btn-status");

        const botaoExcluirPedido = card.querySelector(".btn-excluir-pedido");

        botaoExcluirPedido.addEventListener(
          "click",

          () => {
            const confirmar = confirm("Deseja realmente excluir este pedido?");

            if (!confirmar) {
              return;
            }

            fetch(
              `/pedidos/${pedido.id}`,

              {
                method: "DELETE",
              },
            )
              .then((res) => res.text())

              .then((dados) => {
                console.log(dados);

                buscarPedidos();

                atualizarDashboard();
              });
          },
        );

        botaoStatus.addEventListener(
          "click",

          () => {
            fetch(
              `/pedidos/${pedido.id}`,

              {
                method: "PUT",

                headers: {
                  "Content-Type": "application/json",
                },

                body: JSON.stringify({
                  status: seletorStatus.value,
                }),
              },
            )
              .then((res) => res.text())

              .then((dados) => {
                console.log(dados);

                buscarPedidos();
              });
          },
        );
      });

      atualizarDashboard();
    });
}

function atualizarDashboard() {
  fetch("/produtos")
    .then((res) => res.json())

    .then((produtos) => {
      totalProdutos.textContent = produtos.length;
    });

  fetch("/pedidos")
    .then((res) => res.json())

    .then((pedidos) => {
      totalPedidos.textContent = pedidos.length;

      const pendentes = pedidos.filter(
        (pedido) => pedido.status_pedido === "Pendente",
      );

      const preparo = pedidos.filter(
        (pedido) => pedido.status_pedido === "Em preparo",
      );

      const entrega = pedidos.filter(
        (pedido) => pedido.status_pedido === "Saiu para entrega",
      );

      const entregues = pedidos.filter(
        (pedido) => pedido.status_pedido === "Entregue",
      );

      pedidosPendentes.textContent = pendentes.length;

      pedidosPreparo.textContent = preparo.length;

      pedidosEntrega.textContent = entrega.length;

      pedidosEntregues.textContent = entregues.length;

      let totalVendas = 0;

      pedidos.forEach((pedido) => {
        totalVendas += Number(pedido.total);
      });

      valorVendido.textContent = `R$ ${totalVendas.toFixed(2)}`;
    });
}

atualizarDashboard();

filtroStatus.addEventListener(
  "change",

  () => {
    buscarPedidos();
  },
);

buscaCliente.addEventListener(
  "input",

  () => {
    buscarPedidos();
  },
);

const botaoLogout = document.getElementById("btn-logout");

botaoLogout.addEventListener("click", () => {
  localStorage.removeItem("adminLogado");

  window.location.href = "/login";
});
