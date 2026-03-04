# 📖 Guia de Uso - Sistema de Agendamento Demo

## 🚀 Iniciando o Projeto

### Opção 1: Abrir Diretamente
1. Navegue até a pasta `demo-portfolio`
2. Dê duplo clique no arquivo `index.html`
3. O sistema abrirá no seu navegador padrão

### Opção 2: Usar Servidor Local (Recomendado)
Se você tiver o Visual Studio Code com Live Server:
1. Abra a pasta `demo-portfolio` no VS Code
2. Clique com botão direito em `index.html`
3. Selecione "Open with Live Server"

## 📱 Testando as Funcionalidades

### 1. Fazer um Agendamento

**Passo a Passo:**
1. Na página inicial, clique em **"Agendar Horário"**
2. **Selecione o Barbeiro:**
   - Clique no campo "Barbeiro"
   - Escolha entre Sandrão ou Tito
3. **Escolha o Serviço:**
   - Clique no campo "Serviço"
   - Selecione o serviço desejado (ex: Corte de Cabelo - R$ 40)
4. **Selecione a Data:**
   - Clique no campo "Data"
   - Use o calendário para escolher uma data futura
   - Use as setas para navegar entre meses
5. **Escolha o Horário:**
   - Clique no campo "Horário"
   - Selecione um horário disponível (em azul)
   - Horários ocupados aparecem riscados em vermelho
6. **Confirme:**
   - Clique em "Confirmar Agendamento"
   - Aguarde a mensagem de sucesso
7. **Próximos Passos:**
   - Clique em "Ver Meus Agendamentos" ou
   - Clique em "Fazer Novo Agendamento"

### 2. Visualizar Agendamentos

1. Na página inicial, clique em **"Meus Agendamentos"**
2. Você verá todos os agendamentos cadastrados
3. Use os filtros no topo:
   - **Todos**: Mostra todos os agendamentos
   - **Próximos**: Apenas agendamentos futuros confirmados
   - **Concluídos**: Agendamentos que já passaram
   - **Cancelados**: Agendamentos cancelados

### 3. Gerenciar Agendamentos

**Cancelar um Agendamento:**
1. Na lista de agendamentos, encontre um agendamento futuro
2. Clique no botão **"Cancelar"** (vermelho)
3. Confirme o cancelamento no popup
4. O agendamento será marcado como "Cancelado"

**Editar um Agendamento:**
1. Na lista de agendamentos, encontre um agendamento futuro
2. Clique no botão **"Editar"** (azul)
3. Você será redirecionado para a página de agendamento
4. Faça as alterações desejadas
5. Confirme para salvar as mudanças

**Excluir do Histórico:**
1. Agendamentos cancelados têm um botão **"Excluir"**
2. Clique nele para remover definitivamente do histórico
3. Confirme a exclusão

### 4. Testar Horários Ocupados

Para ver o sistema de horários ocupados funcionando:
1. Faça um agendamento (ex: Sandrão, 15/01/2024, 14:00)
2. Tente fazer outro agendamento:
   - Escolha o mesmo barbeiro (Sandrão)
   - Escolha a mesma data (15/01/2024)
   - Ao abrir os horários, verá que 14:00 está ocupado (vermelho)
3. Mas se escolher outro barbeiro (Tito), o mesmo horário estará disponível!

## 🔍 Funcionalidades Especiais

### Sistema Inteligente de Horários
- Cada barbeiro tem sua própria agenda
- Horários ocupados são específicos por data e barbeiro
- Não é possível selecionar horários já agendados
- Feedback visual imediato (vermelho = ocupado, azul = disponível)

### Validações Automáticas
- Não permite agendamento em datas passadas
- Todos os campos são obrigatórios
- Mensagens de erro claras e visuais
- Campos preenchidos ficam com borda azul

### Persistência de Dados
- Todos os dados ficam salvos no navegador
- Mesmo fechando e abrindo, seus agendamentos permanecem
- Para limpar tudo: F12 → Console → digite: `localStorage.clear()`

## 🎯 Casos de Uso para Demonstração

### Cenário 1: Cliente Novo
1. Acessar sistema pela primeira vez
2. Fazer primeiro agendamento
3. Verificar na lista de agendamentos
4. Mostrar a navegação intuitiva

### Cenário 2: Cliente Frequente
1. Já tem agendamentos anteriores
2. Fazer novo agendamento
3. Usar filtros para ver apenas próximos
4. Editar um agendamento futuro

### Cenário 3: Gerenciamento
1. Cancelar um agendamento
2. Ver status atualizado
3. Excluir agendamento cancelado
4. Fazer novo agendamento no horário liberado

## 🎨 Recursos Visuais

