
# Sistema MiniEscopo V4.9 - Documentação Completa

## Visão Geral
O Sistema MiniEscopo é uma plataforma integrada para gestão completa de solicitações, demonstrações e análise de dados empresariais. Desenvolvido em React com TypeScript, utiliza tecnologias modernas para proporcionar uma experiência de usuário otimizada.

## Funcionalidades Principais

### 1. Sistema de Autenticação
- **Login seguro** com validação de credenciais
- **Controle de acesso** baseado em roles (admin/usuário)
- **Logout automático** com preservação de sessão

### 2. Módulos de Formulários

#### 2.1 Serviço Técnico
- **Dados do Cliente**: Nome/Razão Social, CPF/CNPJ, telefones, responsável, e-mail, setor, data nascimento, endereço completo
- **Integração ViaCEP**: Preenchimento automático do endereço via CEP
- **Dados do Equipamento**: Modelo (listbox), serial (15 caracteres), motivo da solicitação, modelo nobreak, modelo impressora
- **Validações Condicionais**: Documentação obrigatória baseada no motivo selecionado
- **Campos Especiais**: Modo de uso, descrição/testes, campos para instalação inicial

#### 2.2 Aplicação
- **Estrutura Similar**: Dados cliente + equipamento
- **Motivos Específicos**: Aplicação inicial ou Aplicação Plus
- **Validação Condicional**: BO obrigatório apenas para aplicação inicial
- **Campos Obrigatórios**: Todos exceto BO em aplicação plus

#### 2.3 Password/Licença
- **Dados Completos**: Cliente + equipamento
- **Tipos de Licença**: Permanente, temporária, teste (listbox)
- **Campos Específicos**: Previsão faturamento, BO, documentação obrigatória automática
- **Validação Total**: Todos os campos obrigatórios

#### 2.4 Instalação Demo
- **Estrutura Completa**: Cliente + equipamento
- **Período Definido**: Data início e fim da demonstração
- **Responsável**: Samsung ou Representante
- **Validações**: Todos campos obrigatórios exceto modelo impressora

#### 2.5 Demonstração
- **Estrutura Dupla**: Dados para NF + Dados para Entrega
- **Botão de Cópia**: Transfere dados entre seções
- **Equipamento Detalhado**: Modelo, justificativa, descrição, datas
- **Configurações**: Ativo, Application Samsung, modo de uso
- **Cronograma**: BO, clientes adicionais com datas

### 3. Sistema de Anexos
- **Upload Múltiplo**: Vários arquivos por formulário
- **Formatos Aceitos**: Todos os tipos de arquivo
- **Visualização**: Lista de arquivos anexados
- **Remoção**: Possibilidade de remover arquivos antes do envio

### 4. Banco de Dados Local
- **Armazenamento**: localStorage (simulando Access)
- **Dados Salvos**: Todas as informações dos formulários
- **Timestamp**: Data e hora de envio do email
- **Exportação Automática**: Semanal via email
- **Backup Manual**: Exportação em JSON

### 5. Sistema de Email

#### 5.1 Configuração por Tipo
- **Destinatários**: Para e cópia configuráveis por tipo de formulário
- **Assuntos**: Template customizável com variáveis
- **Mensagens**: Texto personalizado por tipo de solicitação
- **Variáveis Disponíveis**: {razaoSocial}, {nomeCliente}, {modelo}, {serial}

#### 5.2 Envio via Outlook
- **Abertura Automática**: Integração com aplicativo Outlook
- **Layout Profissional**: Formatação HTML idêntica às telas
- **Título Dinâmico**: Motivo + Cliente + Modelo + Serial
- **Fallback**: Janela do navegador caso Outlook não abra

### 6. Área Administrativa

#### 6.1 Configurações de Sistema
- **Modelos**: Adicionar/remover modelos de equipamentos
- **Categorias**: Organização por tipo de equipamento
- **E-mails**: Configuração completa de destinatários
- **Banco de Dados**: Exportação e estatísticas

#### 6.2 Sistema de Notificações
- **Criação**: Título, mensagem e tipo (info/warning/success)
- **Ativação**: Controle de exibição no menu
- **Gerenciamento**: Edição e remoção de notificações
- **Visualização**: Exibição destacada no menu principal

### 7. Gestão de Dados

#### 7.1 Visualização
- **Lista Completa**: Todos os registros do sistema
- **Filtros**: Por tipo de formulário e busca textual
- **Estatísticas**: Contadores por categoria
- **Ordenação**: Por data, cliente, tipo

#### 7.2 Edição
- **Modal de Edição**: Interface amigável para alterações
- **Campos Editáveis**: Principais dados do cliente e equipamento
- **Validações**: Manutenção das regras de negócio
- **Salvamento**: Atualização imediata no banco

### 8. Validações e Formatações

