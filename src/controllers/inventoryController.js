import db from '../database.js';

export const getProducts = async (req, res) => {
  try {
    const [result] = await db.execute(
      `SELECT i.*, c.nombre AS categoria 
       FROM inventory i
       JOIN categorias c ON i.id_categoria = c.id`
    );

    // Agregar URL completa para las imágenes
    const productsWithFullUrl = result.map(product => ({
      ...product,
      imagen_url: product.imagen_url ? `${req.protocol}://${req.get('host')}${product.imagen_url}` : null
    }));

    res.json(productsWithFullUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, id_categoria, estado } = req.body;

    if (!nombre || !precio || !stock || !id_categoria || estado === undefined) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    let imagen_url = null;
    if (req.file) {
      imagen_url = `/uploads/${req.file.filename}`;
    }

    const [result] = await db.execute(
      'INSERT INTO inventory (nombre, descripcion, precio, stock, imagen_url, id_categoria, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, descripcion || '', precio, stock, imagen_url, id_categoria, estado]
    );

    const [newProduct] = await db.execute(
      'SELECT * FROM inventory WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Producto creado correctamente',
      product: {
        ...newProduct[0],
        imagen_url: newProduct[0].imagen_url ? `${req.protocol}://${req.get('host')}${newProduct[0].imagen_url}` : null
      }
    });
  } catch (error) {
    console.error('Error en createProduct:', error);
    res.status(500).json({ message: 'Error al crear producto' });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute('DELETE FROM inventory WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, id_categoria, estado } = req.body;

    // Verificar si el producto existe
    const [existingProduct] = await db.execute(
      'SELECT * FROM inventory WHERE id = ?',
      [id]
    );

    if (existingProduct.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Preparar los datos actuales
    let imagen_url = existingProduct[0].imagen_url;
    if (req.file) {
      imagen_url = `/uploads/${req.file.filename}`;
    }

    // Usar los valores nuevos o los actuales
    const nuevoNombre = nombre || existingProduct[0].nombre;
    const nuevaDescripcion = descripcion !== undefined ? descripcion : existingProduct[0].descripcion;
    const nuevoPrecio = precio !== undefined ? precio : existingProduct[0].precio;
    const nuevoStock = stock !== undefined ? stock : existingProduct[0].stock;
    const nuevaCategoria = id_categoria || existingProduct[0].id_categoria;
    const nuevoEstado = estado !== undefined ? estado : existingProduct[0].estado;

    // Actualizar el producto
    await db.execute(
      `UPDATE inventory 
       SET nombre = ?, descripcion = ?, precio = ?, stock = ?, imagen_url = ?, id_categoria = ?, estado = ?
       WHERE id = ?`,
      [nuevoNombre, nuevaDescripcion, nuevoPrecio, nuevoStock, imagen_url, nuevaCategoria, nuevoEstado, id]
    );

    // Obtener el producto actualizado
    const [updatedProduct] = await db.execute(
      'SELECT * FROM inventory WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Producto actualizado correctamente',
      product: {
        ...updatedProduct[0],
        imagen_url: updatedProduct[0].imagen_url ? `${req.protocol}://${req.get('host')}${updatedProduct[0].imagen_url}` : null
      }
    });
  } catch (error) {
    console.error('Error en updateProduct:', error);
    res.status(500).json({ message: 'Error al actualizar producto' });
  }
};