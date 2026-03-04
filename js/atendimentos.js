// ===== SISTEMA DE GERENCIAMENTO DE ATENDIMENTOS (LOCALSTORAGE) =====

let filtroAtual = 'todos';
let agendamentoParaAcao = null;

// Carregar atendimentos ao iniciar a página
document.addEventListener('DOMContentLoaded', function() {
    carregarAtendimentos();
});

// ===== CARREGAR ATENDIMENTOS DO LOCALSTORAGE =====
function carregarAtendimentos() {
    const loading = document.getElementById('loading-atendimentos');
    loading.style.display = 'block';
    
    setTimeout(() => {
        const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
        
        // Ordenar por data (mais recentes primeiro)
        agendamentos.sort((a, b) => {
            const dataA = new Date(a.data + ' ' + a.horario);
            const dataB = new Date(b.data + ' ' + b.horario);
            return dataB - dataA;
        });
        
        renderizarAtendimentos(agendamentos);
        loading.style.display = 'none';
    }, 300);
}

// ===== RENDERIZAR ATENDIMENTOS NA TELA =====
function renderizarAtendimentos(agendamentos) {
    const container = document.getElementById('atendimentos-lista');
    container.innerHTML = '';
    
    // Filtrar agendamentos conforme filtro ativo
    let agendamentosFiltrados = agendamentos;
    
    if (filtroAtual !== 'todos') {
        agendamentosFiltrados = agendamentos.filter(ag => {
            if (filtroAtual === 'proximos') {
                return ag.status === 'Confirmado' && isDataFutura(ag.data, ag.horario);
            } else if (filtroAtual === 'concluidos') {
                return ag.status === 'Concluído';
            } else if (filtroAtual === 'cancelados') {
                return ag.status === 'Cancelado';
            }
            return true;
        });
    }
    
    if (agendamentosFiltrados.length === 0) {
        container.innerHTML = `
            <div class="sem-atendimentos">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <p>Nenhum agendamento encontrado</p>
                <p class="subtexto">Faça seu primeiro agendamento!</p>
            </div>
        `;
        return;
    }
    
    agendamentosFiltrados.forEach(agendamento => {
        const card = criarCardAtendimento(agendamento);
        container.appendChild(card);
    });
}

// ===== CRIAR CARD DE ATENDIMENTO =====
function criarCardAtendimento(agendamento) {
    const div = document.createElement('div');
    
    // Determinar o tipo de status
    let statusClass = agendamento.status.toLowerCase().replace(' ', '-');
    const estaFuturo = isDataFutura(agendamento.data, agendamento.horario);
    
    if (agendamento.status === 'Confirmado') {
        statusClass = estaFuturo ? 'proximo' : 'concluido';
    }
    
    div.className = `atendimento-card ${statusClass}`;
    
    // Formatar data para exibição
    const [ano, mes, dia] = agendamento.data.split('-');
    const dataFormatada = `${dia}/${mes}/${ano}`;
    
    // Dia da semana
    const dataObj = new Date(ano, mes - 1, dia);
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const diaSemana = diasSemana[dataObj.getDay()];
    
    div.innerHTML = `
        <span class="status-badge status-${statusClass}">${agendamento.status}</span>
        
        <div class="card-header">
            <div class="data-info">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>${diaSemana}, ${dataFormatada}</span>
            </div>
        </div>
        
        <div class="card-body">
            <div class="info-row">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <strong>${agendamento.horario}</strong>
            </div>
            
            <div class="info-row">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Barbeiro: <strong>${agendamento.profissional}</strong></span>
            </div>
            
            <div class="info-row">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
                <span>${agendamento.servico} - <strong>${agendamento.preco}</strong></span>
            </div>
        </div>
        
        <div class="card-actions">
            ${agendamento.status === 'Confirmado' && estaFuturo ? `
                <button class="btn-action btn-cancelar" onclick="abrirModalCancelar(${agendamento.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    Cancelar
                </button>
                <button class="btn-action btn-reagendar" onclick="editarAgendamento(${agendamento.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Editar
                </button>
            ` : ''}
            
            ${agendamento.status === 'Cancelado' ? `
                <button class="btn-action" style="background: #dc3545; color: white;" onclick="excluirAgendamento(${agendamento.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Excluir
                </button>
            ` : ''}
        </div>
    `;
    
    return div;
}

// ===== VERIFICAR SE A DATA É FUTURA =====
function isDataFutura(data, horario) {
    const agora = new Date();
    const dataAgendamento = new Date(data + ' ' + horario);
    return dataAgendamento > agora;
}

// ===== FILTRAR ATENDIMENTOS =====
function filtrarAtendimentos(filtro) {
    filtroAtual = filtro;
    
    // Atualizar botões de filtro
    document.querySelectorAll('.btn-filtro').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Recarregar atendimentos com o filtro
    carregarAtendimentos();
}

// ===== MODAL DE CONFIRMAÇÃO =====
function abrirModalCancelar(id) {
    agendamentoParaAcao = id;
    const modal = document.getElementById('modalConfirmacao');
    const titulo = document.getElementById('modalTitulo');
    const mensagem = document.getElementById('modalMensagem');
    const btnConfirmar = document.getElementById('btnConfirmarAcao');
    
    titulo.textContent = 'Cancelar Agendamento';
    mensagem.textContent = 'Tem certeza que deseja cancelar este agendamento? Esta ação não poderá ser desfeita.';
    
    // Remover event listeners antigos
    const btnNovo = btnConfirmar.cloneNode(true);
    btnConfirmar.parentNode.replaceChild(btnNovo, btnConfirmar);
    
    // Adicionar novo event listener
    document.getElementById('btnConfirmarAcao').addEventListener('click', () => {
        cancelarAgendamento(id);
        fecharModal();
    });
    
    modal.style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modalConfirmacao').style.display = 'none';
    agendamentoParaAcao = null;
}

// ===== CANCELAR AGENDAMENTO =====
function cancelarAgendamento(id) {
    let agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    
    const index = agendamentos.findIndex(ag => ag.id === id);
    if (index !== -1) {
        agendamentos[index].status = 'Cancelado';
        localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
        
        // Mostrar feedback
        mostrarToast('Agendamento cancelado com sucesso!');
        
        // Recarregar lista
        carregarAtendimentos();
    }
}

// ===== EXCLUIR AGENDAMENTO =====
function excluirAgendamento(id) {
    if (!confirm('Deseja realmente excluir este agendamento do histórico?')) {
        return;
    }
    
    let agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    agendamentos = agendamentos.filter(ag => ag.id !== id);
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
    
    mostrarToast('Agendamento excluído do histórico!');
    carregarAtendimentos();
}

// ===== EDITAR AGENDAMENTO =====
function editarAgendamento(id) {
    // Salvar ID do agendamento para edição
    localStorage.setItem('editarAgendamentoId', id);
    
    // Redirecionar para página de agendamento
    window.location.href = 'agendamento.html?editar=' + id;
}

// ===== TOAST DE FEEDBACK =====
function mostrarToast(mensagem) {
    // Criar elemento de toast
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = mensagem;
    
    document.body.appendChild(toast);
    
    // Remover após 3 segundos
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}
