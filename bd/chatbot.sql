CREATE TABLE conversaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(100) NOT NULL,
    respuestas TEXT NOT NULL,
    historial_completo TEXT NOT NULL,
    metadatos TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO conversaciones 
(nombre_usuario, respuestas, historial_completo, metadatos) 
VALUES (
  'Ana',
  '["Ana","Mujer","Lencería","Sí, muéstrame","Agregar Body Transparente"]',
  '[{"from":"bot","text":"¡Hola! Soy tu asistente SexyBot 😏. ¿Cómo te llamas?"},{"from":"user","text":"Ana"},{"from":"bot","text":"¡Encantado de conocerte, Ana! ¿Eres hombre o mujer?"},{"from":"user","text":"Mujer"},{"from":"bot","text":"¿Qué tipo de producto te interesa hoy?"},{"from":"user","text":"Lencería"},{"from":"bot","text":"Tenemos conjuntos sensuales, bodys y accesorios de lencería. ¿Quieres ver opciones?"},{"from":"user","text":"Sí, muéstrame"},{"from":"bot","text":"Opciones:\n- Conjunto Rojo\n- Body Transparente\n- Bata de Seda"},{"from":"user","text":"Agregar Body Transparente"},{"from":"bot","text":"¡Gracias por hablar conmigo! ❤️"}]',
  '{"genero":"Mujer","intereses":["Lencería"],"productos":["Body Transparente"],"fecha":"2025-08-17T02:00:00.000Z"}'
);
