import db from '../database.js';

export const getCategorias = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM categorias');
    
    // Verifica qué datos estás recibiendo de la base de datos
    console.log('Datos de categorías:', rows);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron categorías' });
    }
    
    res.json(rows);
  } catch (error) {
    console.error('Error en getCategorias:', error);
    res.status(500).json({ 
      message: 'Error al obtener categorías',
      error: error.message 
    });
  }
};

export const createCategoria = async (req, res) => {
  const { nombre, icono } = req.body;

  if (!nombre || !icono) {
    return res.status(400).json({ message: 'Nombre e icono son obligatorios' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO categorias (nombre, icono) VALUES (?, ?)',
      [nombre, icono]
    );

    res.status(201).json({ id: result.insertId, nombre, icono });
  } catch (error) {
    console.error('Error en createCategoria:', error);
    res.status(500).json({ message: 'Error al crear categoría', error: error.message });
  }
};
