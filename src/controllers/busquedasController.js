import db from '../database.js';

export const buscarProductosCategorias = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: "Debes enviar el parámetro 'q' para buscar."
    });
  }

  try {
    const searchTerm = `%${q}%`;

    const query = `
  SELECT 
    'producto' AS tipo,
    p.id,
    p.nombre,
    p.descripcion,
    p.precio,
    p.stock,
    p.estado,
    p.imagen_url AS imagen,
    p.fecha_creacion,
    CAST(
      JSON_OBJECT(
        'id', c.id,
        'nombre', c.nombre,
        'icono', c.icono
      ) AS CHAR
    ) AS categoria,
    CAST(
      JSON_OBJECT(
        'corazones', IFNULL((SELECT COUNT(*) FROM reacciones r WHERE r.id_producto = p.id), 0),
        'promedio_estrellas', IFNULL((SELECT ROUND(AVG(estrellas),1) FROM calificaciones cal WHERE cal.id_producto = p.id), '0.0')
      ) AS CHAR
    ) AS metricas
  FROM inventory p
  LEFT JOIN categorias c ON p.id_categoria = c.id
  WHERE p.nombre LIKE ? AND p.estado = 'activo'

  UNION

  SELECT 
    'categoria' AS tipo,
    c.id,
    c.nombre,
    NULL AS descripcion,
    NULL AS precio,
    NULL AS stock,
    NULL AS estado,
    NULL AS imagen,
    NULL AS fecha_creacion,
    CAST(
      JSON_OBJECT(
        'id', c.id,
        'nombre', c.nombre,
        'icono', c.icono
      ) AS CHAR
    ) AS categoria,
    NULL AS metricas
  FROM categorias c
  WHERE c.nombre LIKE ?
`;


    const [resultados] = await db.execute(query, [searchTerm, searchTerm]);

    const resultadosParseados = resultados.map(item => {
      return {
        ...item,
        categoria: item.categoria ? JSON.parse(item.categoria) : null,
        metricas: item.metricas ? JSON.parse(item.metricas) : null
      };
    });

    if (resultadosParseados.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No se encontraron productos ni categorías con '${q}'.`
      });
    }

    res.status(200).json({
      success: true,
      count: resultadosParseados.length,
      data: resultadosParseados
    });

  } catch (error) {
    console.error('Error en buscarProductosCategorias:', error);
    res.status(500).json({
      success: false,
      message: 'Error en la búsqueda',
      error: error.message
    });
  }
};
