// Sistema de Autenticação com LocalStorage

// Função para alternar entre Login e Cadastro
function mostrarLogin() {
    document.getElementById('form-login').classList.remove('hidden');
    document.getElementById('form-cadastro').classList.add('hidden');
    document.querySelectorAll('.tab')[0].classList.add('active');
    document.querySelectorAll('.tab')[1].classList.remove('active');
    limparErros();
}

function mostrarCadastro() {
    document.getElementById('form-login').classList.add('hidden');
    document.getElementById('form-cadastro').classList.remove('hidden');
    document.querySelectorAll('.tab')[0].classList.remove('active');
    document.querySelectorAll('.tab')[1].classList.add('active');
    limparErros();
}

function limparErros() {
    document.getElementById('login-error').classList.remove('show');
    document.getElementById('cadastro-error').classList.remove('show');
    document.getElementById('cadastro-success').classList.remove('show');
}

// Função para gerar email automático
function gerarEmail(nome) {
    return nome.toLowerCase().replace(/\s+/g, '') + '@gmail.com';
}

// Função para gerar telefone fictício
function gerarTelefone() {
    return '11999999999';
}

// Função para criar perfil completo
function criarPerfil(nome, senha) {
    const perfil = {
        nome: nome,
        senha: senha,
        email: gerarEmail(nome),
        telefone: gerarTelefone(),
        endereco: 'São Paulo - SP',
        dataCriacao: new Date().toISOString(),
        plano: 'Demo'
    };
    
    localStorage.setItem('usuarioAtual', JSON.stringify(perfil));
    localStorage.setItem('isLoggedIn', 'true');
    
    return perfil;
}

// Função de Login
document.getElementById('form-login').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nome = document.getElementById('login-nome').value.trim();
    const senha = document.getElementById('login-senha').value;
    const errorDiv = document.getElementById('login-error');
    
    // Buscar usuário no localStorage
    const usuarioSalvo = localStorage.getItem('usuarioAtual');
    
    if (!usuarioSalvo) {
        errorDiv.textContent = 'Usuário não encontrado. Por favor, cadastre-se primeiro.';
        errorDiv.classList.add('show');
        return;
    }
    
    const usuario = JSON.parse(usuarioSalvo);
    
    if (usuario.nome !== nome || usuario.senha !== senha) {
        errorDiv.textContent = 'Nome ou senha incorretos.';
        errorDiv.classList.add('show');
        return;
    }
    
    // Login bem-sucedido
    localStorage.setItem('isLoggedIn', 'true');
    
    // Redirecionar para onde o usuário queria ir ou para o index
    const redirecionarPara = sessionStorage.getItem('redirecionarApos') || 'index.html';
    sessionStorage.removeItem('redirecionarApos');
    window.location.href = redirecionarPara;
});

// Função de Cadastro
document.getElementById('form-cadastro').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nome = document.getElementById('cadastro-nome').value.trim();
    const senha = document.getElementById('cadastro-senha').value;
    const confirma = document.getElementById('cadastro-confirma').value;
    const errorDiv = document.getElementById('cadastro-error');
    const successDiv = document.getElementById('cadastro-success');
    
    // Validações
    if (nome.length < 3) {
        errorDiv.textContent = 'O nome deve ter pelo menos 3 caracteres.';
        errorDiv.classList.add('show');
        return;
    }
    
    if (senha.length < 4) {
        errorDiv.textContent = 'A senha deve ter pelo menos 4 caracteres.';
        errorDiv.classList.add('show');
        return;
    }
    
    if (senha !== confirma) {
        errorDiv.textContent = 'As senhas não coincidem.';
        errorDiv.classList.add('show');
        return;
    }
    
    // Verificar se já existe usuário
    const usuarioExistente = localStorage.getItem('usuarioAtual');
    if (usuarioExistente) {
        const usuario = JSON.parse(usuarioExistente);
        if (usuario.nome === nome) {
            errorDiv.textContent = 'Este nome de usuário já está cadastrado.';
            errorDiv.classList.add('show');
            return;
        }
    }
    
    // Criar perfil
    criarPerfil(nome, senha);
    
    // Mostrar mensagem de sucesso
    successDiv.textContent = 'Cadastro realizado com sucesso! Redirecionando...';
    successDiv.classList.add('show');
    errorDiv.classList.remove('show');
    
    // Redirecionar após 1.5 segundos
    setTimeout(() => {
        const redirecionarPara = sessionStorage.getItem('redirecionarApos') || 'index.html';
        sessionStorage.removeItem('redirecionarApos');
        window.location.href = redirecionarPara;
    }, 1500);
});

// Verificar se já está logado ao carregar a página
window.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        const redirecionarPara = sessionStorage.getItem('redirecionarApos') || 'index.html';
        sessionStorage.removeItem('redirecionarApos');
        window.location.href = redirecionarPara;
    }
});
