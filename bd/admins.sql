-- Crear tabla admins
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  correo VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  foto VARCHAR(255),
  rol ENUM('admin', 'superadmin') NOT NULL DEFAULT 'admin',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
