// tools.js

async function createRepo({ name, description }) {
  console.log(`🚀 Simulando creación de repo: ${name} - ${description}`);
  return { success: true, message: `Repositorio "${name}" creado.` };
}

async function writeFile(params) {
  const { path, content } = params;

  if (!path || !content) {
    console.error("❌ Parámetros faltantes en writeFile:", params);
    throw new Error("Faltan parámetros: path y content son requeridos.");
  }

  console.log(`📝 Simulando escritura en archivo: ${path}`);
  console.log(`🧾 Contenido:\n${content}`);
  return `📄 Archivo escrito en \"${path}\" con éxito.`;
}


async function generateAngularComponent({ name, path }) {
  const archivo = `${path}/${name}.component.ts`;
  const contenido = `
import { Component } from '@angular/core';

@Component({
  selector: 'app-${name}',
  templateUrl: './${name}.component.html',
  styleUrls: ['./${name}.component.css']
})
export class ${capitalize(name)}Component {
  // Épico como siempre, papu.
}
  `.trim();

  console.log('🧩 Simulando generación de componente Angular:');
  console.log('📂 Archivo:', archivo);
  console.log('🧠 Contenido:\n', contenido);

  return `Componente Angular '${name}' generado en '${archivo}', papu.`;
}

async function sendEmail({ to, subject, body }) {
  console.log('📤 Simulando envío de email:');
  console.log('👤 Para:', to);
  console.log('📝 Asunto:', subject);
  console.log('💬 Cuerpo:\n', body);

  return `Email enviado a '${to}' con asunto '${subject}', papu.`;
}


// Utilidad para capitalizar nombres de componentes
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Diccionario para ejecutar funciones desde nombre string
const functionsMap = {
  createRepo,
  writeFile,
  generateAngularComponent,
  sendEmail,
};

module.exports = {
  executeToolFunction: async (functionName, args) => {
    const fn = functionsMap[functionName];
    if (!fn) throw new Error(`Función desconocida: ${functionName}`);
    return await fn(args);
  },
};
