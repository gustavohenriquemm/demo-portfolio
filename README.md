# Sistema de Agendamento - Damasceno's Hair (Versão Demo)

## 📋 Sobre o Projeto

Esta é uma versão demonstrativa (demo) do Sistema de Agendamento da barbearia Damasceno's Hair, desenvolvida especialmente para portfólio profissional. O sistema mantém 100% do design original, mas utiliza armazenamento local (LocalStorage) em vez de banco de dados, permitindo demonstração completa das funcionalidades sem necessidade de servidor.

## ✨ Características

### Design Profissional
- Interface moderna e responsiva
- Animações suaves e transições elegantes
- Paleta de cores característica da marca
- Experiência de usuário otimizada para mobile e desktop
- Background personalizado com efeitos visuais

### Funcionalidades Implementadas

✅ **Agendamento Completo**
- Seleção de barbeiro (Sandrão e Tito)
- Escolha de serviços (7 opções disponíveis)
- Calendário interativo para seleção de data
- Grade de horários com disponibilidade em tempo real
- Validação de campos obrigatórios
- Feedback visual durante o processo

✅ **Gerenciamento de Agendamentos**
- Listagem de todos os agendamentos
- Filtros por status (Todos, Próximos, Concluídos, Cancelados)
- Visualização detalhada de cada agendamento
- Edição de agendamentos futuros
- Cancelamento com confirmação
- Exclusão de agendamentos cancelados

✅ **Sistema de Horários**
- Verificação automática de horários ocupados
- Bloqueio visual de horários indisponíveis
- Simulação realista de disponibilidade por barbeiro e data
- Loading durante carregamento de horários

✅ **Navegação**
- Menu de navegação inferior fixo
- Transições suaves entre páginas
- Breadcrumbs e botões de retorno
- Design intuitivo e acessível

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e moderna
- **CSS3**: Estilização avançada com:
  - Flexbox e Grid Layout
  - Animações e transições
  - Media queries para responsividade
  - Gradientes e efeitos visuais
  - Backdrop filters
- **JavaScript (Vanilla)**: Lógica de aplicação com:
  - LocalStorage para persistência de dados
  - Manipulação do DOM
  - Event listeners
  - Validação de formulários
  - Sistema de filtros
  - Gerenciamento de estado

## 📁 Estrutura de Arquivos

```
demo-portfolio/
├── index.html              # Página inicial
├── agendamento.html        # Formulário de agendamento
├── atendimentos.html       # Lista de agendamentos
├── css/
│   ├── home.css           # Estilos da home (inline no HTML)
│   ├── agendamento.css    # Estilos do formulário de agendamento
│   └── atendimentos.css   # Estilos da lista de atendimentos
├── js/
│   ├── agendamento.js     # Lógica do formulário de agendamento
│   └── atendimentos.js    # Lógica da lista de atendimentos
└── img/
    ├── Logo (2).png       # Logo da barbearia
    ├── Back (1).png       # Background principal
    ├── Foto pg 1 sandrão.png  # Foto do barbeiro Sandrão
    └── 2 tito.png         # Foto do barbeiro Tito
```

## 🚀 Como Usar

### Instalação

1. Clone ou baixe este repositório
2. Abra o arquivo `index.html` em qualquer navegador moderno
3. Não é necessário servidor local ou instalação de dependências

### Uso Básico

1. **Página Inicial**: Visualize as opções de "Agendar Horário" e "Meus Agendamentos"
2. **Fazer Agendamento**: 
   - Clique em "Agendar Horário"
   - Selecione o barbeiro
   - Escolha o serviço desejado
   - Selecione a data no calendário
   - Escolha um horário disponível
   - Confirme o agendamento
3. **Ver Agendamentos**:
   - Clique em "Meus Agendamentos"
   - Use os filtros para visualizar por status
   - Edite ou cancele agendamentos futuros

## 💾 Armazenamento de Dados

Os dados são armazenados localmente no navegador usando **LocalStorage**:

- **Chave**: `agendamentos`
- **Formato**: Array JSON com objetos de agendamento
- **Estrutura do Objeto**:
```javascript
{
  id: 1234567890,              // Timestamp único
  profissional: "Sandrão",     // Nome do barbeiro
  servico: "Corte de Cabelo",  // Serviço selecionado
  preco: "R$ 40",              // Valor do serviço
  data: "2024-01-15",          // Data no formato YYYY-MM-DD
  horario: "14:00",            // Horário
  dataAgendamento: "2024-01-10T10:30:00.000Z", // Timestamp da criação
  status: "Confirmado"         // Status: Confirmado, Cancelado, Concluído
}
```

## 📱 Responsividade

O sistema é totalmente responsivo e se adapta a:
- **Desktop**: Layout completo com grid de 2 colunas para barbeiros
- **Tablet**: Ajuste automático de espaçamentos e tamanhos
- **Mobile**: Layout otimizado com:
  - Menu inferior fixo
  - Grid de horários em 3 colunas
  - Cards em coluna única
  - Background fixo otimizado para iOS

## 🎨 Identidade Visual

### Cores Principais
- **Azul Principal**: `#14638b` (Gradiente de `#0d4963`)
- **Background Escuro**: `#0a0e27`
- **Verde Sucesso**: `#28a745`
- **Vermelho Cancelamento**: `#dc3545`
- **Amarelo Destaque**: `#ffc107`

### Tipografia
- **Fonte Principal**: Poppins (Google Fonts)
- **Fonte Secundária**: Montserrat (Google Fonts)
- Pesos: 300, 400, 500, 600, 700

## 🔧 Funcionalidades Técnicas

### Sistema de Horários
- **Horários Disponíveis**: 08:00 às 20:00 (exceto 12:00)
- **Validação**: Horários já agendados ficam marcados como ocupados
- **Filtro por Data e Barbeiro**: Cada combinação tem seus próprios horários

### Validações
- ✅ Todos os campos são obrigatórios
- ✅ Não permite agendamento em datas passadas
- ✅ Não permite selecionar horários ocupados
- ✅ Mensagens de erro claras e visuais

### Animações
- Fade in/out para popups e modals
- Slide up para popups de seleção
- Shake para horários ocupados
- Loading spinners durante carregamento
- Transições suaves em hover

## 🌟 Diferenciais

1. **100% Frontend**: Não requer servidor ou banco de dados
2. **Persistência Local**: Dados salvos mesmo após fechar o navegador
3. **Design Profissional**: Mantém identidade visual completa do projeto original
4. **Código Limpo**: JavaScript vanilla organizado e comentado
5. **Performance**: Carregamento rápido e responsivo
6. **Acessibilidade**: Navegação intuitiva e feedback visual

## 📝 Notas Importantes

- Esta é uma **versão demonstrativa** para portfólio
- Os dados são armazenados apenas localmente (LocalStorage)
- Não há conexão com servidor real ou banco de dados
- Perfeito para demonstração de habilidades em desenvolvimento frontend
- O design é **100% idêntico** ao projeto original

## 👨‍💻 Desenvolvido Para

Este projeto foi desenvolvido como parte do portfólio de **Engenharia da Computação**, demonstrando competências em:
- Desenvolvimento Web Frontend
- Design de Interface (UI/UX)
- JavaScript Vanilla
- Armazenamento Local
- Responsividade
- Gerenciamento de Estado
- Validação de Dados

## 📄 Licença

Projeto demonstrativo para portfólio profissional.

---

**Damasceno's Hair** - Seu estilo, nossa arte ✂️💈
