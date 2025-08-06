-- 🔄 CREAR TABLA calificaciones
CREATE TABLE calificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_producto INT NOT NULL,
    estrellas TINYINT NOT NULL CHECK (estrellas BETWEEN 1 AND 5),
    comentario TEXT,
    fecha_calificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_producto) REFERENCES inventory(id),
    UNIQUE (id_usuario, id_producto)
);
-- ⭐ INSERTAR CALIFICACIONES (50-200 por producto)
INSERT IGNORE INTO calificaciones (id_usuario, id_producto, estrellas, comentario, fecha_calificacion)
WITH RECURSIVE nums AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM nums WHERE n < 200
)
SELECT 
  FLOOR(1000 + RAND() * 10000),
  p.id,
  CASE
    WHEN RAND() < 0.6 THEN FLOOR(4 + RAND() * 2)  -- 60% 4-5 estrellas
    WHEN RAND() < 0.8 THEN 3                     -- 20% 3 estrellas
    ELSE FLOOR(1 + RAND() * 2)                   -- 20% 1-2 estrellas
  END,
  CASE 
    WHEN RAND() > 0.5 THEN 
      CONCAT('Producto ', p.nombre, ' es ', 
        CASE 
          WHEN RAND() < 0.6 THEN 'excelente'
          WHEN RAND() < 0.8 THEN 'bueno'
          ELSE 'regular'
        END)
    ELSE NULL
  END,
  TIMESTAMPADD(SECOND, FLOOR(RAND() * 63072000), '2023-01-01')
FROM 
  inventory p
JOIN 
  nums ON nums.n <= FLOOR(50 + RAND() * 150)
WHERE 
  p.estado = 'activo';
