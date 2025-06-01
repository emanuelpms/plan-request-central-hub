
# Guia de Migração para ASP.NET MVC

## Visão Geral
Este documento descreve como migrar e aplicar o sistema de solicitações para ASP.NET MVC, mantendo as funcionalidades existentes.

## Estrutura do Projeto ASP.NET MVC

### 1. Controllers
```csharp
// Controllers/HomeController.cs
public class HomeController : Controller
{
    public ActionResult Index()
    {
        return View();
    }
}

// Controllers/SolicitacaoController.cs
public class SolicitacaoController : Controller
{
    private readonly ISolicitacaoService _solicitacaoService;
    
    public SolicitacaoController(ISolicitacaoService solicitacaoService)
    {
        _solicitacaoService = solicitacaoService;
    }
    
    [HttpPost]
    public ActionResult Servico(ServicoViewModel model)
    {
        if (ModelState.IsValid)
        {
            _solicitacaoService.SalvarSolicitacao(model);
            return Json(new { success = true });
        }
        return Json(new { success = false, errors = ModelState });
    }
}
```

### 2. Models
```csharp
// Models/SolicitacaoModels.cs
public class BaseFormData
{
    public string NomeCliente { get; set; }
    public string RazaoSocial { get; set; }
    public string CpfCnpj { get; set; }
    public string Telefone1 { get; set; }
    public string Telefone2 { get; set; }
    public string Email { get; set; }
    public string Responsavel { get; set; }
    public string SetorResponsavel { get; set; }
    public DateTime? DataNascimento { get; set; }
    public string Endereco { get; set; }
    public string Cep { get; set; }
    public string Cidade { get; set; }
    public string Estado { get; set; }
    public string Bairro { get; set; }
    public string Numero { get; set; }
    public string ObservacaoEndereco { get; set; }
    public string Modelo { get; set; }
    public string Serial { get; set; }
    public List<IFormFile> Attachments { get; set; } = new List<IFormFile>();
}

public class ServicoViewModel : BaseFormData
{
    public string Motivo { get; set; }
    public string ModeloNobreak { get; set; }
    public string ModeloImpressora { get; set; }
    public bool DocumentacaoObrigatoria { get; set; }
    public string UsoHumanoVeterinario { get; set; }
    public string DescricaoTestes { get; set; }
    public bool NecessarioAplicacao { get; set; }
    public bool NecessarioLicenca { get; set; }
    public DateTime? DataAplicacao { get; set; }
}
```

### 3. Services
```csharp
// Services/ISolicitacaoService.cs
public interface ISolicitacaoService
{
    void SalvarSolicitacao(BaseFormData formData);
    void EnviarEmail(BaseFormData formData, string tipoSolicitacao);
    List<SolicitacaoEntity> ObterTodasSolicitacoes();
}

// Services/SolicitacaoService.cs
public class SolicitacaoService : ISolicitacaoService
{
    private readonly IDbContext _context;
    private readonly IEmailService _emailService;
    
    public SolicitacaoService(IDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }
    
    public void SalvarSolicitacao(BaseFormData formData)
    {
        var entity = new SolicitacaoEntity
        {
            // Mapear propriedades
            DataCriacao = DateTime.Now,
            EmailEnviado = DateTime.Now
        };
        
        _context.Solicitacoes.Add(entity);
        _context.SaveChanges();
    }
    
    public void EnviarEmail(BaseFormData formData, string tipoSolicitacao)
    {
        var templateEmail = GerarTemplateEmail(formData, tipoSolicitacao);
        _emailService.EnviarEmailOutlook(templateEmail);
    }
}
```

### 4. Database (Entity Framework)
```csharp
// Data/ApplicationDbContext.cs
public class ApplicationDbContext : DbContext
{
    public DbSet<SolicitacaoEntity> Solicitacoes { get; set; }
    public DbSet<AnexoEntity> Anexos { get; set; }
    public DbSet<ConfiguracaoEmailEntity> ConfiguracaoEmails { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<SolicitacaoEntity>()
            .HasMany(s => s.Anexos)
            .WithOne(a => a.Solicitacao)
            .HasForeignKey(a => a.SolicitacaoId);
    }
}

// Entities/SolicitacaoEntity.cs
public class SolicitacaoEntity
{
    public int Id { get; set; }
    public string TipoSolicitacao { get; set; }
    public string RazaoSocial { get; set; }
    public string CpfCnpj { get; set; }
    public string Modelo { get; set; }
    public string Serial { get; set; }
    public DateTime DataCriacao { get; set; }
    public DateTime? EmailEnviado { get; set; }
    public string DadosJson { get; set; } // Para armazenar todos os dados em JSON
    public List<AnexoEntity> Anexos { get; set; }
}
```

