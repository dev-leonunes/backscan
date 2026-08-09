# Tutorial Completo: Configurando e Rodando o BackScan do Zero

Este tutorial irá guiar um iniciante absoluto para configurar um ambiente de desenvolvimento e rodar o projeto **BackScan** no **Linux (Ubuntu)** e no **Windows**.

---

## 1. Atualizar o Sistema

### 🐧 Linux (Ubuntu)
```bash
sudo apt update && sudo apt upgrade -y
```

### 🪟 Windows
1. Abra o **Windows Update** (Configurações → Windows Update)
2. Clique em **"Verificar atualizações"**
3. Instale todas as atualizações pendentes
4. Reinicie o computador se necessário

---

## 2. Instalar o Node.js e o npm
O projeto requer o **Node.js 16+**.

### 🐧 Linux (Ubuntu)

#### 2.1 Verificar se já está instalado
```bash
node -v
```
Se aparecer um número de versão (ex: `v16.13.0`), pule para a próxima etapa.

#### 2.2 Instalar o Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs
```

#### 2.3 Verificar a instalação
```bash
node -v
npm -v
```

### 🪟 Windows

#### 2.1 Baixar o Instalador
1. Acesse [https://nodejs.org/](https://nodejs.org/)
2. Baixe a versão **LTS** (Long Term Support) para Windows
3. Execute o instalador baixado

#### 2.2 Instalar o Node.js
1. Siga as instruções do instalador
2. Mantenha as opções padrão
3. Marque a opção **"Automatically install the necessary tools"** se disponível

#### 2.3 Verificar a instalação
Abra o **Prompt de Comando** ou **PowerShell** e digite:
```cmd
node -v
npm -v
```

---

## 3. Instalar o Git
O Git é necessário para clonar o projeto.

### 🐧 Linux (Ubuntu)
```bash
sudo apt install -y git
git --version
```

### 🪟 Windows
1. Acesse [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. Baixe o instalador para Windows
3. Execute o instalador e siga as instruções padrão
4. Após instalar, abra o **Git Bash** ou **Prompt de Comando** e verifique:
```cmd
git --version
```

---

## 4. Clonar o Repositório BackScan

```bash
git clone https://github.com/PedroHBessa/backscan.git
cd backscan
```

---

## 5. Instalar o pnpm e as Dependências

O projeto usa `pnpm` como gerenciador de pacotes.

### Instalar o pnpm globalmente
```bash
npm install -g pnpm
```

### Instalar as dependências do projeto
```bash
pnpm install
```

---

## 6. Configurar as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto.

### 🐧 Linux (Ubuntu)
```bash
nano .env
```

### 🪟 Windows
No **Prompt de Comando** ou **PowerShell**:
```cmd
notepad .env
```

Adicione as seguintes linhas ao arquivo:

```
BOT_TOKEN=seu_token_do_bot_telegram
CHAT_ID=seu_chat_id_telegram
```

Substitua:
- `seu_token_do_bot_telegram` pelo token do seu bot do Telegram
- `seu_chat_id_telegram` pelo ID do chat ou grupo

Salve o arquivo (CTRL+X, Y, Enter no Linux / Ctrl+S no Windows).

---

## 7. Criar e Configurar um Bot no Telegram

1. No Telegram, procure por **@BotFather**.
2. Envie o comando:
   ```
   /newbot
   ```
3. Siga as instruções e anote o **token** fornecido.
4. Para obter o **ID do chat/grupo**:
   - Adicione o bot ao grupo ou converse com ele.
   - Envie uma mensagem para o bot.
   - Acesse no navegador:
     ```
     https://api.telegram.org/botSEU_BOT_TOKEN/getUpdates
     ```
   - Anote o `chat_id` do objeto retornado.

---

## 8. Rodar o Projeto Localmente

Agora que as variáveis estão configuradas, vamos rodar o projeto.

### 8.1 Instalar a Vercel CLI
```bash
npm install -g vercel
```

### 8.2 Iniciar o Servidor de Desenvolvimento
```bash
vercel dev
```

O servidor estará disponível em `http://localhost:3000`.

### 8.3 Alternativa: Rodar com Node.js (servidor Express local)

Se preferir rodar diretamente com Node.js, crie um arquivo `server.js`:

#### 🐧 Linux (Ubuntu)
```bash
nano server.js
```

#### 🪟 Windows
```cmd
notepad server.js
```

Cole o conteúdo:

```javascript
import express from 'express';
import sendLocationHandler from './api/send-location.js';

const app = express();
app.use(express.json());
app.use(express.static('.'));

app.post('/api/send-location', (req, res) => {
    sendLocationHandler(req, res);
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
```

Salve e rode:

```bash
node server.js
```

---

## 9. Estrutura do Projeto

```
backscan/
├── api/
│   └── send-location.js   # Função serverless para enviar ao Telegram
├── index.html             # Página de configuração
├── config.js              # Lógica da página de configuração
├── receipt.html           # Página do comprovante
├── script.js              # Lógica do comprovante e validação
├── receipt-data.js        # Codificação/decodificação dos dados
├── styles.css             # Estilos globais
├── .env                   # Variáveis de ambiente (BOT_TOKEN e CHAT_ID)
└── package.json           # Dependências e scripts
```

