// Sistema de Loja - Demo

function adicionarCarrinho(produto, preco) {
    // Mostrar toast de sucesso
    mostrarToast(`${produto} adicionado ao carrinho!`);
    
    // Salvar no localStorage (apenas para demonstração)
    let carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
    
    carrinho.push({
        produto: produto,
        preco: preco,
        data: new Date().toISOString()
    });
    
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    
    // Atualizar contador
    atualizarContadorCarrinho();
    
    console.log('Produto adicionado:', produto, 'R$', preco.toFixed(2));
}

function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
    const countElement = document.getElementById('carrinhoCount');
    if (countElement) {
        countElement.textContent = carrinho.length;
    }
}

function abrirCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
    
    if (carrinho.length === 0) {
        mostrarToast('Seu carrinho está vazio!');
        return;
    }
    
    let total = 0;
    let itensHTML = carrinho.map((item, index) => {
        total += item.preco;
        return `
            <div class="carrinho-item">
                <div>
                    <strong>${item.produto}</strong>
                    <p>R$ ${item.preco.toFixed(2)}</p>
                </div>
                <button onclick="removerDoCarrinho(${index})" class="btn-remover">✕</button>
            </div>
        `;
    }).join('');
    
    const modal = document.createElement('div');
    modal.className = 'modal-carrinho';
    modal.innerHTML = `
        <div class="modal-carrinho-content">
            <div class="modal-carrinho-header">
                <h2>Meu Carrinho</h2>
                <button onclick="fecharCarrinho()" class="btn-fechar">✕</button>
            </div>
            <div class="modal-carrinho-body">
                ${itensHTML}
            </div>
            <div class="modal-carrinho-footer">
                <div class="total">
                    <strong>Total:</strong>
                    <strong>R$ ${total.toFixed(2)}</strong>
                </div>
                <button onclick="limparCarrinho()" class="btn-limpar">Limpar Carrinho</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
}

function fecharCarrinho() {
    const modal = document.querySelector('.modal-carrinho');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

function removerDoCarrinho(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    
    atualizarContadorCarrinho();
    fecharCarrinho();
    
    if (carrinho.length > 0) {
        setTimeout(() => abrirCarrinho(), 100);
    } else {
        mostrarToast('Carrinho vazio!');
    }
}

function limparCarrinho() {
    localStorage.setItem('carrinho', '[]');
    atualizarContadorCarrinho();
    fecharCarrinho();
    mostrarToast('Carrinho limpo!');
}

function mostrarToast(mensagem) {
    // Criar elemento do toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7.75 12L10.58 14.83L16.25 9.17" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>${mensagem}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Remover após 3 segundos
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loja carregada');
    atualizarContadorCarrinho();
    
    // Contar itens no carrinho
    const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
    console.log(`Itens no carrinho: ${carrinho.length}`);
});
