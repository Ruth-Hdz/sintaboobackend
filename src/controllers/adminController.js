import pool from '../database.js';
import bcrypt from 'bcrypt';

export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM admins WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const admin = rows[0];

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Si es correcto, devolver solo datos útiles
    res.status(200).json({
      id: admin.id,
      username: admin.username,
      rol: admin.rol,
      message: 'Login exitoso',
    });
  } catch (error) {
    console.error('Error en login admin:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};
