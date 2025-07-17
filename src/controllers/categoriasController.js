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