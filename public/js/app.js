let mensagemPedido = "";

let carrinho = [];

const containerCarrinho = document.getElementById("itens-carrinho");

const subtotalCarrinho = document.getElementById("subtotal-carrinho");

const totalFinal = document.getElementById("total-final");

const freteCarrinho = document.getElementById("frete-carrinho");

const botaoFinalizar = document.querySelector(".finalizar-btn");

const campoBusca = document.getElementById("campo-busca");

const categorias = document.querySelectorAll(".categoria-item");

const areaProdutos = document.getElementById("area-produtos");

const botaoMaisModal = document.getElementById("btn-mais-modal");

const botaoMenosModal = document.getElementById("btn-menos-modal");

const botaoContinuar = document.getElementById("continuar-comprando");

const botaoIrCarrinho = document.getElementById("abrir-carrinho");

const quantidadeModal = document.getElementById("quantidade-modal");

const modalAdicionado = document.getElementById("modal-adicionado");

const nomeProdutoModal = document.getElementById("nome-produto-modal");

let produtoSelecionado = null;

let total = 0;

const pedidoMinimo = 50;

const valorFrete = 15;

const carrinhoSalvo = localStorage.getItem("carrinho");

if (carrinhoSalvo) {
  carrinho = JSON.parse(carrinhoSalvo);
}

carrinho.forEach((produto) => {
  total += produto.preco * produto.quantidade;
});

function atualizarCarrinho() {
  containerCarrinho.innerHTML = "";

  mensagemPedido = "";

  subtotalCarrinho.textContent = `Subtotal: R$ ${total.toFixed(2)}`;

  carrinho.forEach((produto) => {
    const item = document.createElement("div");

    item.classList.add("item-carrinho");

    item.innerHTML = `

            <span>
                ${produto.nome} x${produto.quantidade}
            </span>

            <button class="btn-remover">
                ❌
            </button>

        `;

    containerCarrinho.appendChild(item);

    mensagemPedido += `${produto.nome} x${produto.quantidade} - R$ ${(produto.preco * produto.quantidade).toFixed(2)}%0A`;

    const botaoRemover = item.querySelector(".btn-remover");

    botaoRemover.addEventListener("click", () => {
      produto.quantidade--;

      total -= produto.preco;

      if (produto.quantidade <= 0) {
        carrinho = carrinho.filter((item) => item.nome !== produto.nome);
      }

      atualizarCarrinho();
    });
  });

  if (total < pedidoMinimo) {
    botaoFinalizar.disabled = true;

    botaoFinalizar.textContent = `Pedido mínimo R$ ${pedidoMinimo}`;

    freteCarrinho.textContent = "Frete: R$ 0,00";

    totalFinal.textContent = `Total: R$ ${total.toFixed(2)}`;
  } else {
    botaoFinalizar.disabled = false;

    botaoFinalizar.textContent = "Finalizar pedido";

    freteCarrinho.textContent = `Frete: R$ ${valorFrete.toFixed(2)}`;

    const totalComFrete = total + valorFrete;

    totalFinal.textContent = `Total: R$ ${totalComFrete.toFixed(2)}`;
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

atualizarCarrinho();

function ativarBotoesAdicionar() {
  const botoesAdicionar = document.querySelectorAll(".btn-adicionar");

  botoesAdicionar.forEach((botao) => {
    botao.addEventListener("click", () => {
      const card = botao.parentElement;

      const nome = card.querySelector(".nome-produto").textContent;

      const precoTexto = card.querySelector(".valor-produto").textContent;

      const preco = parseFloat(
        precoTexto

          .replace("R$", "")

          .replace("/kg", "")

          .replace("Maço", "")

          .replace("/gm", "")

          .replace(",", "."),
      );

      const produtoExistente = carrinho.find(
        (produto) => produto.nome === nome,
      );

      produtoSelecionado = {
        nome,
        preco,
      };

      nomeProdutoModal.textContent = `✅ ${nome}`;

      nomeProdutoModal.textContent = `Adicionar ${nome} ao carrinho?`;

      quantidadeModal.textContent = 0;

      modalAdicionado.style.display = "flex";
    });
  });
}

function carregarProdutos() {
  fetch("/produtos")
    .then((res) => res.json())

    .then((produtos) => {
      areaProdutos.innerHTML = "";

      produtos.forEach((produto) => {
        const coluna = document.createElement("div");

        coluna.classList.add(
          "col-12",

          "col-sm-6",

          "col-md-3",
        );

        coluna.innerHTML = `

                <div
                class="card produto-card"
                data-categoria="${produto.categoria}">

                    <img
                    src="${produto.imagem}"
                    class="card-img-top">

                    <div class="card-body">

                        <h5 class="card-title nome-produto">
                            ${produto.nome}
                        </h5>

                        <p class="preco valor-produto">
                            ${produto.preco}
                        </p>

                        <button
                        class="btn btn-adicionar">

                            Adicionar

                        </button>

                    </div>

                </div>

            `;

        areaProdutos.appendChild(coluna);
      });

      ativarBotoesAdicionar();
    });
}

campoBusca.addEventListener("input", () => {
  const valorBusca = campoBusca.value.toLowerCase();

  const cardsProdutos = document.querySelectorAll(".produto-card");

  cardsProdutos.forEach((card) => {
    const nomeProduto = card
      .querySelector(".nome-produto")
      .textContent.toLowerCase();

    if (nomeProduto.includes(valorBusca)) {
      card.parentElement.style.display = "block";
    } else {
      card.parentElement.style.display = "none";
    }
  });
});

categorias.forEach((categoria) => {
  categoria.addEventListener("click", () => {
    const categoriaSelecionada = categoria.dataset.categoria;

    const cardsProdutos = document.querySelectorAll(".produto-card");

    cardsProdutos.forEach((card) => {
      const categoriaCard = card.dataset.categoria;

      if (
        categoriaSelecionada === "todos" ||
        categoriaCard === categoriaSelecionada
      ) {
        card.parentElement.style.display = "block";
      } else {
        card.parentElement.style.display = "none";
      }
    });
  });
});

botaoFinalizar.addEventListener("click", () => {
  const nomeCliente = prompt("Digite seu nome:");

  const telefone = prompt("Digite seu telefone:");

  const endereco = prompt("Digite seu endereço:");

  if (!nomeCliente || !telefone || !endereco) {
    alert("Preencha todos os dados!");

    return;
  }

  const totalComFrete = total + valorFrete;

  fetch("/pedidos", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      cliente: nomeCliente,

      telefone,

      endereco,

      produtos: JSON.stringify(carrinho),

      total: totalComFrete,
    }),
  })
    .then((res) => res.text())

    .then((dados) => {
      alert("Pedido realizado com sucesso!");

      carrinho = [];

      total = 0;

      atualizarCarrinho();
    });
});

