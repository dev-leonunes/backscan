import { encodeReceiptData } from "./receipt-data.js";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
});

const form = document.getElementById("form-configuracao");
const nameInput = document.getElementById("nome");
const valueInput = document.getElementById("valor");
const errorMessage = document.getElementById("erro-configuracao");
const result = document.getElementById("resultado-configuracao");
const linkInput = document.getElementById("link-comprovante");
const copyButton = document.getElementById("copiar-link");
const copyMessage = document.getElementById("mensagem-copia");

let valueInCents = 0;

valueInput.addEventListener("input", () => {
    const digits = valueInput.value.replace(/\D/g, "");
    valueInCents = digits ? Number(digits) : 0;
    valueInput.value = digits ? currencyFormatter.format(valueInCents / 100) : "";
});

form.addEventListener("submit", event => {
    event.preventDefault();

    const nome = nameInput.value.trim();

    if (!nome) {
        showError("Informe o nome.");
        nameInput.focus();
        return;
    }

    if (!Number.isSafeInteger(valueInCents) || valueInCents <= 0) {
        showError("Informe um valor maior que zero.");
        valueInput.focus();
        return;
    }

    const encodedData = encodeReceiptData({ nome, valor: valueInCents / 100 });
    const receiptUrl = new URL("index.html", window.location.href);
    receiptUrl.searchParams.set("dados", encodedData);

    errorMessage.textContent = "";
    copyMessage.textContent = "";
    linkInput.value = receiptUrl.toString();
    result.hidden = false;
    linkInput.focus();
    linkInput.select();
});

copyButton.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(linkInput.value);
        copyMessage.textContent = "Link copiado.";
    } catch {
        copyMessage.textContent = "Não foi possível copiar. Selecione o link manualmente.";
        linkInput.focus();
        linkInput.select();
    }
});

function showError(message) {
    errorMessage.textContent = message;
    result.hidden = true;
}