### 5. Views (Razor)
```html
<!-- Views/Shared/_Layout.cshtml -->
<!DOCTYPE html>
<html>
<head>
    <title>Sistema de Solicitações</title>
    <link href="~/Content/bootstrap.min.css" rel="stylesheet" />
    <link href="~/Content/site.css" rel="stylesheet" />
</head>
<body>
    <div class="container">
        @RenderBody()
    </div>
    
    <script src="~/Scripts/jquery-3.6.0.min.js"></script>
    <script src="~/Scripts/bootstrap.min.js"></script>
    @RenderSection("scripts", required: false)
</body>
</html>

<!-- Views/Home/Index.cshtml -->
@{
    ViewBag.Title = "Sistema de Solicitações";
}

<div id="app">
    <!-- Aqui seria renderizada a aplicação React ou implementada em Razor -->
</div>

<!-- Views/Solicitacao/Servico.cshtml -->
@model ServicoViewModel

@using (Html.BeginForm("Servico", "Solicitacao", FormMethod.Post, new { enctype = "multipart/form-data", @class = "solicitacao-form" }))
{
    <div class="form-group">
        @Html.LabelFor(m => m.RazaoSocial, "Razão Social")
        @Html.TextBoxFor(m => m.RazaoSocial, new { @class = "form-control", required = "required" })
    </div>
    
    <div class="form-group">
        @Html.LabelFor(m => m.Serial, "Serial (15 caracteres)")
        @Html.TextBoxFor(m => m.Serial, new { @class = "form-control", maxlength = "15", required = "required" })
    </div>
    
    <!-- Outros campos... -->
    
    <div class="form-group">
        <label>Anexos</label>
        <input type="file" name="Attachments" multiple class="form-control" />
    </div>
    
    <button type="submit" class="btn btn-primary">Salvar</button>
    <button type="button" class="btn btn-info" onclick="enviarEmail()">Enviar Email</button>
}
```

### 6. JavaScript/jQuery
```javascript
// Scripts/solicitacao.js
$(document).ready(function() {
    // Validação de Serial (15 caracteres)
    $('input[name="Serial"]').on('input', function() {
        var value = $(this).val();
        if (value.length !== 15) {
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
        }
    });
    
    // Busca CEP
    $('input[name="Cep"]').on('blur', function() {
        var cep = $(this).val().replace(/\D/g, '');
        if (cep.length === 8) {
            buscarEnderecoPorCEP(cep);
        }
    });
    
    // Validação CPF/CNPJ
    $('input[name="CpfCnpj"]').on('blur', function() {
        var documento = $(this).val();
        if (!validarCPFCNPJ(documento)) {
            alert('CPF/CNPJ inválido');
        }
    });
});

function buscarEnderecoPorCEP(cep) {
    $.ajax({
        url: 'https://viacep.com.br/ws/' + cep + '/json/',
        type: 'GET',
        success: function(data) {
            if (!data.erro) {
                $('input[name="Endereco"]').val(data.logradouro);
                $('input[name="Bairro"]').val(data.bairro);
                $('input[name="Cidade"]').val(data.localidade);
                $('input[name="Estado"]').val(data.uf);
            }
        }
    });
}

function enviarEmail() {
    var formData = $('.solicitacao-form').serialize();
    $.ajax({
        url: '/Solicitacao/EnviarEmail',
        type: 'POST',
        data: formData,
        success: function(response) {
            if (response.success) {
                alert('Email enviado com sucesso!');
            } else {
                alert('Erro ao enviar email');
            }
        }
    });
}
```

