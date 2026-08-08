export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { text, targetLang, messages, model } = req.body;
    let payloadMessages = messages;

    if (!payloadMessages && text) {
        const targetLangName = targetLang === 'en' ? 'English' : 'Bahasa Indonesia';
        const systemPrompt = targetLang 
            ? "You are a precise translator. Output ONLY the translated text, preserve markdown formatting strictly."
            : "You are Raxs AI, a helpful AI assistant.";
        const userPrompt = targetLang 
            ? `Translate the following text into ${targetLangName}:\n\n${text}`
            : text;

        payloadMessages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ];
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model || "llama-3.1-8b-instant",
                messages: payloadMessages,
                max_tokens: 2048
            })
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (err) {
        return res.status(500).json({ error: 'Gagal terhubung ke server backend' });
    }
}
