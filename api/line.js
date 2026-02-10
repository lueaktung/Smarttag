// /api/line.js — Vercel Serverless Function สำหรับส่ง LINE OA Push Message
// ใช้แก้ปัญหา CORS ที่ browser เรียก LINE API โดยตรงไม่ได้

const LINE_OA_TOKEN = process.env.LINE_OA_TOKEN || '1zglfjM9Pls0CZpEqTJ5k7/KMkcXnokSDpUwiocCIQpD4HGt0arhfEQlE0rqHbmgi4OufBWkMiwwB2pep7/PKQNsdS5Ss4bXYdBldvWBQXHRA0scdStytpW0JTkhFddQFjk++kAmJ6ZF6tglAq9WjgdB04t89/1O/w1cDnyilFU=';
const LINE_GROUP_ID = process.env.LINE_GROUP_ID || 'Ce35a8177f013e44e9c08ed446eefb415';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, imageUrl } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const messages = [{ type: 'text', text: message }];
        if (imageUrl && imageUrl.startsWith('http')) {
            messages.push({
                type: 'image',
                originalContentUrl: imageUrl,
                previewImageUrl: imageUrl
            });
        }

        const response = await fetch('https://api.line.me/v2/bot/message/push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + LINE_OA_TOKEN
            },
            body: JSON.stringify({
                to: LINE_GROUP_ID,
                messages: messages
            })
        });

        const data = await response.text();
        
        if (!response.ok) {
            console.error('LINE API Error:', response.status, data);
            return res.status(response.status).json({ error: 'LINE API Error', details: data });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: error.message });
    }
}