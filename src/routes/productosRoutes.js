import express from 'express';
import { getProductosRecomendados,getAllProductos  } from '../controllers/productosController.js';

const router = express.Router();

// Ruta para obtener productos recomendados
router.get('/recomendados', getProductosRecomendados);
router.get('/todproductos', getAllProductos);


export default router;