### Animações
- **Popups**: Deslizam suavemente de baixo para cima
- **Cards**: Elevam ao passar o mouse
- **Botões**: Efeito de elevação no hover
- **Loading**: Spinners animados durante carregamento

### Cores dos Status
- 🔵 **Azul**: Confirmado / Próximo
- 🟢 **Verde**: Concluído
- 🔴 **Vermelho**: Cancelado
- 🟡 **Amarelo**: Dia atual no calendário

### Ícones
- 👨‍🦲 Barbeiro
- 💈 Serviço
- 📅 Data
- 🕐 Horário
- ✅ Confirmação
- ❌ Cancelamento

## 📊 Dados de Exemplo

Para testar rapidamente, use estes dados:

**Agendamento 1:**
- Barbeiro: Sandrão
- Serviço: Corte + Barba (R$ 60)
- Data: Amanhã
- Horário: 10:00

**Agendamento 2:**
- Barbeiro: Tito
- Serviço: Barba (R$ 30)
- Data: Próxima semana
- Horário: 15:00

**Agendamento 3:**
- Barbeiro: Sandrão
- Serviço: Pigmentação (R$ 80)
- Data: Amanhã
- Horário: 14:00

## 🔧 Dicas Técnicas

### Limpar Dados
Para resetar o sistema:
```javascript
// Abra o Console do navegador (F12)
localStorage.clear()
// Depois recarregue a página (F5)
```

### Ver Dados Salvos
Para visualizar os agendamentos salvos:
```javascript
// Abra o Console do navegador (F12)
console.log(JSON.parse(localStorage.getItem('agendamentos')))
```

### Adicionar Agendamento Manual (Teste)
```javascript
const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
agendamentos.push({
  id: Date.now(),
  profissional: "Sandrão",
  servico: "Corte de Cabelo",
  preco: "R$ 40",
  data: "2024-12-25",
  horario: "14:00",
  dataAgendamento: new Date().toISOString(),
  status: "Confirmado"
});
localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
location.reload();
```

## 📱 Testando Responsividade

### Desktop (1920x1080)
- Layout completo em duas colunas
- Todas as funcionalidades visíveis
- Navegação no topo

### Tablet (768x1024)
- Layout adaptado
- Cards em coluna única
- Navegação inferior

### Mobile (375x667)
- Design otimizado para toque
- Menu inferior fixo
- Grid de horários 3 colunas
- Popups em tela cheia

### Como Testar
1. Pressione F12 (DevTools)
2. Clique no ícone de dispositivo móvel
3. Escolha diferentes resoluções
4. Teste a navegação e funcionalidades

## ✅ Checklist de Demonstração

- [ ] Abrir página inicial
- [ ] Fazer primeiro agendamento
- [ ] Ver agendamento na lista
- [ ] Fazer segundo agendamento (mesmo dia, horário diferente)
- [ ] Verificar horário ocupado
- [ ] Usar filtros de status
- [ ] Editar um agendamento
- [ ] Cancelar um agendamento
- [ ] Excluir agendamento cancelado
- [ ] Testar em mobile (F12)
- [ ] Mostrar código no VS Code
- [ ] Explicar arquitetura LocalStorage

## 🎓 Para Apresentação em Portfólio

### Pontos a Destacar

1. **Frontend Puro**: Sem necessidade de backend
2. **Design Profissional**: Mantém identidade visual completa
3. **UX Otimizada**: Navegação intuitiva e feedback visual
4. **Código Limpo**: JavaScript organizado e comentado
5. **Responsivo**: Funciona em qualquer dispositivo
6. **Persistência**: Dados salvos localmente
7. **Validações**: Sistema completo de validação
8. **Performance**: Carregamento rápido

### Perguntas Comuns

**P: Por que LocalStorage?**
R: Para demonstração sem necessidade de servidor, ideal para portfólio

**P: Os dados são seguros?**
R: É uma demo, em produção usaria banco de dados com autenticação

**P: Funciona offline?**
R: Sim! Após carregamento inicial, funciona 100% offline

**P: Por que não tem login?**
R: Versão demo focada em demonstrar funcionalidades principais

## 🎯 Próximos Passos (Sugestões)

Se quiser expandir o projeto:
- [ ] Adicionar sistema de login
- [ ] Integrar com backend (Node.js + MongoDB)
- [ ] Adicionar notificações push
- [ ] Sistema de avaliações
- [ ] Integração com WhatsApp
- [ ] Dashboard administrativo
- [ ] Relatórios e estatísticas
- [ ] Sistema de fidelidade

---

**Desenvolvido com ❤️ para demonstração de habilidades em Desenvolvimento Web**
