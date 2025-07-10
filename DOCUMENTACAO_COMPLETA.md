# Sistema MiniEscopo - Documentação Completa

## Funcionalidades Implementadas

### Sistema de Login por Equipes
- **Administrador**: admin / admin123 - Acesso total
- **Time Samsung**: samsung / samsung123 - Acesso completo aos dados
- **Call Center**: callcenter / call123 - Acesso aos formulários
- **Representantes**: rep1, rep2, rep3 / rep123 - Acesso limitado aos próprios casos

### Controle de Dados por Usuário
- Representantes veem apenas formulários criados por eles
- Time Samsung e administradores veem todos os casos
- Call Center tem acesso operacional completo

### Validações e Limitações
- CPF/CNPJ com validação e formatação automática
- Campo serial limitado a 15 caracteres
- Validação de email, telefone e CEP
- Busca automática de endereço por CEP

### Sistema de Email HTML
- Templates profissionais para Outlook
- Configuração de destinatários por tipo de formulário
- Layout responsivo e bem formatado

### Modelos Samsung Incluídos
Catálogo completo de equipamentos de ultrassom Samsung organizados por categoria (Básico, Geral, Cardiologia, Premium, Portátil, Obstétrico, Veterinário).

### Preparado para ASP.NET
- Estrutura de dados compatível
- Componentes organizados e reutilizáveis
- Sistema de autenticação baseado em roles