import pool from '../database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET_ADMIN;

export const loginAdmin = async (req, res) => {
  const { identifier, password } = req.body; // username o correo

  try {
    // Validar campos
    if (!identifier || !password) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    const [rows] = await pool.execute(
      'SELECT * FROM admins WHERE username = ? OR correo = ? LIMIT 1',
      [identifier, identifier]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Verifica tus datos' });
    }

    const admin = rows[0];

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, rol: admin.rol },
      SECRET,
      { expiresIn: '8h' }
    );

    res.status(200).json({
      message: 'Login exitoso',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        correo: admin.correo,
        rol: admin.rol,
      }
    });
  } catch (error) {
    console.error('Error en login admin:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// 📌 Obtener todos los admins
export const getAdmins = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, username, correo, rol, fecha_creacion FROM admins');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener admins:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const getAdminById = async (req, res) => {
  try {
    // Extraer el ID de los parámetros de la ruta
    const { id } = req.params;

    // Ejecutar consulta con parámetro preparado
    const [rows] = await pool.execute(
      'SELECT id, username, correo, rol, fecha_creacion, foto FROM admins WHERE id = ?',
      [id]
    );

    // Validar si existe el admin
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Admin no encontrado' });
    }

    // Retornar el primer resultado (único por ID)
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener admin por ID:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
// 📌 Crear un nuevo admin (solo superadmin)
export const createAdmin = async (req, res) => {
  const { username, correo, password, rol } = req.body;

  if (!username || !correo || !password || !rol) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  // 🚫 Un superadmin no puede crear otro superadmin
  if (rol === 'superadmin') {
    return res.status(403).json({ message: 'No puedes crear otro superadmin' });
  }

  try {
    const [exists] = await pool.execute(
      'SELECT id FROM admins WHERE username = ? OR correo = ?',
      [username, correo]
    );
    if (exists.length > 0) {
      return res.status(400).json({ message: 'El admin ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.execute(
      'INSERT INTO admins (username, correo, password, rol, fecha_creacion) VALUES (?, ?, ?, ?, NOW())',
      [username, correo, hashedPassword, rol]
    );

    res.status(201).json({ message: 'Admin creado correctamente' });
  } catch (error) {
    console.error('Error al crear admin:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// 📌 Actualizar un admin
export const updateAdmin = async (req, res) => {
  const { username, correo, password, rol } = req.body;

  // 🚫 No permitir que un superadmin convierta a alguien en superadmin
  if (rol === 'superadmin') {
    return res.status(403).json({ message: 'No puedes asignar rol superadmin' });
  }

  try {
    let query = 'UPDATE admins SET username = ?, correo = ?, rol = ?';
    const params = [username, correo, rol];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashedPassword);
    }

    query += ' WHERE id = ?';
    params.push(req.params.id);

    const [result] = await pool.execute(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Admin no encontrado' });
    }

    res.json({ message: 'Admin actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar admin:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// 📌 Eliminar un admin
export const deleteAdmin = async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM admins WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Admin no encontrado' });
    }

    res.json({ message: 'Admin eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar admin:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};


export const cambiarPasswordAdmin = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  try {
    // Obtener admin por id
    const [rows] = await pool.execute('SELECT password FROM admins WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Admin no encontrado' });
    }

    const admin = rows[0];

    // Verificar contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña actual incorrecta' });
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña en BD
    const [result] = await pool.execute('UPDATE admins SET password = ? WHERE id = ?', [hashedPassword, id]);

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: 'No se pudo actualizar la contraseña' });
    }

    res.status(200).json({ message: 'Contraseña actualizada correctamente' });

  } catch (error) {
    console.error('Error en changePasswordAdmin:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
