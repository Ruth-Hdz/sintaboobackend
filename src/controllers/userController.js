import pool from '../database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET_USER;

export const registerUser = async (req, res) => {
  const { nombre, apellido, email, password, acepta_terminos } = req.body;

  if (!nombre || !apellido || !email || !password) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  if (!acepta_terminos) {
    return res.status(400).json({ message: 'Debe aceptar términos y condiciones' });
  }

  try {
    const [existingUser] = await pool.execute('SELECT id FROM usuarios WHERE correo = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Correo ya registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.execute(
      'INSERT INTO usuarios (nombre, apellido, correo, password, acepta_terminos) VALUES (?, ?, ?, ?, ?)',
      [nombre, apellido, email, hashedPassword, acepta_terminos]
    );

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error en registerUser:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const loginUser = async (req, res) => {
  const { identifier, password } = req.body; // identifier = correo

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  try {
    const [users] = await pool.execute('SELECT * FROM usuarios WHERE correo = ?', [identifier]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Correo no encontrado' });
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user.id, correo: user.correo, rol: 'usuario' },
      SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        fecha_creacion: user.fecha_creacion
      }
    });
  } catch (error) {
    console.error('Error en loginUser:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