### 7. Email Service
```csharp
// Services/EmailService.cs
public class EmailService : IEmailService
{
    public void EnviarEmailOutlook(EmailTemplate template)
    {
        try
        {
            // Usando Microsoft.Office.Interop.Outlook
            var outlookApp = new Microsoft.Office.Interop.Outlook.Application();
            var mailItem = outlookApp.CreateItem(Microsoft.Office.Interop.Outlook.OlItemType.olMailItem);
            
            mailItem.To = template.Para;
            mailItem.CC = template.Copia;
            mailItem.Subject = template.Assunto;
            mailItem.HTMLBody = template.CorpoHTML;
            
            // Adicionar anexos
            foreach (var anexo in template.Anexos)
            {
                mailItem.Attachments.Add(anexo.CaminhoArquivo);
            }
            
            mailItem.Display(); // Abre o Outlook para o usuário revisar
            // ou mailItem.Send(); para enviar automaticamente
        }
        catch (Exception ex)
        {
            throw new Exception("Erro ao abrir Outlook: " + ex.Message);
        }
    }
    
    private string GerarTemplateHTML(BaseFormData dados, string tipoSolicitacao)
    {
        var html = new StringBuilder();
        html.Append("<html><head>");
        html.Append("<style>");
        html.Append("body { font-family: Arial, sans-serif; }");
        html.Append(".header { background-color: #3b82f6; color: white; padding: 20px; }");
        html.Append(".content { padding: 20px; }");
        html.Append(".field { margin-bottom: 10px; }");
        html.Append(".label { font-weight: bold; }");
        html.Append("</style>");
        html.Append("</head><body>");
        
        html.Append($"<div class='header'><h2>{tipoSolicitacao.ToUpper()}</h2></div>");
        html.Append("<div class='content'>");
        
        html.Append($"<div class='field'><span class='label'>Razão Social:</span> {dados.RazaoSocial}</div>");
        html.Append($"<div class='field'><span class='label'>CPF/CNPJ:</span> {dados.CpfCnpj}</div>");
        html.Append($"<div class='field'><span class='label'>Modelo:</span> {dados.Modelo}</div>");
        html.Append($"<div class='field'><span class='label'>Serial:</span> {dados.Serial}</div>");
        
        // Adicionar outros campos específicos do tipo de solicitação
        
        html.Append("</div>");
        html.Append("</body></html>");
        
        return html.ToString();
    }
}
```

### 8. Configuração (Startup.cs/.NET Core ou Global.asax/.NET Framework)
```csharp
// Startup.cs (.NET Core)
public void ConfigureServices(IServiceCollection services)
{
    services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(connectionString));
        
    services.AddScoped<ISolicitacaoService, SolicitacaoService>();
    services.AddScoped<IEmailService, EmailService>();
    
    services.AddMvc();
}

// Para .NET Framework, use Global.asax
protected void Application_Start()
{
    // Configurar DI container (Unity, Autofac, etc.)
}
```

### 9. Exportação Automática Semanal
```csharp
// Services/ExportacaoService.cs
public class ExportacaoService
{
    public void ExecutarExportacaoSemanal()
    {
        var dados = ObterDadosParaExportacao();
        var csv = GerarCSV(dados);
        EnviarEmailComCSV(csv);
    }
    
    private void ConfigurarTarefaAutomatica()
    {
        // Usar Hangfire ou Windows Task Scheduler
        RecurringJob.AddOrUpdate(
            "exportacao-semanal",
            () => ExecutarExportacaoSemanal(),
            Cron.Weekly);
    }
}
```

## Considerações de Migração

### 1. Banco de Dados
- Migrar de localStorage para SQL Server/MySQL
- Implementar Entity Framework para ORM
- Configurar backup automático

### 2. Autenticação
- Implementar ASP.NET Identity
- Configurar roles (Admin, Usuario)
- Implementar JWT para APIs

### 3. Upload de Arquivos
- Configurar storage local ou Azure Blob Storage
- Implementar validação de tipos de arquivo
- Configurar limite de tamanho

### 4. Integração Outlook
- Usar Microsoft.Office.Interop.Outlook
- Configurar permissões de segurança
- Implementar fallback para SMTP

### 5. Performance
- Implementar cache (Redis/Memory Cache)
- Otimizar queries com Entity Framework
- Configurar compressão de arquivos

## Deploy e Configuração

### 1. IIS Configuration
```xml
<!-- web.config -->
<configuration>
  <system.web>
    <httpRuntime maxRequestLength="51200" /> <!-- 50MB -->
    <compilation targetFramework="4.8" />
  </system.web>
</configuration>
```

### 2. Estrutura de Pastas
```
MiniEscopo.Web/
├── Controllers/
├── Models/
├── Views/
├── Services/
├── Data/
├── Content/
├── Scripts/
└── Uploads/
```

Este guia fornece uma base sólida para migrar o sistema React para ASP.NET MVC mantendo todas as funcionalidades existentes.
