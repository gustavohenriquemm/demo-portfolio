const BARBEIROS = ['Sandrão', 'Tito'];
const HORARIOS = ['08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'];
const STORAGE_AGENDAMENTOS = 'agendamentos';
const STORAGE_BLOQUEIOS = 'horariosBloqueados';

const elements = {
    barbeiroFiltro: document.getElementById('barbeiroFiltro'),
    dataFiltro: document.getElementById('dataFiltro'),
    statusFiltro: document.getElementById('statusFiltro'),
    btnHoje: document.getElementById('btnHoje'),
    btnSeed: document.getElementById('btnSeed'),
    heroDateLabel: document.getElementById('heroDateLabel'),
    metricCortes: document.getElementById('metricCortes'),
    metricReceita: document.getElementById('metricReceita'),
    metricVagos: document.getElementById('metricVagos'),
    metricBloqueados: document.getElementById('metricBloqueados'),
    appointmentsList: document.getElementById('appointmentsList'),
    scheduleBoard: document.getElementById('scheduleBoard'),
    toast: document.getElementById('toast')
};

document.addEventListener('DOMContentLoaded', function() {
    elements.dataFiltro.value = todayISO();
    elements.heroDateLabel.textContent = formatDate(elements.dataFiltro.value);
    bindEvents();
    renderAdmin();
});

function bindEvents() {
    elements.barbeiroFiltro.addEventListener('change', renderAdmin);
    elements.statusFiltro.addEventListener('change', renderAdmin);
    elements.dataFiltro.addEventListener('change', function() {
        elements.heroDateLabel.textContent = formatDate(elements.dataFiltro.value);
        renderAdmin();
    });
    elements.btnHoje.addEventListener('click', function() {
        elements.dataFiltro.value = todayISO();
        elements.heroDateLabel.textContent = formatDate(elements.dataFiltro.value);
        renderAdmin();
    });
    elements.btnSeed.addEventListener('click', criarExemploDoDia);
}

function renderAdmin() {
    const data = elements.dataFiltro.value || todayISO();
    const barbeiro = elements.barbeiroFiltro.value;
    const status = elements.statusFiltro.value;
    const agendamentos = getAgendamentos();
    const bloqueios = getBloqueios();
    const barbeirosVisiveis = barbeiro === 'todos' ? BARBEIROS : [barbeiro];
    const agendamentosDia = agendamentos
        .filter(function(ag) { return ag.data === data; })
        .filter(function(ag) { return barbeiro === 'todos' || ag.profissional === barbeiro; })
        .filter(function(ag) { return status === 'todos' || ag.status === status; })
        .sort(function(a, b) { return a.horario.localeCompare(b.horario); });

    renderMetrics(data, barbeirosVisiveis, agendamentosDia, bloqueios);
    renderAppointments(agendamentosDia);
    renderSchedule(data, barbeirosVisiveis, agendamentos, bloqueios);
}

function renderMetrics(data, barbeirosVisiveis, agendamentosDia, bloqueios) {
    const confirmados = agendamentosDia.filter(function(ag) { return ag.status !== 'Cancelado'; });
    const receita = confirmados.reduce(function(total, ag) { return total + parsePreco(ag.preco); }, 0);
    const bloqueados = bloqueios.filter(function(item) { return item.data === data && barbeirosVisiveis.includes(item.profissional); });
    const ocupados = countOcupados(data, barbeirosVisiveis);
    const totalSlots = HORARIOS.length * barbeirosVisiveis.length;
    const vagos = Math.max(totalSlots - ocupados - bloqueados.length, 0);

    elements.metricCortes.textContent = confirmados.length;
    elements.metricReceita.textContent = formatMoney(receita);
    elements.metricVagos.textContent = vagos;
    elements.metricBloqueados.textContent = bloqueados.length;
}

function renderAppointments(agendamentosDia) {
    if (!agendamentosDia.length) {
        elements.appointmentsList.innerHTML = '<div class="empty-state">Nenhum corte encontrado para os filtros selecionados.</div>';
        return;
    }

    elements.appointmentsList.innerHTML = agendamentosDia.map(function(ag) {
        const statusClass = normalizeStatus(ag.status);
        return '<article class="appointment-card">' +
            '<div class="appointment-top">' +
                '<div class="appointment-title"><strong>' + ag.horario + ' - ' + ag.servico + '</strong><span>' + ag.profissional + ' • ' + formatDate(ag.data) + '</span></div>' +
                '<span class="status-pill status-' + statusClass + '">' + ag.status + '</span>' +
            '</div>' +
            '<div class="appointment-meta">Valor: <strong>' + ag.preco + '</strong></div>' +
            '<div class="appointment-actions">' +
                '<button class="action-small done" type="button" onclick="atualizarStatus(' + ag.id + ', \'Concluído\')">Concluir</button>' +
                '<button class="action-small" type="button" onclick="atualizarStatus(' + ag.id + ', \'Confirmado\')">Confirmar</button>' +
                '<button class="action-small cancel" type="button" onclick="atualizarStatus(' + ag.id + ', \'Cancelado\')">Cancelar</button>' +
                '<button class="action-small" type="button" onclick="removerAgendamento(' + ag.id + ')">Remover</button>' +
            '</div>' +
        '</article>';
    }).join('');
}

