export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8586649939:AAH3DBAhWIu4adoq7U6_pYfJTrk87Pejm3I';
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-5190150862';

    try {
        const { message, imageUrl } = req.body;
        const baseUrl = `https://api.telegram.org/bot${BOT_TOKEN}`;
        
        let url, payload;
        if (imageUrl) {
            url = `${baseUrl}/sendPhoto`;
            payload = { chat_id: CHAT_ID, photo: imageUrl, caption: message, parse_mode: 'Markdown' };
        } else {
            url = `${baseUrl}/sendMessage`;
            payload = { chat_id: CHAT_ID, text: message, parse_mode: 'Markdown' };
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Telegram Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
