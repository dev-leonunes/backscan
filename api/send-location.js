import axios from "axios";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Método não permitido"
        });
    }

    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({
            success: false,
            message: "Dados de localização incompletos"
        });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return res.status(400).json({
            success: false,
            message: "Coordenadas inválidas"
        });
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return res.status(400).json({
            success: false,
            message: "Coordenadas fora do intervalo permitido"
        });
    }

    const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.error("Variáveis de ambiente não configuradas");
        return res.status(500).json({
            success: false,
            message: "Serviço temporariamente indisponível"
        });
    }

    const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    const message = `📍 Localização do usuário:\nLatitude: ${lat}\nLongitude: ${lng}\n🔗 Maps: ${mapsUrl}`;

    try {
        await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
            },
            {
                timeout: 10000
            }
        );

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error.message);

        if (error.code === 'ECONNABORTED') {
            return res.status(504).json({
                success: false,
                message: "Tempo limite excedido"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Falha ao processar sua solicitação"
        });
    }
}
