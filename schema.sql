CREATE DATABASE bd_sintaboo;
USE bd_sintaboo;

CREATE TABLE categorias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL
);

CREATE TABLE inventory (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL,
  imagen_url VARCHAR(500), -- aquí se guardará algo como "/uploads/imagen.jpg"
  id_categoria INT NOT NULL,
  FOREIGN KEY (id_categoria) REFERENCES categorias(id)
);

INSERT INTO categorias (nombre) VALUES
  ('Juguetes'),
  ('Lubricantes'),
  ('Lencería'),
  ('Bondage'),
  ('Accesorios');

  INSERT INTO inventory (nombre, descripcion, precio, stock, imagen_url, id_categoria) VALUES
  ('Anillo Vibrador', 'Silicón suave, 10 modos.', 499.00, 15, '/uploads/anillo.jpg', 1),
  ('Lubricante sabor cereza', 'Base agua, comestible.', 199.00, 30, '/uploads/lubricante.jpg', 2),
  ('Lencería negra encaje', 'Transparente y ajustada.', 599.00, 10, '/uploads/lenceria.jpg', 3);

SELECT * FROM inventory;


SELECT
  i.nombre AS producto,
  i.descripcion,
  i.precio,
  i.stock,
  i.imagen_url,
  i.id,
  c.nombre AS categoria
FROM inventory i
JOIN categorias c ON i.id_categoria = c.id;
