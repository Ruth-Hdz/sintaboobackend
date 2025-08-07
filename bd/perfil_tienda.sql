CREATE TABLE perfil_tienda (
    id INT AUTO_INCREMENT PRIMARY KEY,
    logo VARCHAR(255),
    descripcion TEXT,
    telefono VARCHAR(20),
    correo VARCHAR(100),
    direccion TEXT,
    horario_atencion VARCHAR(255),
    facebook VARCHAR(255),
    instagram VARCHAR(255),
    twitter VARCHAR(255),
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO perfil_tienda (
    logo,
    descripcion,
    telefono,
    correo,
    direccion,
    horario_atencion,
    facebook,
    instagram,
    twitter
) VALUES (
    'https://example.com/logo.png',
    'Tienda especializada en productos íntimos con total discreción y estilo.',
    '+52 55 1234 5678',
    'contacto@sintaboo.mx',
    'Av. Reforma 123, Ciudad de México',
    'Lunes a Viernes 10:00 - 19:00, Sábados 10:00 - 15:00',
    'https://facebook.com/sintaboo',
    'https://instagram.com/sintaboo',
    'https://twitter.com/sintaboo'
);
