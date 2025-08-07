import db from '../database.js';

// Obtener todos los consejos
export const getConsejos = async (req, res) => {
  try {
    const [result] = await db.execute('SELECT * FROM consejos ORDER BY fecha_creacion DESC');
    res.json(result);
  } catch (error) {
    console.error('Error al obtener consejos:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Crear un nuevo consejo
export const createConsejo = async (req, res) => {
  try {
    const { titulo, contenido } = req.body;

    if (!titulo || !contenido) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    const [result] = await db.execute(
      'INSERT INTO consejos (titulo, contenido) VALUES (?, ?)',
      [titulo, contenido]
    );

    const [newConsejo] = await db.execute(
      'SELECT * FROM consejos WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Consejo creado correctamente',
      consejo: newConsejo[0],
    });
  } catch (error) {
    console.error('Error al crear consejo:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Eliminar un consejo
export const deleteConsejo = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute('DELETE FROM consejos WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Consejo no encontrado' });
    }

    res.json({ message: 'Consejo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar consejo:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Actualizar un consejo
export const updateConsejo = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, contenido } = req.body;

    const [existing] = await db.execute('SELECT * FROM consejos WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Consejo no encontrado' });
    }

    const nuevoTitulo = titulo || existing[0].titulo;
    const nuevoContenido = contenido || existing[0].contenido;

    await db.execute(
      'UPDATE consejos SET titulo = ?, contenido = ? WHERE id = ?',
      [nuevoTitulo, nuevoContenido, id]
    );

    const [updated] = await db.execute('SELECT * FROM consejos WHERE id = ?', [id]);

    res.json({
      message: 'Consejo actualizado correctamente',
      consejo: updated[0],
    });
  } catch (error) {
    console.error('Error al actualizar consejo:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
