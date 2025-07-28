const express = require('express');
const OpenAI = require('openai');
const router = express.Router();
const { elegirModelo } = require('./modeloSelector');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
router.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt es requerido, papu.' });
  }

  try {
    const response = await procesarPrompt(prompt);
    res.json({ response });
  } catch (error) {
    console.error('💥 Error con OpenAI:', error);
    res.status(500).json({ error: 'Error interno del Papu' });
  }
});

async function procesarPrompt(prompt) {
  const resultado = elegirModelo(prompt);
  console.log(resultado)
  if (resultado.error) throw new Error(resultado.error);

  const { model } = resultado;
  
  const completion = await openai.chat.completions.create({
    model: model,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}

module.exports = router;