function renderSchedule(data, barbeirosVisiveis, agendamentos, bloqueios) {
    elements.scheduleBoard.innerHTML = barbeirosVisiveis.map(function(nome) {
        const slots = HORARIOS.map(function(horario) {
            const agendamento = agendamentos.find(function(ag) { return ag.data === data && ag.profissional === nome && ag.horario === horario && ag.status !== 'Cancelado'; });
            const bloqueio = bloqueios.find(function(item) { return item.data === data && item.profissional === nome && item.horario === horario; });
            if (agendamento) {
                return '<button class="time-slot busy" type="button" disabled>' + horario + '<small>' + agendamento.servico + '</small></button>';
            }
            if (bloqueio) {
                return '<button class="time-slot blocked" type="button" onclick="alternarBloqueio(\'' + nome + '\', \'' + data + '\', \'' + horario + '\')">' + horario + '<small>' + (bloqueio.motivo || 'Bloqueado') + '</small></button>';
            }
            return '<button class="time-slot free" type="button" onclick="alternarBloqueio(\'' + nome + '\', \'' + data + '\', \'' + horario + '\')">' + horario + '<small>Vago</small></button>';
        }).join('');
        return '<section class="barber-schedule"><h3>' + nome + '</h3><div class="time-grid">' + slots + '</div></section>';
    }).join('');
}

function alternarBloqueio(profissional, data, horario) {
    const bloqueios = getBloqueios();
    const index = bloqueios.findIndex(function(item) { return item.profissional === profissional && item.data === data && item.horario === horario; });
    if (index >= 0) {
        bloqueios.splice(index, 1);
        setBloqueios(bloqueios);
        showToast('Horário ' + horario + ' liberado para ' + profissional + '.');
    } else {
        bloqueios.push({ id: Date.now(), profissional: profissional, data: data, horario: horario, motivo: 'Indisponível' });
        setBloqueios(bloqueios);
        showToast('Horário ' + horario + ' bloqueado para ' + profissional + '.');
    }
    renderAdmin();
}

function atualizarStatus(id, status) {
    const agendamentos = getAgendamentos();
    const item = agendamentos.find(function(ag) { return Number(ag.id) === Number(id); });
    if (!item) return;
    item.status = status;
    localStorage.setItem(STORAGE_AGENDAMENTOS, JSON.stringify(agendamentos));
    showToast('Agendamento marcado como ' + status + '.');
    renderAdmin();
}

function removerAgendamento(id) {
    const agendamentos = getAgendamentos().filter(function(ag) { return Number(ag.id) !== Number(id); });
    localStorage.setItem(STORAGE_AGENDAMENTOS, JSON.stringify(agendamentos));
    showToast('Agendamento removido.');
    renderAdmin();
}

function criarExemploDoDia() {
    const data = elements.dataFiltro.value || todayISO();
    const agendamentos = getAgendamentos();
    const exemplos = [
        { profissional: 'Sandrão', servico: 'Corte + Barba', preco: 'R$ 60', data: data, horario: '10:00', status: 'Confirmado' },
        { profissional: 'Tito', servico: 'Corte de Cabelo', preco: 'R$ 40', data: data, horario: '14:00', status: 'Confirmado' }
    ];
    exemplos.forEach(function(item) {
        const existe = agendamentos.some(function(ag) { return ag.data === item.data && ag.profissional === item.profissional && ag.horario === item.horario && ag.status !== 'Cancelado'; });
        if (!existe) agendamentos.push(Object.assign({}, item, { id: Date.now() + Math.floor(Math.random() * 999), dataAgendamento: new Date().toISOString() }));
    });
    localStorage.setItem(STORAGE_AGENDAMENTOS, JSON.stringify(agendamentos));
    showToast('Exemplos criados na agenda do dia.');
    renderAdmin();
}

function countOcupados(data, barbeirosVisiveis) {
    return getAgendamentos().filter(function(ag) { return ag.data === data && barbeirosVisiveis.includes(ag.profissional) && ag.status !== 'Cancelado'; }).length;
}
function getAgendamentos() { return JSON.parse(localStorage.getItem(STORAGE_AGENDAMENTOS) || '[]'); }
function getBloqueios() { return JSON.parse(localStorage.getItem(STORAGE_BLOQUEIOS) || '[]'); }
function setBloqueios(bloqueios) { localStorage.setItem(STORAGE_BLOQUEIOS, JSON.stringify(bloqueios)); }
function parsePreco(preco) { return Number(String(preco || '0').replace('R$', '').replace('.', '').replace(',', '.').trim()) || 0; }
function formatMoney(value) { return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
function todayISO() { const now = new Date(); const offset = now.getTimezoneOffset() * 60000; return new Date(now.getTime() - offset).toISOString().slice(0, 10); }
function formatDate(value) { if (!value) return 'Hoje'; const parts = value.split('-'); return parts[2] + '/' + parts[1] + '/' + parts[0]; }
function normalizeStatus(status) { return String(status || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
function showToast(message) { elements.toast.textContent = message; elements.toast.classList.add('show'); clearTimeout(showToast.timer); showToast.timer = setTimeout(function() { elements.toast.classList.remove('show'); }, 2600); }
