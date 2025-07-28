const express = require('express');
const OpenAI = require('openai');
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt es requerido, papu.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const response = completion.choices[0]?.message?.content || 'No entendí ni jota.';
    res.json({ response });
  } catch (error) {
    console.error('💥 Error con OpenAI:', error);
    res.status(500).json({ error: 'Error interno del Papu' });
  }
});

module.exports = router;
