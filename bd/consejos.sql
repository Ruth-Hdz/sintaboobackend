CREATE TABLE consejos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  contenido TEXT NOT NULL,
  imagen VARCHAR(255),  -- Nueva columna para la foto (ruta o URL)
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO consejos (titulo, contenido, imagen) VALUES
('Importancia de la limpieza', 
 'No limpiar tus juguetes íntimos, usar productos incorrectos o guardarlos en un lugar inadecuado puede suponer que se estropeen y tengas que deshacerte de ellos. Sin embargo (y más allá del impacto que pueda tener para tu bolsillo), si nunca esterilizas y desinfectas tus juguetes eróticos corres el riesgo de contraer infecciones en la zona íntima, hongos e incluso enfermedades de transmisión sexual.',
 '/imagenes/consejos/limpieza.jpg'),

('Métodos generales de limpieza', 
 'Aunque todo dependerá de su material, la mayoría de juguetes sexuales pueden lavarse con agua tibia y jabón neutro (pH 5.5), sin perfumes ni químicos. Además, existen productos limpiadores específicos compatibles con todo tipo de juguetes (succionadores, bolas chinas, vibradores). Estos sprays (como Intimina o Espumín) son de acción rápida, no contienen alcohol y respetan el pH de la piel.',
 '/imagenes/consejos/metodos_limpieza.jpg'),

('Revisión del fabricante', 
 'Antes de limpiar, verifica las instrucciones del fabricante (en la caja, manual o web). Juguetes de marcas como Satisfyer, Lelo, Intimina o Tenga suelen tener información accesible. Si no encuentras datos oficiales o pierdes la confianza, considera reemplazarlo. Recuerda que los juguetes tienen vida útil limitada y tu primera elección no tiene por qué ser la definitiva.',
 '/imagenes/consejos/revision_fabricante.jpg'),

('Limpieza por materiales flexibles', 
 '• Silicona: Jabón neutro o limpiador específico. Pueden hervirse si no tienen componentes electrónicos.\n• Látex/Gelatina: Sólo agua tibia y jabón neutro. ¡Evitar agua hirviendo!\n• Juguetes penetrables (ej. vaginas en lata): Agua tibia + jabón neutro + polvos renovadores aplicados en seco.',
 '/imagenes/consejos/materiales_flexibles.jpg'),

('Limpieza por materiales rígidos', 
 '• Plástico/Acrílicos: Agua tibia y jabón neutro.\n• Cristal/Metálicos: Agua templada con jabón neutro. Pueden hervirse brevemente para desinfección.',
 '/imagenes/consejos/materiales_rigidos.jpg'),

('Claves de durabilidad', 
 '1) Retira pilas antes de lavar\n2) Verifica si es "sumergible" (no sólo resistente a salpicaduras)\n3) Nunca uses lavavajillas\n4) Usa lubricantes de base acuática (evita aceites/siliconas que dañan materiales)\n5) Seca completamente antes de guardar\n6) Revisa periódicamente cambios de color/textura.',
 '/imagenes/consejos/durabilidad.jpg'),

('Prevención de infecciones', 
 '- Lava siempre ANTES y DESPUÉS de cada uso (incluso si es nuevo)\n- Usa preservativo (especialmente al compartir juguetes o estimular múltiples zonas)\n- No compartas juguetes no cubribles con condón\n- Considera tener juguetes personales si se usan en pareja.',
 '/imagenes/consejos/prevencion_infecciones.jpg'),

('Almacenamiento adecuado', 
 'Guárdalos en:\n1) Bolsas de tela (satén) o estuches individuales\n2) Lugar fresco, seco y oscuro (nunca expuesto al sol/calor)\n3) Separados entre sí para evitar reacciones químicas\n4) ¡Siempre limpios y totalmente secos!\nEvita la caja original si no garantiza condiciones higiénicas.',
 '/imagenes/consejos/almacenamiento.jpg');
