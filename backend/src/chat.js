const express = require('express');
const OpenAI = require('openai');
const router = express.Router();
const { elegirModelo } = require('./modeloSelector');
const { executeToolFunction } = require('./tools');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 📦 Definición de herramientas disponibles
const tools = [
  {
    type: 'function',
    function: {
      name: 'createRepo',
      description: 'Crea un nuevo repositorio en el proyecto actual',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Nombre del repo' },
          description: { type: 'string', description: 'Descripción del repo' },
        },
        required: ['name'],
      },
    },
  },
  {
  type: "function",
  function: {
    name: "writeFile",
    description: "Escribe un archivo con contenido.",
    parameters: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Ruta del archivo a escribir"
        },
        content: {
          type: "string",
          description: "Contenido del archivo"
        }
      },
      required: ["path", "content"]
    }
  }
},
  {
    type: 'function',
    function: {
      name: 'generateAngularComponent',
      description: 'Genera el código base para un componente Angular',
      parameters: {
        type: 'object',
        properties: {
          componentName: { type: 'string' },
        },
        required: ['componentName'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'sendEmail',
      description: 'Envía un correo electrónico simulado',
      parameters: {
        type: 'object',
        properties: {
          to: { type: 'string' },
          subject: { type: 'string' },
          body: { type: 'string' },
        },
        required: ['to', 'subject', 'body'],
      },
    },
  },
];

// 📩 Endpoint de chat
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

// 🧠 Lógica principal
async function procesarPrompt(prompt) {
  const resultado = elegirModelo(prompt);
  if (resultado.error) throw new Error(resultado.error);

  const { model } = resultado;

  const completion = await openai.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    tools,
    tool_choice: "auto",
  });

  const output = completion.choices[0];

  // 🤖 Si el modelo decide invocar una función...
  if (output.finish_reason === "tool_calls") {
    const call = output.message.tool_calls?.[0];
    const args = JSON.parse(call.function.arguments);
    const result = await executeToolFunction(call.function.name, args);
    return `🛠 Resultado de "${call.function.name}": ${result.message}`;
  }

  // 🗣 Respuesta normal
  return output.message.content || "No entendí nada, papu.";
}

module.exports = router;
