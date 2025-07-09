export const generateOutlookEmailHTML = (formData: any, formType: string, subject: string) => {
  const currentDate = new Date().toLocaleString('pt-BR');
  
  const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #3B82F6, #1E40AF);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .section {
            margin-bottom: 25px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #3B82F6;
        }
        .section h3 {
            color: #1E40AF;
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 18px;
        }
        .field-group {
            display: table;
            width: 100%;
            margin-bottom: 10px;
        }
        .field-label {
            display: table-cell;
            width: 30%;
            font-weight: bold;
            color: #555;
            padding-right: 15px;
            vertical-align: top;
        }
        .field-value {
            display: table-cell;
            width: 70%;
            color: #333;
            vertical-align: top;
        }
        .urgent {
            background: #FEE2E2;
            border-left-color: #DC2626;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .urgent .icon {
            color: #DC2626;
            font-weight: bold;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        @media (max-width: 600px) {
            .field-group {
                display: block;
            }
            .field-label, .field-value {
                display: block;
                width: 100%;
            }
            .field-label {
                margin-bottom: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">📋 Sistema MiniEscopo</div>
            <h1>${getFormTypeTitle(formType)}</h1>
            <p>Solicitação recebida em ${currentDate}</p>
        </div>
        
        ${formData.urgente ? `
        <div class="urgent">
            <span class="icon">⚠️</span> <strong>SOLICITAÇÃO URGENTE</strong>
        </div>
        ` : ''}
        
        ${generateFormSections(formData, formType)}
        
        <div class="footer">
            <p><strong>Sistema MiniEscopo</strong> - Gestão de Solicitações</p>
            <p>Esta é uma mensagem automática. Não responda a este e-mail.</p>
        </div>
    </div>
</body>
</html>
  `;
  
  return htmlTemplate;
};

const getFormTypeTitle = (formType: string): string => {
  const titles: { [key: string]: string } = {
    'service': 'Solicitação de Serviço Técnico',
    'demo': 'Solicitação de Demonstração',
    'app': 'Solicitação de Aplicação',
    'password': 'Solicitação de Licença/Senha',
    'install': 'Solicitação de Instalação'
  };
  return titles[formType] || 'Solicitação';
};

const generateFormSections = (formData: any, formType: string): string => {
  let sections = '';
  
  // Seção Cliente
  sections += `
    <div class="section">
        <h3>📊 Dados do Cliente</h3>
        <div class="field-group">
            <div class="field-label">Nome/Razão Social:</div>
            <div class="field-value">${formData.razaoSocial || 'Não informado'}</div>
        </div>
        <div class="field-group">
            <div class="field-label">CPF/CNPJ:</div>
            <div class="field-value">${formData.cpfCnpj || 'Não informado'}</div>
        </div>
        <div class="field-group">
            <div class="field-label">Email:</div>
            <div class="field-value">${formData.email || 'Não informado'}</div>
        </div>
        <div class="field-group">
            <div class="field-label">Telefone Principal:</div>
            <div class="field-value">${formData.telefone1 || 'Não informado'}</div>
        </div>
        ${formData.telefone2 ? `
        <div class="field-group">
            <div class="field-label">Telefone Secundário:</div>
            <div class="field-value">${formData.telefone2}</div>
        </div>
        ` : ''}
        ${formData.responsavel ? `
        <div class="field-group">
            <div class="field-label">Responsável:</div>
            <div class="field-value">${formData.responsavel}</div>
        </div>
        ` : ''}
    </div>
  `;
  
  // Seção Endereço
  if (formData.endereco || formData.cep || formData.cidade) {
    sections += `
      <div class="section">
          <h3>📍 Endereço</h3>
          ${formData.cep ? `
          <div class="field-group">
              <div class="field-label">CEP:</div>
              <div class="field-value">${formData.cep}</div>
          </div>
          ` : ''}
          ${formData.endereco ? `
          <div class="field-group">
              <div class="field-label">Endereço:</div>
              <div class="field-value">${formData.endereco}${formData.numero ? `, ${formData.numero}` : ''}</div>
          </div>
          ` : ''}
          ${formData.bairro ? `
          <div class="field-group">
              <div class="field-label">Bairro:</div>
              <div class="field-value">${formData.bairro}</div>
          </div>
          ` : ''}
          ${formData.cidade ? `
          <div class="field-group">
              <div class="field-label">Cidade:</div>
              <div class="field-value">${formData.cidade}${formData.estado ? ` - ${formData.estado}` : ''}</div>
          </div>
          ` : ''}
      </div>
    `;
  }
  
  // Seção Equipamento
  if (formData.modelo || formData.serial) {
    sections += `
      <div class="section">
          <h3>⚙️ Dados do Equipamento</h3>
          ${formData.modelo ? `
          <div class="field-group">
              <div class="field-label">Modelo:</div>
              <div class="field-value">${formData.modelo}</div>
          </div>
          ` : ''}
          ${formData.serial ? `
          <div class="field-group">
              <div class="field-label">Número de Série:</div>
              <div class="field-value">${formData.serial}</div>
          </div>
          ` : ''}
      </div>
    `;
  }
  
  // Seção específica por tipo
  if (formType === 'service') {
    sections += `
      <div class="section">
          <h3>🔧 Detalhes da Solicitação</h3>
          ${formData.motivo ? `
          <div class="field-group">
              <div class="field-label">Motivo:</div>
              <div class="field-value">${formData.motivo}</div>
          </div>
          ` : ''}
          ${formData.descricao ? `
          <div class="field-group">
              <div class="field-label">Descrição:</div>
              <div class="field-value">${formData.descricao}</div>
          </div>
          ` : ''}
          ${formData.dataPreferencial ? `
          <div class="field-group">
              <div class="field-label">Data Preferencial:</div>
              <div class="field-value">${new Date(formData.dataPreferencial).toLocaleDateString('pt-BR')}</div>
          </div>
          ` : ''}
          ${formData.usoEquipamento ? `
          <div class="field-group">
              <div class="field-label">Uso do Equipamento:</div>
              <div class="field-value">${formData.usoEquipamento}</div>
          </div>
          ` : ''}
          ${formData.modeloImpressora ? `
          <div class="field-group">
              <div class="field-label">Modelo da Impressora:</div>
              <div class="field-value">${formData.modeloImpressora}</div>
          </div>
          ` : ''}
          ${formData.modeloNobreak ? `
          <div class="field-group">
              <div class="field-label">Modelo do Nobreak:</div>
              <div class="field-value">${formData.modeloNobreak}</div>
          </div>
          ` : ''}
      </div>
    `;
  }
  
  return sections;
};