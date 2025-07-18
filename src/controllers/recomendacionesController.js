import db from '../database.js';

// Obtener productos recomendados (ejemplo: los más baratos o con más stock)
export const getRecomendaciones = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT i.id, i.nombre, i.descripcion, i.precio, i.stock, i.imagen_url, i.estado, c.nombre AS categoria
      FROM inventory i
      JOIN categorias c ON i.id_categoria = c.id
      WHERE i.estado = 'activo'
      ORDER BY i.stock DESC
      LIMIT 6
    `);

    res.status(200).json({ recomendaciones: rows });
  } catch (error) {
    console.error('Error al obtener recomendaciones:', error);
    res.status(500).json({ mensaje: 'Error al obtener recomendaciones' });
  }
};
