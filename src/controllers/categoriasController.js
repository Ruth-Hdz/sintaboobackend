import db from '../database.js';

export const getCategorias = async (req, res) => {
  try {
    const [categorias] = await db.query(`
      SELECT 
        c.*,
        COUNT(i.id) AS total_productos,
        SUM(CASE WHEN i.estado = 'activo' THEN 1 ELSE 0 END) AS productos_activos
      FROM categorias c
      LEFT JOIN inventory i ON i.id_categoria = c.id
      GROUP BY c.id
    `);

    res.json(categorias);
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

export const createCategoria = async (req, res) => {
  const { nombre, icono } = req.body;

  if (!nombre || !icono) {
    return res.status(400).json({ message: 'Nombre e icono son obligatorios' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO categorias (nombre, icono) VALUES (?, ?)',
      [nombre, icono]
    );

    res.status(201).json({ id: result.insertId, nombre, icono });
  } catch (error) {
    console.error('Error en createCategoria:', error);
    res.status(500).json({ message: 'Error al crear categoría', error: error.message });
  }
};

export const getCategoriasConProductos = async (req, res) => {
  try {
    // Primero obtenemos todas las categorías
    const [categorias] = await db.execute('SELECT * FROM categorias ORDER BY nombre');
    
    if (categorias.length === 0) {
      return res.status(404).json({ message: 'No se encontraron categorías' });
    }

    // Para cada categoría, obtenemos sus productos con métricas
    const categoriasConProductos = await Promise.all(
      categorias.map(async (categoria) => {
        const [productos] = await db.execute(
          `SELECT 
            i.id, 
            i.nombre, 
            i.precio, 
            i.imagen_url as imagen,
            i.descripcion,
            i.stock,
            i.estado,
            (SELECT COUNT(*) FROM reacciones WHERE id_producto = i.id) AS corazones,
            (SELECT IFNULL(ROUND(AVG(estrellas), 1), 0) FROM calificaciones WHERE id_producto = i.id) AS promedio_estrellas
           FROM inventory i
           WHERE i.id_categoria = ? 
           AND i.estado = 'activo'
           LIMIT 5`,
          [categoria.id]
        );
        
        return {
          id: categoria.id,
          nombre: categoria.nombre,
          icono: categoria.icono,
          productos_count: productos.length,
          productos: productos.map(p => ({
            id: p.id,
            nombre: p.nombre,
            precio: p.precio,
            imagen: p.imagen,
            descripcion: p.descripcion,
            stock: p.stock,
            estado: p.estado,
            metricas: {
              corazones: p.corazones || 0,
              promedio_estrellas: parseFloat(p.promedio_estrellas) || 0.0
            }
          }))
        };
      })
    );

    // Filtramos categorías que no tienen productos activos
    const categoriasConProductosFiltradas = categoriasConProductos.filter(
      cat => cat.productos_count > 0
    );

    res.json(categoriasConProductosFiltradas);
  } catch (error) {
    console.error('Error en getCategoriasConProductos:', error);
    res.status(500).json({ 
      message: 'Error al obtener categorías con productos',
      error: error.message 
    });
  }
};

export const getUltimosProductos = async (req, res) => {
  try {
    const [productos] = await db.execute(`
      SELECT 
        p.id,
        p.nombre,
        p.descripcion,
        p.precio,
        p.stock,
        p.imagen_url AS imagen,
        p.id_categoria,
        p.estado,
        p.fecha_creacion,
        c.nombre AS categoria_nombre,
        c.icono AS categoria_icono,
        IFNULL(r.corazones, 0) AS corazones,
        IFNULL(cal.promedio_estrellas, 0) AS promedio_estrellas
      FROM inventory p
      LEFT JOIN categorias c ON p.id_categoria = c.id
      LEFT JOIN (
        SELECT id_producto, COUNT(*) AS corazones
        FROM reacciones
        GROUP BY id_producto
      ) r ON p.id = r.id_producto
      LEFT JOIN (
        SELECT id_producto, ROUND(AVG(estrellas), 1) AS promedio_estrellas
        FROM calificaciones
        GROUP BY id_producto
      ) cal ON p.id = cal.id_producto
      WHERE p.estado = 'activo'
      ORDER BY p.fecha_creacion DESC
      LIMIT 5
    `);

    if (productos.length === 0) {
      return res.status(404).json({ message: 'No hay productos recientes disponibles' });
    }

    const productosFormateados = productos.map(prod => ({
      id: prod.id,
      nombre: prod.nombre,
      descripcion: prod.descripcion,
      precio: prod.precio,
      stock: prod.stock,
      estado: prod.estado,
      imagen: prod.imagen,
      fecha_creacion: prod.fecha_creacion,
      categoria: {
        id: prod.id_categoria,
        nombre: prod.categoria_nombre,
        icono: prod.categoria_icono
      },
      metricas: {
        corazones: prod.corazones,
        promedio_estrellas: prod.promedio_estrellas
      }
    }));

    res.status(200).json(productosFormateados);

  } catch (error) {
    console.error('Error en getUltimosProductos:', error);
    res.status(500).json({
      message: 'Error al obtener los últimos productos',
      error: error.message
    });
  }
};


export const editarCategoria = async (req, res) => {
  const { id } = req.params;
  const { nombre, icono } = req.body;

  // Validación de campos requeridos
  if (!nombre || !icono) {
    return res.status(400).json({ 
      success: false,
      message: 'El nombre y el icono son campos obligatorios' 
    });
  }

  try {
    // Verificar si la categoría existe
    const [categoria] = await db.execute('SELECT * FROM categorias WHERE id = ?', [id]);
    
    if (categoria.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'La categoría no existe' 
      });
    }

    // Actualizar la categoría
    await db.execute(
      'UPDATE categorias SET nombre = ?, icono = ? WHERE id = ?',
      [nombre, icono, id]
    );

    // Obtener la categoría actualizada para devolverla en la respuesta
    const [updatedCategoria] = await db.execute('SELECT * FROM categorias WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Categoría actualizada correctamente',
      data: updatedCategoria[0]
    });
  } catch (error) {
    console.error('Error al editar categoría:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al editar la categoría',
      error: error.message 
    });
  }
};

export const deleteCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si la categoría existe
    const [categoria] = await db.execute('SELECT * FROM categorias WHERE id = ?', [id]);
    
    if (categoria.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'La categoría no existe' 
      });
    }

    // Verificar si la categoría tiene productos asociados
    const [productos] = await db.execute(
      'SELECT COUNT(*) as count FROM inventory WHERE id_categoria = ?',
      [id]
    );
    
    if (productos[0].count > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'No se puede eliminar la categoría porque tiene productos asociados',
        productosAsociados: productos[0].count
      });
    }

    // Eliminar la categoría
    await db.execute('DELETE FROM categorias WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Categoría eliminada correctamente',
      deletedId: id
    });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al eliminar la categoría',
      error: error.message 
    });
  }
};