#### 8.1 Campos Obrigatórios
- **CPF/CNPJ**: Validação de formato e dígitos verificadores
- **Serial**: Exatamente 15 caracteres
- **Data Nascimento**: Obrigatória para CPF
- **Email**: Formato válido

#### 8.2 Formatação Automática
- **Telefones**: Máscara (xx) xxxxx-xxxx
- **CPF**: xxx.xxx.xxx-xx
- **CNPJ**: xx.xxx.xxx/xxxx-xx
- **CEP**: xxxxx-xxx

## Tecnologias Utilizadas

### Frontend
- **React 18**: Biblioteca principal
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização
- **Shadcn/UI**: Componentes de interface
- **Lucide React**: Ícones
- **React Router**: Navegação

### Funcionalidades Específicas
- **React Hook Form**: Gerenciamento de formulários
- **Zod**: Validação de esquemas
- **Date-fns**: Manipulação de datas
- **Class Variance Authority**: Estilização condicional

### Integrações
- **ViaCEP API**: Consulta de endereços
- **CNPJ API**: Consulta de dados empresariais
- **Outlook**: Envio de emails
- **localStorage**: Persistência de dados

## Estrutura de Arquivos

```
src/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes base (shadcn)
│   ├── Header.tsx       # Cabeçalho do sistema
│   ├── Navigation.tsx   # Menu de navegação
│   ├── ActionButtons.tsx # Botões de ação
│   ├── ClientDataSection.tsx # Seção dados cliente
│   ├── FileAttachments.tsx # Sistema de anexos
│   ├── EmailConfig.tsx  # Configuração de emails
│   ├── AdminConfig.tsx  # Painel administrativo
│   └── LoginForm.tsx    # Formulário de login
├── tabs/                # Telas principais
│   ├── MenuTab.tsx      # Menu principal
│   ├── ServiceTab.tsx   # Serviço técnico
│   ├── AplicacaoTab.tsx # Aplicação
│   ├── PasswordTab.tsx  # Password/Licença
│   ├── InstalacaoDemoTab.tsx # Instalação demo
│   ├── DemonstracaoTab.tsx # Demonstração
│   └── RawDataTab.tsx   # Gestão de dados
├── hooks/               # Hooks customizados
│   ├── useAuth.tsx      # Autenticação
│   ├── useDatabase.ts   # Banco de dados
│   ├── useRawData.ts    # Dados brutos
│   ├── useViaCEP.ts     # Integração ViaCEP
│   └── useCNPJ.ts       # Integração CNPJ
├── services/            # Serviços
│   └── emailService.ts  # Serviço de email
├── types/               # Definições de tipos
│   └── index.ts         # Tipos principais
└── utils/               # Utilitários
    └── validation.ts    # Validações
```

## Configuração e Uso

### 1. Primeiro Acesso
1. **Login**: admin/admin123 ou user/user123
2. **Configuração**: Acessar configurações via ícone no header
3. **Modelos**: Adicionar modelos de equipamentos necessários
4. **Emails**: Configurar destinatários por tipo de formulário

### 2. Uso Diário
1. **Selecionar Módulo**: Escolher tipo de solicitação no menu
2. **Preencher Dados**: Cliente e equipamento
3. **Anexar Arquivos**: Se necessário
4. **Salvar**: Dados ficam no banco local
5. **Enviar Email**: Abre Outlook automaticamente

### 3. Administração
1. **Notificações**: Criar avisos para usuários
2. **Modelos**: Manter lista atualizada
3. **Emails**: Ajustar destinatários conforme necessário
4. **Dados**: Monitorar e editar registros
5. **Backup**: Exportar dados regularmente

## Manutenção e Suporte

### Backup de Dados
- **Automático**: Exportação semanal via email
- **Manual**: Botão de exportação em configurações
- **Formato**: JSON com todos os dados do sistema

### Resolução de Problemas
1. **Email não abre**: Verificar se Outlook está instalado
2. **Dados perdidos**: Restaurar do backup JSON
3. **Validação falha**: Verificar regras nos formulários
4. **Performance lenta**: Limpar dados antigos

### Atualizações Futuras
- **Versão**: Sempre indicada no header
- **Notificações**: Comunicadas via sistema de avisos
- **Backup**: Fazer antes de qualquer atualização

## Segurança

### Dados Locais
- **Armazenamento**: Apenas no navegador do usuário
- **Não enviados**: Dados não saem da máquina (exceto por email)
- **Criptografia**: localStorage do navegador

### Acesso
- **Controle**: Sistema de login simples
- **Roles**: Admin tem acesso completo
- **Sessão**: Logout automático por segurança

## Contato e Suporte
Para dúvidas, sugestões ou problemas, contatar o administrador do sistema através dos canais internos da empresa.

---
**Sistema MiniEscopo V4.9** - Desenvolvido com tecnologia de ponta para máxima eficiência e usabilidade.
