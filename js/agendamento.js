// ===== SISTEMA DE AGENDAMENTO COM LOCALSTORAGE =====

// ===== CONTROLE DE POPUPS =====
function abrirPopupBarbeiro() {
    document.getElementById('popupBarbeiro').classList.add('show');
}

function abrirPopupServico() {
    document.getElementById('popupServico').classList.add('show');
}

function abrirPopupData() {
    document.getElementById('popupData').classList.add('show');
    renderizarCalendario();
}

function abrirPopupHorario() {
    const data = document.getElementById('data-hidden').value;
    const profissional = document.getElementById('profissional-hidden').value;
    
    if (!data) {
        mostrarErro('Por favor, selecione uma data primeiro!');
        return;
    }
    
    if (!profissional) {
        mostrarErro('Por favor, selecione um barbeiro primeiro!');
        return;
    }
    
    document.getElementById('popupHorario').classList.add('show');
    carregarHorariosDisponiveis(data, profissional);
}

function fecharPopup(popupId) {
    document.getElementById(popupId).classList.remove('show');
}

// ===== SELEÇÃO DE BARBEIRO =====
function selecionarBarbeiro(nome, cardElement) {
    // Remove seleção anterior
    document.querySelectorAll('.barbeiro-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Marca como selecionado
    (cardElement || window.event?.currentTarget)?.classList.add('selected');
    
    // Atualiza input hidden
    document.getElementById('profissional-hidden').value = nome;
    
    // Atualiza texto do campo
    document.getElementById('barbeiroSelecionado').textContent = nome;
    document.getElementById('btnBarbeiro').classList.add('preenchido');
    
    // Fecha o popup após delay
    setTimeout(() => {
        fecharPopup('popupBarbeiro');
    }, 500);
    
    // Se data já está selecionada, recarregar horários
    const data = document.getElementById('data-hidden').value;
    if (data) {
        carregarHorariosDisponiveis(data, nome);
    }
}

// ===== SELEÇÃO DE SERVIÇO =====
function selecionarServico(nome, preco, itemElement) {
    // Remove seleção anterior
    document.querySelectorAll('.servico-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Marca como selecionado
    (itemElement || window.event?.currentTarget)?.classList.add('selected');
    
    // Atualiza inputs hidden
    document.getElementById('servico-hidden').value = nome;
    document.getElementById('preco-hidden').value = preco;
    
    // Atualiza texto do campo
    document.getElementById('servicoSelecionado').textContent = `${nome} - ${preco}`;
    document.getElementById('btnServico').classList.add('preenchido');
    
    // Fecha o popup após delay
    setTimeout(() => {
        fecharPopup('popupServico');
    }, 500);
}

// ===== CALENDÁRIO =====
let mesAtual = new Date().getMonth();
let anoAtual = new Date().getFullYear();
let dataSelecionadaObj = null;

const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
               'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

function renderizarCalendario() {
    const diasContainer = document.getElementById('calendarioDias');
    const mesAnoTitulo = document.getElementById('mesAno');
    
    mesAnoTitulo.textContent = `${meses[mesAtual]} ${anoAtual}`;
    diasContainer.innerHTML = '';

    const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
    const ultimoDia = new Date(anoAtual, mesAtual + 1, 0).getDate();
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // Dias vazios
    for (let i = 0; i < primeiroDia; i++) {
        const diaVazio = document.createElement('div');
        diaVazio.className = 'dia disabled';
        diasContainer.appendChild(diaVazio);
    }

    // Dias do mês
    for (let dia = 1; dia <= ultimoDia; dia++) {
        const diaElemento = document.createElement('div');
        diaElemento.className = 'dia';
        diaElemento.textContent = dia;

        const dataAtual = new Date(anoAtual, mesAtual, dia);
        dataAtual.setHours(0, 0, 0, 0);

        if (dataAtual < hoje) {
            diaElemento.classList.add('disabled');
        } else {
            if (dataAtual.getTime() === hoje.getTime()) {
                diaElemento.classList.add('today');
            }

            if (dataSelecionadaObj && dataAtual.getTime() === dataSelecionadaObj.getTime()) {
                diaElemento.classList.add('selected');
            }

            diaElemento.addEventListener('click', () => selecionarData(anoAtual, mesAtual, dia));
        }

        diasContainer.appendChild(diaElemento);
    }
}

function selecionarData(ano, mes, dia) {
    const data = new Date(ano, mes, dia);
    dataSelecionadaObj = data;

    // Formatar para exibição
    const dataFormatada = `${dia.toString().padStart(2, '0')}/${(mes + 1).toString().padStart(2, '0')}/${ano}`;
    
    // Formatar para input (YYYY-MM-DD)
    const dataInput = `${ano}-${(mes + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
    
    document.getElementById('data-hidden').value = dataInput;
    document.getElementById('dataSelecionada').textContent = dataFormatada;
    document.getElementById('btnData').classList.add('preenchido');

    // Carregar horários disponíveis se profissional já foi selecionado
    const profissional = document.getElementById('profissional-hidden').value;
    if (profissional) {
        carregarHorariosDisponiveis(dataInput, profissional);
    }

    setTimeout(() => {
        fecharPopup('popupData');
    }, 500);
}

function mesAnterior() {
    if (mesAtual === 0) {
        mesAtual = 11;
        anoAtual--;
    } else {
        mesAtual--;
    }
    
    const hoje = new Date();
    if (anoAtual < hoje.getFullYear() || (anoAtual === hoje.getFullYear() && mesAtual < hoje.getMonth())) {
        mesAtual = hoje.getMonth();
        anoAtual = hoje.getFullYear();
        return;
    }
    
    renderizarCalendario();
}

function proximoMes() {
    if (mesAtual === 11) {
        mesAtual = 0;
        anoAtual++;
    } else {
        mesAtual++;
    }
    renderizarCalendario();
}

// ===== SELEÇÃO DE HORÁRIO =====
function selecionarHorario(hora, element) {
    // Verifica se o horário está ocupado
    if (element.classList.contains('ocupado')) {
        element.style.animation = 'shake 0.3s';
        setTimeout(() => {
            element.style.animation = '';
        }, 300);
        
        mostrarErro('Este horário já está ocupado. Por favor, escolha outro.');
        return;
    }
    
    // Remove seleção anterior
    document.querySelectorAll('.horario-item').forEach(item => {
        item.classList.remove('selected');
    });

    // Marca como selecionado
    element.classList.add('selected');

    // Atualiza input hidden
    document.getElementById('horario-hidden').value = hora;

    // Atualiza texto do campo
    document.getElementById('horarioSelecionado').textContent = hora;
    document.getElementById('btnHorario').classList.add('preenchido');

    // Fecha o popup após delay
    setTimeout(() => {
        fecharPopup('popupHorario');
    }, 500);
}

// ===== CARREGAR HORÁRIOS DISPONÍVEIS (LOCALSTORAGE) =====
function carregarHorariosDisponiveis(data, profissional) {
    // Mostrar loading
    const loadingElement = document.getElementById('loadingHorarios');
    const horariosGrid = document.getElementById('horariosGrid');
    if (loadingElement && horariosGrid) {
        loadingElement.style.display = 'flex';
        horariosGrid.style.opacity = '0.3';
        horariosGrid.style.pointerEvents = 'none';
    }
    
    // Simular delay de carregamento
    setTimeout(() => {
        // Buscar agendamentos do LocalStorage
        const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
        
        // Filtrar horários ocupados para essa data e profissional
        const horariosOcupados = agendamentos
            .filter(ag => ag.data === data && ag.profissional === profissional)
            .map(ag => ag.horario);
        
        // Aplicar na interface
        aplicarHorariosOcupados(horariosOcupados);
        
        // Esconder loading
        if (loadingElement && horariosGrid) {
            loadingElement.style.display = 'none';
            horariosGrid.style.opacity = '1';
            horariosGrid.style.pointerEvents = 'auto';
        }
    }, 500);
}

function aplicarHorariosOcupados(horariosOcupados) {
    const todosHorarios = document.querySelectorAll('.horario-item');
    
    todosHorarios.forEach(item => {
        const horario = item.textContent.trim();
        
        // Remove classes anteriores
        item.classList.remove('ocupado', 'selected');
        item.style.pointerEvents = 'auto';
        
        // Verifica se está ocupado
        const estaOcupado = horariosOcupados.includes(horario);
        
        if (estaOcupado) {
            item.classList.add('ocupado');
            item.style.pointerEvents = 'none';
            item.style.cursor = 'not-allowed';
        } else {
            item.style.cursor = 'pointer';
            item.setAttribute('onclick', `selecionarHorario('${horario}', this)`);
        }
    });
}

// ===== FUNÇÕES AUXILIARES =====
function mostrarErro(mensagem) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    
    errorText.textContent = mensagem;
    errorDiv.classList.add('show');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setTimeout(() => {
        errorDiv.classList.remove('show');
    }, 5000);
}

// ===== VALIDAÇÃO E ENVIO DO FORMULÁRIO =====
document.getElementById('agendamentoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const barbeiro = document.getElementById('profissional-hidden').value;
    const servico = document.getElementById('servico-hidden').value;
    const preco = document.getElementById('preco-hidden').value;
    const data = document.getElementById('data-hidden').value;
    const horario = document.getElementById('horario-hidden').value;
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const submitBtn = this.querySelector('.submit-btn');

    // Validações
    if (!barbeiro) {
        errorText.textContent = 'Por favor, selecione um barbeiro!';
        errorDiv.classList.add('show');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
    }

    if (!servico) {
        errorText.textContent = 'Por favor, selecione um serviço!';
        errorDiv.classList.add('show');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
    }

    if (!data) {
        errorText.textContent = 'Por favor, selecione uma data!';
        errorDiv.classList.add('show');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
    }

    if (!horario) {
        errorText.textContent = 'Por favor, selecione um horário!';
        errorDiv.classList.add('show');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
    }

    // Todos os campos estáo preenchidos, mostrar loading
    errorDiv.classList.remove('show');
    
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    if (btnText && btnLoader) {
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
    }
    
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    
    // Simular envio (salvar no LocalStorage)
    setTimeout(() => {
        salvarAgendamento({
            profissional: barbeiro,
            servico: servico,
            preco: preco,
            data: data,
            horario: horario,
            dataAgendamento: new Date().toISOString(),
            status: 'Confirmado'
        });
        
        // Restaurar botão
        if (btnText && btnLoader) {
            btnText.style.display = 'block';
            btnLoader.style.display = 'none';
        }
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        
        // Mostrar modal de sucesso
        mostrarSucesso(barbeiro, servico, data, horario);
    }, 1500);
});

// ===== SALVAR AGENDAMENTO NO LOCALSTORAGE =====
function salvarAgendamento(agendamento) {
    // Buscar agendamentos existentes
    let agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    
    // Gerar ID único
    agendamento.id = Date.now();
    
    // Adicionar novo agendamento
    agendamentos.push(agendamento);
    
    // Salvar no LocalStorage
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
}

// ===== MODAL DE SUCESSO =====
function mostrarSucesso(barbeiro, servico, data, horario) {
    const modal = document.getElementById('modalSucesso');
    const mensagem = document.getElementById('mensagemSucesso');
    
    // Formatar data para exibição
    const [ano, mes, dia] = data.split('-');
    const dataFormatada = `${dia}/${mes}/${ano}`;
    
    mensagem.innerHTML = `
        <strong>Barbeiro:</strong> ${barbeiro}<br>
        <strong>Serviço:</strong> ${servico}<br>
        <strong>Data:</strong> ${dataFormatada}<br>
        <strong>Horário:</strong> ${horario}
    `;
    
    modal.style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modalSucesso').style.display = 'none';
    
    // Limpar formulário
    document.getElementById('agendamentoForm').reset();
    document.getElementById('barbeiroSelecionado').textContent = 'Selecione o barbeiro';
    document.getElementById('servicoSelecionado').textContent = 'Escolha o serviço';
    document.getElementById('dataSelecionada').textContent = 'Selecione a data';
    document.getElementById('horarioSelecionado').textContent = 'Escolha o horário';
    
    document.querySelectorAll('.campo-btn').forEach(btn => {
        btn.classList.remove('preenchido');
    });
    
    dataSelecionadaObj = null;
}

function irParaAtendimentos() {
    window.location.href = 'atendimentos.html';
}


// ===== INTEGRAÇÃO COM PAINEL ADMIN =====
function getHorariosBloqueadosAdmin(data, profissional) {
    const bloqueios = JSON.parse(localStorage.getItem('horariosBloqueados') || '[]');
    return bloqueios
        .filter(item => item.data === data && item.profissional === profissional)
        .map(item => item.horario);
}

function carregarHorariosDisponiveis(data, profissional) {
    const loadingElement = document.getElementById('loadingHorarios');
    const horariosGrid = document.getElementById('horariosGrid');
    if (loadingElement && horariosGrid) {
        loadingElement.style.display = 'flex';
        horariosGrid.style.opacity = '0.3';
        horariosGrid.style.pointerEvents = 'none';
    }

    setTimeout(() => {
        const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
        const horariosOcupados = agendamentos
            .filter(ag => ag.data === data && ag.profissional === profissional && ag.status !== 'Cancelado')
            .map(ag => ag.horario);
        const horariosBloqueados = getHorariosBloqueadosAdmin(data, profissional);

        aplicarHorariosOcupados(horariosOcupados, horariosBloqueados);

        if (loadingElement && horariosGrid) {
            loadingElement.style.display = 'none';
            horariosGrid.style.opacity = '1';
            horariosGrid.style.pointerEvents = 'auto';
        }
    }, 300);
}

function aplicarHorariosOcupados(horariosOcupados, horariosBloqueados = []) {
    const todosHorarios = document.querySelectorAll('.horario-item');

    todosHorarios.forEach(item => {
        const horario = item.textContent.trim().slice(0, 5);
        item.classList.remove('ocupado', 'selected', 'bloqueado');
        item.style.pointerEvents = 'auto';
        item.style.cursor = 'pointer';
        item.title = '';
        item.textContent = horario;

        if (horariosOcupados.includes(horario)) {
            item.classList.add('ocupado');
            item.style.pointerEvents = 'none';
            item.style.cursor = 'not-allowed';
            item.title = 'Horário já ocupado';
            item.textContent = horario + ' ocupado';
            return;
        }

        if (horariosBloqueados.includes(horario)) {
            item.classList.add('ocupado', 'bloqueado');
            item.style.pointerEvents = 'none';
            item.style.cursor = 'not-allowed';
            item.title = 'Bloqueado pelo barbeiro';
            item.textContent = horario + ' bloqueado';
            return;
        }

        item.setAttribute('onclick', "selecionarHorario('" + horario + "', this)");
    });
}
