export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { text, targetLang } = req.body;
    const targetLangName = targetLang === 'en' ? 'English' : 'Bahasa Indonesia';

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "system", content: "You are a precise translator. Output ONLY the translated text, preserve markdown formatting strictly." },
                    { role: "user", content: `Translate the following text into ${targetLangName}:\n\n${text}` }
                ],
                max_tokens: 2048
            })
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ error: 'Gagal terhubung ke server backend' });
    }
}
  
