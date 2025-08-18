import pool from '../database.js';

// Función auxiliar para parsear JSON de forma segura
const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return value; // Si no es JSON válido, devuelve el valor original
  }
};

export const guardarConversacion = async (req, res) => {
  const { nombre_usuario, respuestas, historial_completo } = req.body;

  if (!nombre_usuario || !respuestas || !historial_completo) {
    return res.status(400).json({ 
      error: 'Datos incompletos',
      requeridos: ['nombre_usuario', 'respuestas', 'historial_completo']
    });
  }

  try {
    // Extraer metadatos importantes
    const genero = historial_completo.find(msg => 
      msg.from === 'user' && (
        msg.text.toLowerCase().includes('hombre') || 
        msg.text.toLowerCase().includes('mujer')
      )
    )?.text || 'No especificado';

    const intereses = [];
    const productos = [];

    historial_completo.forEach((msg, i) => {
      if (msg.from === 'bot' && msg.text.includes('Qué tipo de producto')) {
        const respuesta = historial_completo[i+1]?.text;
        if (respuesta) intereses.push(respuesta);
      }
      if (msg.from === 'user' && msg.text.includes('Agregar')) {
        productos.push(msg.text.replace('Agregar ', ''));
      }
    });

    const metadatos = {
      genero,
      intereses,
      productos,
      fecha: new Date().toISOString()
    };

    const [result] = await pool.execute(
      `INSERT INTO conversaciones 
      (nombre_usuario, respuestas, historial_completo, metadatos) 
      VALUES (?, ?, ?, ?)`,
      [
        nombre_usuario,
        JSON.stringify(respuestas),
        JSON.stringify(historial_completo),
        JSON.stringify(metadatos)
      ]
    );

    res.status(201).json({
      id: result.insertId,
      nombre_usuario,
      metadatos,
      fecha: metadatos.fecha
    });

  } catch (error) {
    console.error('Error en guardarConversacion:', error);
    res.status(500).json({ 
      error: 'Error al guardar conversación',
      detalle: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const obtenerConversaciones = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM conversaciones ORDER BY fecha DESC"
    );

    res.json(
      rows.map(row => ({
        ...row,
        respuestas: safeParse(row.respuestas),
        historial_completo: safeParse(row.historial_completo),
        metadatos: safeParse(row.metadatos),
      }))
    );
  } catch (error) {
    console.error("Error en obtenerConversaciones:", error);
    res.status(500).json({
      error: "Error al obtener conversaciones",
      detalle:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
