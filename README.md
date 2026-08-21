# BackScan 🕵️

**BackScan** é uma ferramenta anti-golpes que ajuda a rastrear a localização de golpistas que tentam aplicar fraudes por mensagem.

## Como funciona

Golpistas frequentemente se passam por familiares ou amigos pedindo dinheiro via Pix, enviando comprovantes falsos. Com o BackScan:

1. Você **gera um comprovante fake** com nome e valor
2. Envia o link para o **golpista** se passando por comprovante de pagamento
3. Quando o golpista **acessa o link**, a localização dele é capturada
4. A localização é **enviada para você** via Telegram

## Para que serve

- 📍 **Identificar golpistas próximos** - Saber onde eles estão
- 📝 **Abrir boletim de ocorrência** - Com dados de localização
- 🛑 **Intimidar golpistas** - Mostrar que você tem informações sobre eles
- 🔍 **Investigar fraudes** - Coletar dados para autoridades

## Segurança

- 🔒 Localização só é capturada **após autorização do navegador**
- 🎯 Apenas **coordenadas geográficas** são coletadas
- 📱 Interface idêntica a um comprovante real
- 🚫 Nenhum dado pessoal do usuário é armazenado

## Começando

### Instalação Rápida

```bash
git clone https://github.com/dev-leonunes/backscan.git
cd backscan
pnpm install
vercel dev
```

### Deploy na Vercel

1. Configure as variáveis de ambiente: `BOT_TOKEN` e `CHAT_ID`
2. Faça o deploy
3. Compartilhe o link!

📖 **[Tutorial completo de instalação e configuração →](TUTORIAL.md)**

## Tecnologias

- Node.js + Vercel Serverless
- Telegram Bot API
- Geolocalização via navegador
- HTML5 + CSS3 + JavaScript

## Aviso Legal

Este projeto foi criado **exclusivamente para fins educacionais e de segurança**, para ajudar vítimas de golpes a coletar informações que possam ser usadas por autoridades. O uso indevido para invasão de privacidade ou outros fins ilícitos não é tolerado.

---

**Use com responsabilidade e sempre priorize sua segurança.** 🛡️

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdev-leonunes%2Fbackscan)
