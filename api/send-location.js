import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: "Método não permitido" });
    }

    const { latitude, longitude, maps } = req.body;

    const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.CHAT_ID;

    const message = `A localização do usuário é:\nLatitude: ${latitude}\nLongitude: ${longitude}\nMaps: ${maps}`;

    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Erro ao enviar para o Telegram:', error);
        return res.status(500).json({ success: false, message: "Erro ao enviar para o Telegram" });
    }
}
