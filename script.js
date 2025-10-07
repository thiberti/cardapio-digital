// Array para guardar os itens do carrinho
let carrinho = [];

// Função para adicionar item ao carrinho
function adicionarAoCarrinho(nome, preco) {
    // Verifica se o item já está no carrinho
    const itemExistente = carrinho.find(item => item.nome === nome);

    if (itemExistente) {
        // Se já existe, aumenta a quantidade
        itemExistente.quantidade++;
    } else {
        // Se não existe, adiciona novo item
        carrinho.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }

    atualizarCarrinho();
}

// Função para remover item do carrinho
function removerDoCarrinho(nome) {
    carrinho = carrinho.filter(item => item.nome !== nome);
    atualizarCarrinho();
}

// Função para alterar quantidade
function alterarQuantidade(nome, mudanca) {
    const item = carrinho.find(item => item.nome === nome);
    if (item) {
        item.quantidade += mudanca;
        if (item.quantidade <= 0) {
            removerDoCarrinho(nome);
        } else {
            atualizarCarrinho();
        }
    }
}

// Função para atualizar a exibição do carrinho
function atualizarCarrinho() {
    const listaCarrinho = document.getElementById('listaCarrinho');
    const badgeCarrinho = document.getElementById('badgeCarrinho');
    const valorTotal = document.getElementById('valorTotal');

    // Limpa a lista
    listaCarrinho.innerHTML = '';

    if (carrinho.length === 0) {
        listaCarrinho.innerHTML = '<div class="carrinho-vazio">Seu carrinho está vazio</div>';
        badgeCarrinho.classList.add('oculto');
        valorTotal.textContent = 'R$ 0,00';
        return;
    }

    // Calcula total de itens e valor
    let totalItens = 0;
    let totalValor = 0;

    // Adiciona cada item na lista
    carrinho.forEach(item => {
        totalItens += item.quantidade;
        totalValor += item.preco * item.quantidade;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-carrinho';
        itemDiv.innerHTML =
            '<div class="item-header">' +
            '<span class="item-nome">' + item.nome + '</span>' +
            '<button class="botao-remover" onclick="removerDoCarrinho(\'' + item.nome + '\')">Remover</button>' +
            '</div>' +
            '<div class="item-footer">' +
            '<div class="controles-quantidade">' +
            '<button class="botao-quantidade" onclick="alterarQuantidade(\'' + item.nome + '\', -1)">−</button>' +
            '<span>' + item.quantidade + '</span>' +
            '<button class="botao-quantidade" onclick="alterarQuantidade(\'' + item.nome + '\', 1)">+</button>' +
            '</div>' +
            '<span class="item-preco">R$ ' + (item.preco * item.quantidade).toFixed(2).replace('.', ',') + '</span>' +
            '</div>';
        listaCarrinho.appendChild(itemDiv);
    });

    // Atualiza badge e total
    badgeCarrinho.textContent = totalItens;
    badgeCarrinho.classList.remove('oculto');
    valorTotal.textContent = 'R$ ' + totalValor.toFixed(2).replace('.', ',');
}

// Função para abrir o carrinho
function abrirCarrinho() {
    document.getElementById('modalCarrinho').classList.add('ativo');
}

// Função para fechar o carrinho
function fecharCarrinho() {
    document.getElementById('modalCarrinho').classList.remove('ativo');
}

// Função para enviar pedido pelo WhatsApp
function enviarPedidoWhatsApp() {
    const nomeUsuario = document.getElementById('nomeUsuario').value.trim();

    if (!nomeUsuario) {
        alert('Por favor, informe seu nome antes de enviar o pedido!');
        return;
    }

    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    // Monta a mensagem
    let mensagem = `*Pedido - ${nomeUsuario}*\n\n`;
    let total = 0;

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
        mensagem += `• ${item.quantidade}x ${item.nome}\n`;
        mensagem += `  R$ ${subtotal.toFixed(2).replace('.', ',')}\n\n`;
    });

    mensagem += `*Total: R$ ${total.toFixed(2).replace('.', ',')}*`;

    // Número do WhatsApp do restaurante
    const numeroWhatsApp = '5511963537103';

    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhatsApp, '_blank');
}