
CREATE DATABASE bd_sintaboo;
USE bd_sintaboo;

-- PASO 2: Crear tabla 'categorias' (sin valor por defecto en icono)
CREATE TABLE categorias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  icono VARCHAR(50) NOT NULL
);

-- PASO 3: Crear tabla 'inventory'
CREATE TABLE inventory (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL,
  imagen_url VARCHAR(500),
  id_categoria INT NOT NULL,
  estado ENUM('activo', 'no activo') NOT NULL DEFAULT 'activo',
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_categoria) REFERENCES categorias(id)
);

-- PASO 4: Insertar categorías con íconos
INSERT INTO categorias (nombre, icono) VALUES
  ('Juguetes', 'FaGamepad'),
  ('Lubricantes', 'FaTint'),
  ('Lencería', 'FaFemale'),
  ('Bondage', 'FaLock'),
  ('Accesorios', 'FaGem'),
  ('Cosméticos', 'FaStar'),
  ('Juegos de pareja', 'FaDice'),
  ('Disfraces', 'FaMask'),
  ('Kits sensuales', 'FaGift'),
  ('Libros eróticos', 'FaBook');

-- PASO 5: Insertar productos con más variedad
INSERT INTO inventory (nombre, descripcion, precio, stock, imagen_url, id_categoria, estado) VALUES
  ('Anillo Vibrador', 'Silicón suave, 10 modos de vibración.', 499.00, 15, '/uploads/anillo.jpg', 1, 'activo'),
  ('Lubricante sabor cereza', 'Lubricante base agua, comestible y seguro para juguetes.', 199.00, 30, '/uploads/lubricante.jpg', 2, 'activo'),
  ('Lencería negra encaje', 'Conjunto transparente, ideal para noches especiales.', 599.00, 10, '/uploads/lenceria.jpg', 3, 'no activo'),
  ('Kit Bondage básico', 'Incluye esposas, vendas y látigo suave.', 899.00, 8, '/uploads/bondage.jpg', 4, 'activo'),
  ('Plug anal con vibración', 'Diseño ergonómico con control remoto.', 750.00, 12, '/uploads/plug.jpg', 5, 'activo'),
  ('Aceite de masaje caliente', 'Sensación térmica con aroma a vainilla.', 159.00, 25, '/uploads/aceite.jpg', 6, 'activo'),
  ('Cartas para parejas', 'Juego sensual con retos eróticos.', 129.00, 40, '/uploads/cartas.jpg', 7, 'activo'),
  ('Disfraz de enfermera sexy', 'Incluye vestido, gorro y tanga.', 679.00, 7, '/uploads/enfermera.jpg', 8, 'activo'),
  ('Kit sensual de viaje', 'Mini vibrador + lubricante + lencería.', 999.00, 5, '/uploads/kitviaje.jpg', 9, 'activo'),
  ('50 Sombras de Grey', 'Novela erótica bestseller.', 349.00, 20, '/uploads/libro.jpg', 10, 'activo');

-- PASO 6: Consulta para ver inventario con sus categorías
SELECT
  i.id,
  i.nombre AS producto,
  i.descripcion,
  i.precio,
  i.stock,
  i.imagen_url,
  i.estado,
  i.fecha_creacion,
  c.nombre AS categoria,
  c.icono
FROM inventory i
JOIN categorias c ON i.id_categoria = c.id;