carregarProdutos();

console.log("Mais:", botaoMaisModal);
console.log("Menos:", botaoMenosModal);
console.log("Continuar:", botaoContinuar);
console.log("Carrinho:", botaoIrCarrinho);
console.log("Quantidade:", quantidadeModal);
console.log("Modal:", modalAdicionado);
console.log("Nome:", nomeProdutoModal);

botaoMaisModal.addEventListener("click", () => {
  quantidadeModal.textContent = Number(quantidadeModal.textContent) + 1;
});

botaoMenosModal.addEventListener("click", () => {
  const quantidadeAtual = Number(quantidadeModal.textContent);

  if (quantidadeAtual > 1) {
    quantidadeModal.textContent = quantidadeAtual - 1;
  }
});

botaoContinuar.addEventListener("click", () => {
  const quantidade = Number(quantidadeModal.textContent);

  if (quantidade <= 0) {
    alert("Selecione uma quantidade!");

    return;
  }

  const produtoExistente = carrinho.find(
    (produto) => produto.nome === produtoSelecionado.nome,
  );

  if (produtoExistente) {
    produtoExistente.quantidade += quantidade;
  } else {
    carrinho.push({
      nome: produtoSelecionado.nome,

      preco: produtoSelecionado.preco,

      quantidade,
    });
  }

  total += produtoSelecionado.preco * quantidade;

  atualizarCarrinho();

  modalAdicionado.style.display = "none";
});

botaoIrCarrinho.addEventListener("click", () => {
  botaoContinuar.click();

  const offcanvas = new bootstrap.Offcanvas(
    document.getElementById("carrinhoLateral"),
  );

  offcanvas.show();
});

if (
  !botaoMaisModal ||
  !botaoMenosModal ||
  !botaoContinuar ||
  !botaoIrCarrinho
) {
  console.error("Algum botão do modal não foi encontrado.");
}
