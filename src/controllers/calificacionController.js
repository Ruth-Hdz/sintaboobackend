import pool from '../database.js';

// Obtener todas las calificaciones (opcional)
export const getTodasCalificaciones = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         c.id, 
         c.estrellas, 
         c.comentario, 
         c.fecha_calificacion, 
         CONCAT(u.nombre, ' ', u.apellido) AS usuario, 
         c.id_producto
       FROM calificaciones c
       JOIN usuarios u ON c.id_usuario = u.id
       ORDER BY c.fecha_calificacion DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener calificaciones' });
  }
};

// Obtener calificaciones por producto
export const getCalificacionesByProducto = async (req, res) => {
  const { id_producto } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT 
         c.id, 
         c.estrellas, 
         c.comentario, 
         c.fecha_calificacion, 
         CONCAT(u.nombre, ' ', u.apellido) AS usuario,
         c.id_usuario
       FROM calificaciones c
       JOIN usuarios u ON c.id_usuario = u.id
       WHERE c.id_producto = ? 
       ORDER BY c.fecha_calificacion DESC`,
      [id_producto]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener calificaciones por producto' });
  }
};

// Crear nueva calificación
export const createCalificacion = async (req, res) => {
  const { id_usuario, id_producto, estrellas, comentario } = req.body;

  if (!id_usuario || !id_producto || !estrellas) {
    return res.status(400).json({ message: 'Faltan datos obligatorios (id_usuario, id_producto, estrellas)' });
  }

  try {
    // Verificar si ya existe reseña del usuario para ese producto
    const [existe] = await pool.query(
      `SELECT id FROM calificaciones WHERE id_usuario = ? AND id_producto = ?`,
      [id_usuario, id_producto]
    );

    if (existe.length > 0) {
      return res.status(409).json({ message: 'Ya existe una reseña para este producto por este usuario' });
    }

    const [result] = await pool.query(
      `INSERT INTO calificaciones (id_usuario, id_producto, estrellas, comentario) VALUES (?, ?, ?, ?)`,
      [id_usuario, id_producto, estrellas, comentario || null]
    );

    res.status(201).json({ message: 'Calificación creada', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear calificación' });
  }
};

// Actualizar calificación existente
export const updateCalificacion = async (req, res) => {
  const { id } = req.params;
  const { estrellas, comentario } = req.body;

  if (!estrellas) {
    return res.status(400).json({ message: 'El campo estrellas es obligatorio' });
  }

  try {
    const [result] = await pool.query(
      `UPDATE calificaciones SET estrellas = ?, comentario = ? WHERE id = ?`,
      [estrellas, comentario || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Calificación no encontrada' });
    }

    res.json({ message: 'Calificación actualizada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar calificación' });
  }
};

// Eliminar calificación
export const deleteCalificacion = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      `DELETE FROM calificaciones WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Calificación no encontrada' });
    }

    res.json({ message: 'Calificación eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar calificación' });
  }
};
