import db from '../database.js';

export const getCategorias = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM categorias');
    
    // Verifica qué datos estás recibiendo de la base de datos
    console.log('Datos de categorías:', rows);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron categorías' });
    }
    
    res.json(rows);
  } catch (error) {
    console.error('Error en getCategorias:', error);
    res.status(500).json({ 
      message: 'Error al obtener categorías',
      error: error.message 
    });
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

    // Para cada categoría, obtenemos sus productos (desde inventory)
    const categoriasConProductos = await Promise.all(
      categorias.map(async (categoria) => {
        const [productos] = await db.execute(
          `SELECT 
            id, 
            nombre, 
            precio, 
            imagen_url as imagen,
            descripcion,
            stock,
            estado
           FROM inventory 
           WHERE id_categoria = ? 
           AND estado = 'activo'
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
            stock: p.stock
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
        id,
        nombre,
        descripcion,
        precio,
        stock,
        imagen_url AS imagen,
        id_categoria,
        estado,
        fecha_creacion
      FROM inventory
      WHERE estado = 'activo'
      ORDER BY fecha_creacion DESC
      LIMIT 5
    `);

    if (productos.length === 0) {
      return res.status(404).json({ message: 'No hay productos recientes disponibles' });
    }

    res.status(200).json(productos);
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