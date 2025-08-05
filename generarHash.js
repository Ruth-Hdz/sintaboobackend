// generarHash.js
import bcrypt from 'bcrypt';

const generarHash = async () => {
  const hash = await bcrypt.hash('admin123', 10); // Puedes cambiar 'admin123' por tu contraseña deseada
  console.log('Hash generado:', hash);
};

generarHash();
