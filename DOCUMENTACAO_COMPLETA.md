
# Documentação Completa - Sistema Rep - Solicitação Demo

## Visão Geral do Sistema

O Sistema Rep - Solicitação Demo é uma aplicação web completa para gerenciamento de solicitações empresariais, desenvolvida em React com TypeScript, utilizando tecnologias modernas como Tailwind CSS e componentes Shadcn/UI.

### Tecnologias Utilizadas
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Componentes**: Shadcn/UI
- **Build Tool**: Vite
- **Armazenamento**: LocalStorage (futuramente Access Database)
- **Email**: Integração com Outlook Desktop App

## Estrutura do Sistema

### 1. Módulos Principais

#### 1.1 Serviço Técnico (SERVICE)
- **Descrição**: Gerenciamento de solicitações de serviços técnicos
- **Funcionalidades**:
  - Cadastro completo de cliente
  - Dados do equipamento (modelo, serial)
  - Motivos específicos (Manutenção, Instalação, etc.)
  - Configurações especiais para "Instalação Inicial"
  - Sistema de anexos
  - Envio por email via Outlook

#### 1.2 Demonstração (DEMONSTRACAO)
- **Descrição**: Agendamento de demonstrações comerciais
- **Funcionalidades**:
  - Justificativa da demonstração
  - Descrição do equipamento
  - Cronograma (início e fim)
  - Configurações de uso (humano/veterinário)
  - Application Samsung (sim/não)
  - Sistema de anexos

#### 1.3 Aplicação (APLICACAO)
- **Descrição**: Solicitações de aplicação técnica
- **Funcionalidades**:
  - Tipos: Aplicação Inicial e Aplicação Plus
  - BO obrigatório para Aplicação Inicial
  - Data da aplicação
  - Sistema de anexos completo
  - Validações específicas

#### 1.4 Password/Licença (PASSWORD)
- **Descrição**: Controle de licenças e credenciais
- **Funcionalidades**:
  - Tipos de licença (Permanente, Temporária, Teste, etc.)
  - Previsão de faturamento
  - Documentação obrigatória automática
  - Número BO
  - Sistema de anexos

#### 1.5 Instalação Demo (INSTALACAO_DEMO)
- **Descrição**: Configuração de ambientes demonstrativos
- **Funcionalidades**:
  - Dados completos do equipamento
  - Modelo de nobreak e impressora
  - Período da demonstração (início/fim)
  - Responsável pela instalação (Samsung/Representante)
  - Sistema de anexos

### 2. Sistema de Usuários e Autenticação

#### 2.1 Tipos de Usuário
- **Admin**: Acesso completo + painel administrativo
- **User**: Acesso aos formulários e visualização de dados

#### 2.2 Funcionalidades de Autenticação
- Login/logout
- Persistência de sessão
- Controle de acesso por role

### 3. Painel Administrativo

#### 3.1 Gerenciamento de Modelos
- **CRUD completo** de modelos de equipamentos
- **Categorização**: Humano, Veterinário, Geral
- **Status**: Ativo/Inativo
- **Modelos padrão**: LABGEO PT1000, PT3000, versões VET

#### 3.2 Configuração de Emails
- **Por tipo de formulário**: Configuração específica para cada módulo
- **Destinatários**: TO e CC personalizáveis
- **Assunto**: Template com variáveis dinâmicas
- **Mensagem**: Personalização do corpo do email

#### 3.3 Sistema de Notificações
- **Tipos**: Info, Warning, Success
- **Gerenciamento**: Criação, edição, ativação/desativação
- **Exibição**: Na tela inicial do sistema
- **Casos de uso**: Atualizações, manutenções, comunicados

### 4. Sistema de Anexos

#### 4.1 Funcionalidades
- **Upload múltiplo**: Até 10 arquivos
- **Limite de tamanho**: 10MB por arquivo
- **Formatos aceitos**: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, JPEG, PNG, GIF
- **Preview**: Visualização de informações do arquivo
- **Remoção**: Individual de cada anexo

#### 4.2 Armazenamento
- Arquivos convertidos para base64
- Metadados preservados (nome, tamanho, tipo)
- Integração com sistema de email

### 5. Sistema de Email

#### 5.1 Integração com Outlook
- **Abertura automática**: Outlook desktop app
- **Fallback**: Nova janela do navegador
- **Formato do assunto**: `{Motivo} - {Cliente} - {Modelo} - {Serial}`

#### 5.2 Layout do Email
- **Replica exata** da interface da tela
- **Cores e gradientes** específicos por módulo
- **Seções organizadas**: Header, Cliente, Endereço, Dados Específicos, Anexos
- **Responsivo**: Adaptável a diferentes clientes de email

#### 5.3 Configurações Avançadas
- **Templates personalizáveis** por administrador
- **Variáveis dinâmicas**: {razaoSocial}, {nomeCliente}, {modelo}, {serial}
- **Lista de destinatários** configurável
- **Mensagens personalizadas**

### 6. Gestão de Dados

#### 6.1 Armazenamento Local
- **LocalStorage**: Dados persistentes no navegador
- **Estrutura JSON**: Organizada e tipada
- **Backup manual**: Exportação de dados

#### 6.2 CRUD de Registros
- **Visualização**: Lista paginada com filtros
- **Edição inline**: Modificação direta dos dados
- **Exclusão**: Com confirmação
- **Busca**: Por cliente, modelo, serial
- **Filtros**: Por tipo de formulário

