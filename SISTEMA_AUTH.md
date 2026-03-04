# Sistema de Autenticação - Damasceno's Hair

## 📋 Visão Geral

O site agora possui um sistema completo de autenticação usando **LocalStorage** para armazenar dados localmente no navegador. Não há necessidade de servidor ou banco de dados - tudo funciona no front-end.

## 🔐 Fluxo de Autenticação

### 1. Primeiro Acesso (Sem Cadastro)
- Usuário acessa o site pela primeira vez
- Clica em "Agende seu Horário"
- Sistema detecta que não há login
- **Redireciona para tela de cadastro**

### 2. Cadastro Simples
O cadastro solicita apenas:
- ✅ **Nome** (mínimo 3 caracteres)
- ✅ **Senha** (mínimo 4 caracteres)
- ✅ **Confirmar Senha**

### 3. Dados Gerados Automaticamente
Após o cadastro, o sistema cria automaticamente:
- 📧 **Email**: `nomeDigitado@gmail.com`
  - Exemplo: Se o nome for "João Silva" → `joaosilva@gmail.com`
- 📱 **Telefone**: `11999999999` (número padrão)
- 📍 **Endereço**: `São Paulo - SP`
- 🎖️ **Plano**: `Demo`

### 4. Perfil Criado
- Perfil completo é salvo no LocalStorage
- Usuário é automaticamente redirecionado para onde queria ir (agendamento)

## 📂 Estrutura de Dados

### LocalStorage - Chaves Utilizadas

#### `usuarioAtual` (Object)
```json
{
  "nome": "João Silva",
  "senha": "1234",
  "email": "joaosilva@gmail.com",
  "telefone": "11999999999",
  "endereco": "São Paulo - SP",
  "dataCriacao": "2026-02-21T10:30:00.000Z",
  "plano": "Demo"
}
```

#### `isLoggedIn` (String)
- `"true"` - Usuário está logado
- `"false"` ou ausente - Usuário não está logado

#### `agendamentos` (Array)
Array com todos os agendamentos realizados pelo usuário.

## 🔒 Páginas Protegidas

As seguintes páginas verificam login automaticamente:
- ✅ `agendamento.html` - Requer login
- ✅ `atendimentos.html` - Requer login
- ✅ `perfil.html` - Requer login

Se o usuário não estiver logado, é redirecionado para `login.html`.

## 🎨 Páginas do Sistema

### 1. `index.html` - Página Inicial
- Acesso livre (não requer login)
- Botão "Agende seu Horário" verifica login antes de prosseguir

### 2. `login.html` - Login/Cadastro
- Duas abas: **Entrar** e **Cadastrar**
- Cadastro simples (nome + senha)
- Validações em tempo real

### 3. `perfil.html` - Perfil do Usuário
- Exibe todos os dados do usuário
- Nome, Email, Telefone, Endereço
- Data de cadastro
- Estatísticas de atendimentos
- Botões:
  - **Editar Perfil** - Permite alterar nome e endereço
  - **Sair da Conta** - Faz logout

### 4. `agendamento.html` - Fazer Agendamento
- Protegida por login
- Permite criar novos agendamentos

### 5. `atendimentos.html` - Histórico
- Protegida por login
- Lista todos os agendamentos realizados

## 🛠️ Arquivos Criados/Modificados

### Novos Arquivos
- ✨ `login.html` - Página de login/cadastro
- ✨ `css/login.css` - Estilos da tela de login
- ✨ `js/auth.js` - Lógica de autenticação

### Arquivos Modificados
- 📝 `index.html` - Adicionado verificação de login no botão
- 📝 `perfil.html` - Adicionado botão "Sair da Conta"
- 📝 `perfil.js` - Atualizado para usar novo sistema de auth
- 📝 `agendamento.html` - Adicionado verificação de login
- 📝 `atendimentos.html` - Adicionado verificação de login
- 📝 `css/perfil.css` - Adicionado estilos para botão sair
- 📝 `css/atendimentos.css` - Corrigido caminho da imagem de fundo

## ⚙️ Funcionalidades Principais

### Login
```javascript
// Verificar se usuário existe
const usuario = localStorage.getItem('usuarioAtual');
// Validar nome e senha
// Definir isLoggedIn = 'true'
// Redirecionar
```

### Cadastro
```javascript
// Criar objeto de usuário
const perfil = {
    nome: nome,
    senha: senha,
    email: gerarEmail(nome),
    telefone: '11999999999',
    endereco: 'São Paulo - SP',
    dataCriacao: new Date().toISOString(),
    plano: 'Demo'
};
// Salvar no LocalStorage
// Fazer login automático
```

### Logout
```javascript
// Definir isLoggedIn = 'false'
// Redirecionar para index.html
```

### Editar Perfil
- Permite alterar: Nome e Endereço
- Email é regenerado automaticamente baseado no novo nome
- Telefone permanece fixo

## 🎯 Fluxo Completo do Usuário

1. **Acessa o site** → `index.html`
2. **Clica em "Agendar"** → Verifica se está logado
3. **Não está logado** → Redireciona para `login.html`
4. **Faz cadastro** → Preenche nome e senha
5. **Perfil criado automaticamente** → Email, telefone e endereço gerados
6. **Redirecionado** → `agendamento.html`
7. **Faz agendamentos** → Salvos no LocalStorage
8. **Acessa perfil** → `perfil.html` - Vê seus dados e estatísticas
9. **Logout** → Pode sair da conta quando quiser

## 🔐 Segurança

⚠️ **IMPORTANTE**: Este é um sistema DEMO para demonstração.
- Senhas são armazenadas em texto puro
- Dados salvos localmente no navegador
- Não deve ser usado em produção real
- Ideal para portfólios e demonstrações

## 🎨 Padronização Visual

Todas as páginas agora têm o mesmo fundo:
```css
background-image: url("../img/Back (1).png");
background-repeat: no-repeat;
background-size: cover;
background-position: center;
background-attachment: fixed;
```

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 💻 Desktop
- 📱 Mobile
- 📲 Tablet

## 🚀 Como Testar

1. Abra o `index.html` no navegador
2. Clique em "Agende seu Horário"
3. Será redirecionado para login
4. Clique em "Cadastrar"
5. Preencha:
   - Nome: Seu Nome
   - Senha: 1234
   - Confirmar: 1234
6. Cadastro será criado automaticamente
7. Será redirecionado para agendamento
8. Acesse seu perfil para ver os dados gerados

## 🧹 Limpar Dados

Para resetar tudo e começar do zero:
```javascript
// No console do navegador:
localStorage.clear();
location.reload();
```

Ou use o botão "Limpar Dados" na página de perfil.

---

**Desenvolvido para demonstração - Damasceno's Hair** 💈✂️
