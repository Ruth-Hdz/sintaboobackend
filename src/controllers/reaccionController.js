import pool from '../database.js';

// Obtener reacciones por producto (cantidad)
export const getReaccionesByProducto = async (req, res) => {
  const { id_producto } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT COUNT(*) AS total_reacciones FROM reacciones WHERE id_producto = ?`,
      [id_producto]
    );
    res.json({ total_reacciones: rows[0].total_reacciones });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener reacciones' });
  }
};

// Crear reacción (like) para un producto por usuario
export const createReaccion = async (req, res) => {
  const { id_usuario, id_producto } = req.body;

  if (!id_usuario || !id_producto) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  try {
    // Evitar duplicados: verifica si ya existe la reacción
    const [existing] = await pool.query(
      `SELECT id FROM reacciones WHERE id_usuario = ? AND id_producto = ?`,
      [id_usuario, id_producto]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Ya reaccionaste a este producto' });
    }

    const [result] = await pool.query(
      `INSERT INTO reacciones (id_usuario, id_producto) VALUES (?, ?)`,
      [id_usuario, id_producto]
    );

    res.status(201).json({ message: 'Reacción creada', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear reacción' });
  }
};

// Eliminar reacción (unlike)
export const deleteReaccion = async (req, res) => {
  const { id_usuario, id_producto } = req.query;  // desde query params

  if (!id_usuario || !id_producto) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  try {
    const [result] = await pool.query(
      `DELETE FROM reacciones WHERE id_usuario = ? AND id_producto = ?`,
      [id_usuario, id_producto]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No se encontró reacción para eliminar' });
    }

    res.json({ message: 'Reacción eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar reacción' });
  }
};
