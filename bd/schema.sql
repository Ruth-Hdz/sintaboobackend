-- Paso 2: Crear la base de datos nuevamente
CREATE DATABASE bd_sintaboo;
USE bd_sintaboo;

-- Paso 3: Crear la tabla categorías
CREATE TABLE categorias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL
);

-- Paso 4: Crear la tabla inventory con el campo estado
CREATE TABLE inventory (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL,
  imagen_url VARCHAR(500),
  id_categoria INT NOT NULL,
  estado ENUM('activo', 'no activo') NOT NULL DEFAULT 'activo',
  FOREIGN KEY (id_categoria) REFERENCES categorias(id)
);

-- Paso 5: Insertar datos de ejemplo
INSERT INTO categorias (nombre) VALUES
  ('Juguetes'),
  ('Lubricantes'),
  ('Lencería'),
  ('Bondage'),
  ('Accesorios');

INSERT INTO inventory (nombre, descripcion, precio, stock, imagen_url, id_categoria, estado) VALUES
  ('Anillo Vibrador', 'Silicón suave, 10 modos.', 499.00, 15, '/uploads/anillo.jpg', 1, 'activo'),
  ('Lubricante sabor cereza', 'Base agua, comestible.', 199.00, 30, '/uploads/lubricante.jpg', 2, 'activo'),
  ('Lencería negra encaje', 'Transparente y ajustada.', 599.00, 10, '/uploads/lenceria.jpg', 3, 'no activo');

-- Paso 6: Consulta para verificar
SELECT * FROM inventory;SELECT
  i.nombre AS producto,
  i.descripcion,
  i.precio,
  i.stock,
  i.imagen_url,
  i.id,
  i.estado,
  c.nombre AS categoria
FROM inventory i
JOIN categorias c ON i.id_categoria = c.id;