---

## 10. Hospedar o Projeto na Vercel

O BackScan foi projetado para rodar na Vercel com funções serverless.

### 10.1 Criar uma Conta na Vercel
1. Acesse [https://vercel.com/](https://vercel.com/) e crie uma conta (pode usar o login do GitHub).
2. Após logar, clique em **"New Project"**.

### 10.2 Subir o Projeto para o GitHub
```bash
git init
git add .
git commit -m "Adiciona projeto BackScan"
git branch -M main
git remote add origin https://github.com/seu-usuario/backscan.git
git push -u origin main
```

### 10.3 Configurar Variáveis de Ambiente na Vercel
1. No painel da Vercel, acesse seu projeto.
2. Vá em **"Settings"** → **"Environment Variables"**.
3. Adicione:
   - `BOT_TOKEN` - Token do seu bot Telegram
   - `CHAT_ID` - ID do chat/grupo do Telegram

### 10.4 Implantar na Vercel
1. Na Vercel, clique em **"Import Git Repository"** e selecione o repositório.
2. A Vercel detectará automaticamente o projeto.
3. Configure o **"Framework Preset"** como **"Other"**.
4. Mantenha **"Build Command"** e **"Output Directory"** em branco.
5. Clique em **"Deploy"**.

Após a implantação, copie a URL gerada (ex: `https://backscan.vercel.app`). A aplicação estará disponível online! 🚀

---

## 11. Como Usar o BackScan

### 11.1 Gerar um Comprovante

1. Acesse a página principal da aplicação.
2. Preencha os dados:
   - **Nome:** Nome do remetente
   - **Valor:** Valor do recebimento (ex: 250,00)
   - **Tipo de transação:** PIX, TED, DOC, Boleto ou Transferência
   - **Instituição:** Caixa Econômica Federal, Banco do Brasil, Bradesco, Itaú, Santander, Nubank ou Banco Inter
3. Clique em **"Gerar link"**.
4. Copie o link gerado e compartilhe com quem desejar.

### 11.2 Acessar o Comprovante

1. Ao abrir o link, o sistema vai:
   - Verificar se a localização já está liberada
   - Solicitar permissão de localização por motivos de segurança e validação
   - Exibir o comprovante apenas após a validação

2. O comprovante exibe:
   - Data e hora
   - Valor recebido (em destaque)
   - Nome do remetente
   - Tipo de transação
   - Instituição
   - Número da transação

3. Clique em **"Imprimir comprovante"** para salvar como PDF ou imprimir.

---

## 12. Fluxo de Validação do Comprovante

O sistema segue este fluxo ao acessar um comprovante:

1. **Verifica se a localização já está liberada** → Obtém localização → Exibe comprovante
2. **Permissão pendente** → Mostra mensagem de segurança → Solicita autorização do usuário
3. **Permissão negada** → Mostra erro com botão "Tentar novamente"
4. **Tempo de segurança expirado** → Mostra erro com botão "Emitir novamente"
5. **Erro genérico** → Mostra mensagem de erro com botão para tentar novamente

O comprovante **só é exibido** após a localização ser obtida com sucesso.

---

## 13. Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `pnpm install` | Instalar dependências |
| `vercel dev` | Rodar localmente com Vercel |
| `vercel --prod` | Fazer deploy para produção |
| `vercel logs` | Visualizar logs da Vercel |
| `node server.js` | Rodar com servidor Express local |

---

## 14. Resolução de Problemas Comuns

### 14.1 "pnpm: comando não encontrado"
```bash
npm install -g pnpm
```

### 14.2 "BOT_TOKEN não definido"
Verifique se o arquivo `.env` existe na raiz do projeto e contém as variáveis.

### 14.3 "CHAT_ID inválido"
Confirme se o `chat_id` está correto acessando:
```
https://api.telegram.org/botSEU_BOT_TOKEN/getUpdates
```

### 14.4 "Permissão de localização negada"
O botão **"Tentar novamente"** na página do comprovante reinicia o processo de solicitação.

### 14.5 "Tempo de segurança expirou"
Clique em **"Emitir novamente"** para recarregar a página e reiniciar o processo.

---

## 15. Estrutura dos Dados do Comprovante

O link do comprovante contém os dados codificados em Base64 URL-safe:

```javascript
{
  tipo: "comprovante",
  nome: "João Silva",          // Nome do remetente
  valor: 250.00,               // Valor do recebimento
  tipoTransacao: "PIX",        // PIX, TED, DOC, Boleto, Transferência
  instituicao: "Caixa Econômica Federal"  // Instituição financeira
}
```

---

## Conclusão

Agora você tem o projeto BackScan rodando do zero no Linux ou Windows, com todas as novas funcionalidades:
- ✅ Configuração completa (nome, valor, tipo de transação, instituição)
- ✅ Validação de localização por motivos de segurança
- ✅ Comprovante responsivo com design moderno
- ✅ Botão de impressão nativo
- ✅ Integração com Telegram via funções serverless da Vercel
- ✅ Deploy simples e rápido

Qualquer dúvida, abra uma issue no GitHub! 🚀
