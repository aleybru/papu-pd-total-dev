// modeloSelector.js

function elegirModelo(prompt) {
  if (!prompt || prompt.trim() === '') {
    return { error: "Prompt vacío, papu." };
  }

  const promptLower = prompt.toLowerCase();

  // 🧠 Tareas livianas y de charla básica
  const tareasSimples = ['resumen', 'traducción', 'explicame', 'chiste', 'frase', 'descripción', 'listar', 'qué es'];
  if (tareasSimples.some(t => promptLower.includes(t))) {
    return { model: 'gpt-4.1-nano' };
  }

  // 👨‍💻 Peticiones relacionadas con programación o código
  const tareasDeCodigo = ['código', 'programá', 'typescript', 'javascript', 'html', 'api', 'sql', 'regex'];
  if (tareasDeCodigo.some(t => promptLower.includes(t))) {
    return { model: 'gpt-4o-mini' };
  }

  // 📊 Consultas más elaboradas o que impliquen razonamiento
  const tareasComplejas = ['analizá', 'estrategia', 'diagnóstico', 'propuesta', 'plan', 'hipótesis'];
  if (prompt.length > 1000 || tareasComplejas.some(t => promptLower.includes(t))) {
    return { model: 'gpt-4.1' };
  }

  // 🎙️ Si pide audio o voz (por si usás TTS en algún lado)
  if (promptLower.includes('voz') || promptLower.includes('hablá') || promptLower.includes('tts')) {
    return { model: 'gpt-4o-mini-tts' };
  }

  // 🎨 Si fuera una imagen (para dall-e, por si usás en otro endpoint)
  if (promptLower.includes('imagen') || promptLower.includes('dibujo') || promptLower.includes('generá una imagen')) {
    return { model: 'dall-e-3' };
  }

  // 🧠 Default versátil y balanceado
  return { model: 'gpt-4o' };
}

module.exports = { elegirModelo };