#### 6.3 Estatísticas
- **Contadores**: Por tipo de formulário
- **Métricas**: Total de registros, pendências
- **Visualização**: Cards informativos

### 7. Interface e Experiência do Usuário

#### 7.1 Design System
- **Cores**: Gradientes específicos por módulo
- **Tipografia**: Segoe UI, hierarquia clara
- **Espaçamento**: Sistema baseado em Tailwind
- **Iconografia**: Lucide React icons

#### 7.2 Navegação
- **Menu horizontal**: Sticky top navigation
- **Indicadores visuais**: Tab ativa, hover states
- **Breadcrumb**: Orientação de localização

#### 7.3 Responsividade
- **Mobile first**: Design adaptativo
- **Breakpoints**: sm, md, lg, xl
- **Grid system**: Flexível e responsivo

### 8. Validações e Regras de Negócio

#### 8.1 Validações de Campo
- **CPF/CNPJ**: Algoritmo de validação brasileiro
- **Email**: Formato válido
- **Telefone**: Máscara e validação
- **CEP**: Formato brasileiro
- **Serial**: 15 caracteres obrigatórios

#### 8.2 Regras Específicas
- **Data nascimento**: Obrigatória para CPF
- **Documentação**: Auto-preenchimento baseado no motivo
- **BO**: Obrigatório para tipos específicos
- **Campos condicionais**: Baseados em seleções anteriores

### 9. Performance e Otimização

#### 9.1 Code Splitting
- **Lazy loading**: Componentes carregados sob demanda
- **Bundle optimization**: Vite optimizations
- **Tree shaking**: Remoção de código não utilizado

#### 9.2 Estado e Memória
- **Local state**: useState para dados temporários
- **Persistent state**: localStorage para dados permanentes
- **Memory management**: Cleanup de event listeners

### 10. Segurança

#### 10.1 Validação Client-side
- **Sanitização**: Inputs sanitizados
- **Validation**: Múltiplas camadas de validação
- **XSS Prevention**: Proteção contra scripts maliciosos

#### 10.2 Dados Sensíveis
- **CPF/CNPJ**: Formatação e validação segura
- **Files**: Validação de tipo e tamanho
- **Local storage**: Dados não críticos apenas

### 11. Deployment e Build

#### 11.1 Build Process
```bash
npm run build    # Build de produção
npm run preview  # Preview do build
npm run dev      # Desenvolvimento
```

#### 11.2 Estrutura de Pastas
```
src/
├── components/        # Componentes reutilizáveis
├── tabs/             # Páginas/tabs principais
├── hooks/            # Custom hooks
├── services/         # Serviços (email, etc.)
├── utils/            # Utilitários e helpers
├── types/            # Definições TypeScript
└── pages/            # Páginas principais
```

### 12. Manutenção e Atualizações

#### 12.1 Logs e Debugging
- **Console logs**: Para desenvolvimento e debug
- **Error boundaries**: Captura de erros React
- **Toast notifications**: Feedback para usuário

#### 12.2 Versionamento
- **Semantic versioning**: Major.Minor.Patch
- **Changelog**: Documentação de mudanças
- **Migration guides**: Para atualizações breaking

## Guias de Uso

### Para Usuários Finais

1. **Login**: Acesse com suas credenciais
2. **Navegação**: Use o menu superior para alternar entre módulos
3. **Preenchimento**: Complete todos os campos obrigatórios (*)
4. **Anexos**: Adicione arquivos conforme necessário
5. **Envio**: Use "ENVIAR EMAIL" para abrir Outlook automaticamente

### Para Administradores

1. **Acesso admin**: Botão de engrenagem no header
2. **Modelos**: Gerencie equipamentos disponíveis
3. **Emails**: Configure destinatários e templates
4. **Notificações**: Crie avisos para usuários
5. **Dados**: Monitore e edite registros existentes

### Troubleshooting Comum

1. **Email não abre**: Verifique se Outlook está instalado
2. **Anexo muito grande**: Limite de 10MB por arquivo
3. **Campos obrigatórios**: Todos os campos (*) devem ser preenchidos
4. **Serial inválido**: Deve ter exatamente 15 caracteres
5. **CPF/CNPJ inválido**: Verifique a formatação

## Roadmap Futuro

### Próximas Funcionalidades
- [ ] Integração com banco Access
- [ ] Sincronização em tempo real
- [ ] Relatórios avançados
- [ ] App mobile
- [ ] Integração com CRM
- [ ] Assinatura digital
- [ ] Workflow de aprovações
- [ ] Dashboard executivo

### Melhorias Planejadas
- [ ] PWA (Progressive Web App)
- [ ] Offline mode
- [ ] Push notifications
- [ ] Backup automático
- [ ] Auditoria completa
- [ ] API REST
- [ ] Integração ERP
- [ ] BI Dashboard

## Suporte e Contato

Para dúvidas, sugestões ou suporte técnico:
- **Documentação**: Este arquivo
- **Logs**: Console do navegador (F12)
- **Backup**: Exportar dados regularmente
- **Atualizações**: Verificar versão no header

---
**Versão da Documentação**: 1.0  
**Data**: ${new Date().toLocaleDateString('pt-BR')}  
**Sistema**: Rep - Solicitação Demo v4.9
