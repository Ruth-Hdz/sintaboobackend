import bcrypt from 'bcrypt';
import db from '../database.js';

export const registerUser = async (req, res) => {
  const { nombre, apellido, email, password, acepta_terminos } = req.body;

  // Validación de campos obligatorios
  if (!nombre || !apellido || !email || !password || acepta_terminos !== true) {
    return res.status(400).json({
      message: 'Todos los campos son obligatorios y debe aceptar los términos.',
    });
  }

  try {
    // Verificar si el usuario ya existe
    const [userExist] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (userExist.length > 0) {
      return res.status(409).json({ message: 'Correo ya registrado' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Asignar rol usuario por defecto (id_rol = 3)
    const id_rol = 3;
    const genero = 'Otro';

    // Insertar nuevo usuario
    await db.query(
      'INSERT INTO users (nombre, apellido, email, password, id_rol, genero, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [nombre, apellido, email, hashedPassword, id_rol, genero]
    );

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { identifier, password } = req.body; // puede ser email o nombre

  try {
    const [users] = await db.query(
      `SELECT u.*, r.nombre as rol_nombre 
       FROM users u
       JOIN roles r ON u.id_rol = r.id
       WHERE u.email = ? OR u.nombre = ? 
       LIMIT 1`,
      [identifier, identifier]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const user = users[0];
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    res.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol_nombre,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const loginAdmin = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const [rows] = await db.execute(
      `SELECT u.*, r.nombre AS rol_nombre
       FROM users u
       JOIN roles r ON u.id_rol = r.id
       WHERE (u.email = ? OR u.nombre = ?)
         AND r.nombre IN ('admin', 'superadmin')
       LIMIT 1`,
      [identifier, identifier]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado o no autorizado" });
    }

    const user = rows[0];

    // Verificar contraseña
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Puedes generar token si lo necesitas
    return res.status(200).json({ message: "Inicio de sesión exitoso", user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
