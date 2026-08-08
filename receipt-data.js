export const RECEIPT_DATA_TYPE = "comprovante";

export function validateReceiptData(data) {
    if (!data || typeof data !== "object") {
        return null;
    }

    const nome = typeof data.nome === "string" ? data.nome.trim() : "";
    const valor = data.valor;

    if (data.tipo !== RECEIPT_DATA_TYPE) {
        return null;
    }

    if (!nome || nome.length > 120) {
        return null;
    }

    if (typeof valor !== "number" || !Number.isFinite(valor) || valor <= 0) {
        return null;
    }

    const valorEmCentavos = valor * 100;
    const centavosArredondados = Math.round(valorEmCentavos);

    if (Math.abs(valorEmCentavos - centavosArredondados) > 1e-8 || !Number.isSafeInteger(centavosArredondados)) {
        return null;
    }

    return { tipo: RECEIPT_DATA_TYPE, nome, valor };
}

export function encodeReceiptData(data) {
    const validData = validateReceiptData(data);

    if (!validData) {
        throw new Error("Dados do comprovante inválidos.");
    }

    const bytes = new TextEncoder().encode(JSON.stringify(validData));
    const binary = Array.from(bytes, byte => String.fromCharCode(byte)).join("");

    return btoa(binary)
        .replaceAll("+", "-")
        .replaceAll("/", "_")
        .replace(/=+$/, "");
}

export function decodeReceiptData(encodedData) {
    if (!encodedData) {
        return null;
    }

    try {
        const base64 = encodedData.replaceAll("-", "+").replaceAll("_", "/");
        const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
        const binary = atob(paddedBase64);
        const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
        const data = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));

        return validateReceiptData(data);
    } catch {
        return null;
    }
}
