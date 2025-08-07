import db from '../database.js';

export const getProductosRecomendados = async (req, res) => {
  try {
    const [productos] = await db.execute(`
      SELECT 
        p.*,
        c.nombre AS categoria_nombre,
        c.icono AS categoria_icono,
        (SELECT COUNT(*) FROM reacciones WHERE id_producto = p.id) AS corazones,
        (SELECT IFNULL(ROUND(AVG(estrellas), 1), 0) FROM calificaciones WHERE id_producto = p.id) AS estrellas
      FROM 
        inventory p
      JOIN 
        categorias c ON p.id_categoria = c.id
      WHERE 
        p.estado = 'activo'
      ORDER BY 
        corazones DESC,
        estrellas DESC
      LIMIT 12
    `);

    if (productos.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'No se encontraron productos recomendados' 
      });
    }

    const productosFormateados = productos.map(producto => ({
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      estado: producto.estado,
      imagen: producto.imagen_url,
      categoria: {
        id: producto.id_categoria,
        nombre: producto.categoria_nombre,
        icono: producto.categoria_icono
      },
      metricas: {
        corazones: producto.corazones || 0,
        promedio_estrellas: producto.estrellas || 0
      }
    }));

    res.status(200).json({
      success: true,
      count: productosFormateados.length,
      data: productosFormateados
    });

  } catch (error) {
    console.error('Error en getProductosRecomendados:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener productos recomendados',
      error: error.message
    });
  }
};

export const getAllProductos = async (req, res) => {
  try {
    const query = `
      SELECT 
        p.*,
        c.nombre AS categoria_nombre,
        c.icono AS categoria_icono,
        -- Subconsulta: promedio de estrellas
        (
          SELECT ROUND(AVG(estrellas), 1)
          FROM calificaciones
          WHERE id_producto = p.id
        ) AS promedio_estrellas,
        -- Subconsulta: total de corazones
        (
          SELECT COUNT(*)
          FROM reacciones
          WHERE id_producto = p.id
        ) AS corazones
      FROM inventory p
      LEFT JOIN categorias c ON p.id_categoria = c.id
      WHERE p.estado = 'activo'
    `;

    const [productos] = await db.execute(query);

    if (productos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron productos"
      });
    }

    const productosFormateados = productos.map(producto => ({
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      estado: producto.estado,
      imagen: producto.imagen_url,
      fecha_creacion: producto.fecha_creacion,
      categoria: {
        id: producto.id_categoria,
        nombre: producto.categoria_nombre,
        icono: producto.categoria_icono
      },
      metricas: {
        corazones: producto.corazones || 0,
        promedio_estrellas: producto.promedio_estrellas || "0.0"
      }
    }));

    res.status(200).json({
      success: true,
      count: productosFormateados.length,
      data: productosFormateados
    });

  } catch (error) {
    console.error("Error en getAllProductos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener productos",
      error: error.message
    });
  }
};