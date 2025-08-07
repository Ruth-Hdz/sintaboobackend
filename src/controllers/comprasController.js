import db from '../database.js';

export const registrarCompra = async (req, res) => {
  // Log de depuración
  console.log('Datos recibidos:', req.body);
  
  const { id_usuario, productos } = req.body;
  const conn = await db.getConnection();

  try {
    // Validación mejorada
    if (!id_usuario || !productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Datos de compra inválidos'
      });
    }

    await conn.beginTransaction();

    // 1. Validar y calcular total
    let total = 0;
    const productosValidados = [];
    
    for (const prod of productos) {
      // Validación exhaustiva
      if (prod.id_producto === undefined || prod.cantidad === undefined || prod.precio === undefined) {
        throw new Error(`Producto incompleto: ${JSON.stringify(prod)}`);
      }

      // Conversión numérica segura
      const id_producto = parseInt(prod.id_producto, 10);
      const cantidad = parseInt(prod.cantidad, 10);
      const precio = parseFloat(prod.precio);
      
      // Validación numérica
      if (isNaN(id_producto) || isNaN(cantidad) || isNaN(precio)) {
        throw new Error(`Valores numéricos inválidos en producto: ${JSON.stringify(prod)}`);
      }
      
      // Validación de rango
      if (cantidad <= 0 || precio < 0) {
        throw new Error(`Valores fuera de rango en producto: ${JSON.stringify(prod)}`);
      }

      productosValidados.push({
        id_producto,
        cantidad,
        precio
      });

      total += precio * cantidad;
    }

    // 2. Insertar en compras
    const [compraResult] = await conn.execute(
      'INSERT INTO compras (id_usuario, total) VALUES (?, ?)',
      [id_usuario, total]
    );
    const id_compra = compraResult.insertId;
    console.log(`Compra creada ID: ${id_compra}`);

    // 3. Procesar cada producto
    for (const prod of productosValidados) {
      console.log(`Procesando producto: ${prod.id_producto}`);
      
      // Verificar existencia del producto
      const [productoDB] = await conn.execute(
        'SELECT id, stock FROM inventory WHERE id = ?',
        [prod.id_producto]
      );
      
      if (productoDB.length === 0) {
        throw new Error(`Producto no encontrado: ${prod.id_producto}`);
      }

      // Verificar stock
      if (productoDB[0].stock < prod.cantidad) {
        throw new Error(`Stock insuficiente para producto ${prod.id_producto}. Stock actual: ${productoDB[0].stock}, solicitado: ${prod.cantidad}`);
      }

      // Insertar en detalle_compra
      await conn.execute(
        'INSERT INTO detalle_compra (id_compra, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [id_compra, prod.id_producto, prod.cantidad, prod.precio]
      );

      // Actualizar stock
      await conn.execute(
        'UPDATE inventory SET stock = stock - ? WHERE id = ?',
        [prod.cantidad, prod.id_producto]
      );
      
      console.log(`Producto ${prod.id_producto} procesado correctamente`);
    }

    await conn.commit();
    
    res.status(201).json({ 
      success: true, 
      message: 'Compra registrada exitosamente',
      id_compra
    });

  } catch (error) {
    if (conn) await conn.rollback();
    
    console.error('Error detallado:', error.message);
    
    res.status(500).json({ 
      success: false, 
      message: 'Error al registrar compra',
      error: error.message
    });
  } finally {
    if (conn) conn.release();
  }
};