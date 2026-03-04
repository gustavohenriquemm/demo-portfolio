// Perfil - LocalStorage Demo
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se está logado
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
        window.location.href = 'login.html';
        return;
    }
    
    carregarDadosPerfil();
    carregarEstatisticas();
});

// Carregar dados do perfil
function carregarDadosPerfil() {
    // Buscar usuário atual do localStorage
    const usuario = JSON.parse(localStorage.getItem('usuarioAtual'));
    
    if (!usuario) {
        // Se não houver usuário, redirecionar para login
        window.location.href = 'login.html';
        return;
    }
    
    // Atualizar interface com os dados
    document.getElementById('nome-usuario').textContent = usuario.nome;
    document.getElementById('telefone-usuario').textContent = formatarTelefone(usuario.telefone);
    document.getElementById('email-usuario').textContent = usuario.email;
    document.getElementById('endereco-usuario').textContent = usuario.endereco;
    document.getElementById('plano-usuario').textContent = usuario.plano;
    
    // Formatar data de cadastro
    const dataCadastro = new Date(usuario.dataCriacao);
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const mesNome = meses[dataCadastro.getMonth()];
    const ano = dataCadastro.getFullYear();
    document.getElementById('membro-desde').textContent = `Membro desde ${mesNome} de ${ano}`;
}

// Formatar telefone
function formatarTelefone(telefone) {
    // Formatar: 11999999999 -> (11) 99999-9999
    const cleaned = telefone.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
    }
    return telefone;
}

// Carregar estatísticas dos agendamentos
function carregarEstatisticas() {
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    // Total de atendimentos
    const totalAtendimentos = agendamentos.length;
    document.getElementById('total-atendimentos').textContent = totalAtendimentos;
    
    // Total investido (soma dos preços de todos os atendimentos)
    const totalInvestido = agendamentos.reduce((total, ag) => {
        return total + parseFloat(ag.preco.replace('R$ ', '').replace(',', '.'));
    }, 0);
    document.getElementById('total-investido').textContent = `R$ ${totalInvestido.toFixed(2).replace('.', ',')}`;
    
    // Próximos atendimentos (confirmados e com data futura)
    const proximosAtendimentos = agendamentos.filter(ag => {
        const dataAgendamento = new Date(ag.data);
        dataAgendamento.setHours(0, 0, 0, 0);
        return ag.status === 'Confirmado' && dataAgendamento >= hoje;
    }).length;
    document.getElementById('proximos-atendimentos').textContent = proximosAtendimentos;
}

// Editar perfil
function editarPerfil() {
    const usuario = JSON.parse(localStorage.getItem('usuarioAtual'));
    
    const nome = prompt('Nome:', usuario.nome);
    if (nome && nome.trim()) {
        usuario.nome = nome.trim();
        usuario.email = nome.toLowerCase().replace(/\s+/g, '') + '@gmail.com';
    }
    
    const endereco = prompt('Endereço:', usuario.endereco);
    if (endereco && endereco.trim()) usuario.endereco = endereco.trim();
    
    // Salvar alterações
    localStorage.setItem('usuarioAtual', JSON.stringify(usuario));
    
    // Recarregar dados
    carregarDadosPerfil();
    
    alert('Perfil atualizado com sucesso!');
}

// Sair da conta
function sairDaConta() {
    const confirmar = confirm('Tem certeza que deseja sair da sua conta?');
    
    if (confirmar) {
        localStorage.setItem('isLoggedIn', 'false');
        window.location.href = 'index.html';
    }
}

// Limpar todos os dados
function limparDados() {
    const confirmar = confirm(
        'Atenção! Esta ação irá limpar TODOS os dados armazenados:\n\n' +
        '• Todos os agendamentos\n' +
        '• Dados do perfil\n' +
        '• Login\n\n' +
        'Esta ação não pode ser desfeita. Deseja continuar?'
    );
    
    if (confirmar) {
        const confirmar2 = confirm('Tem certeza absoluta? Todos os dados serão perdidos permanentemente.');
        
        if (confirmar2) {
            // Limpar LocalStorage
            localStorage.clear();
            
            alert('Todos os dados foram limpos com sucesso!');
            
            // Redirecionar para a página inicial
            window.location.href = 'index.html';
        }
    }
}
