-- ⚠️ ELIMINA TABLAS SI EXISTEN
DROP TABLE IF EXISTS reacciones;
DROP TABLE IF EXISTS calificaciones;



-- 🔄 CREAR TABLA reacciones
CREATE TABLE reacciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_producto INT NOT NULL,
    fecha_reaccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_producto) REFERENCES inventory(id),
    UNIQUE (id_usuario, id_producto)
);

-- 🚫 DESACTIVAR CLAVES FORÁNEAS TEMPORALMENTE
SET FOREIGN_KEY_CHECKS = 0;

-- ❤️ INSERTAR REACCIONES (500-1000 por producto)
INSERT IGNORE INTO reacciones (id_usuario, id_producto, fecha_reaccion)
WITH RECURSIVE nums AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM nums WHERE n < 1000
)
SELECT 
  FLOOR(1000 + RAND() * 10000),  -- id_usuario aleatorio
  p.id,
  TIMESTAMPADD(SECOND, FLOOR(RAND() * 63072000), '2023-01-01')  -- Fecha aleatoria entre 2023 y ahora
FROM 
  inventory p
JOIN 
  nums ON nums.n <= FLOOR(500 + RAND() * 500)  -- 500-1000 reacciones por producto
WHERE 
  p.estado = 'activo';


-- ✅ ACTIVAR CLAVES FORÁNEAS NUEVAMENTE
SET FOREIGN_KEY_CHECKS = 1;
