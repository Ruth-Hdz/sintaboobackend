CREATE TABLE compras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10, 2),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE detalle_compra (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_compra INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10, 2),
  FOREIGN KEY (id_compra) REFERENCES compras(id) ON DELETE CASCADE,
  FOREIGN KEY (id_producto) REFERENCES inventory(id)
);
