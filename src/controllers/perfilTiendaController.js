import db from '../database.js';

export const getPerfilTienda = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM perfil_tienda LIMIT 1');
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Perfil de tienda no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el perfil de la tienda:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const updatePerfilTienda = async (req, res) => {
  try {
    const {
      descripcion,
      telefono,
      correo,
      direccion,
      horario_atencion,
      facebook,
      instagram,
      twitter,
    } = req.body;

    // Si se subió una imagen, guarda la ruta relativa para acceder desde el frontend
    const logo = req.file ? `/uploads/${req.file.filename}` : null;

    let query = `UPDATE perfil_tienda SET 
      descripcion = ?, telefono = ?, correo = ?, direccion = ?, 
      horario_atencion = ?, facebook = ?, instagram = ?, twitter = ?, actualizado_en = NOW()`;

    const values = [
      descripcion,
      telefono,
      correo,
      direccion,
      horario_atencion,
      facebook,
      instagram,
      twitter,
    ];

    if (logo) {
      query += `, logo = ?`;
      values.push(logo);
    }

    query += ` WHERE id = 1`;

    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    res.json({ message: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
