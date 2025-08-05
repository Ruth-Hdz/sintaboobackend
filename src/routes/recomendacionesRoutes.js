import express from 'express';
import { getRecomendaciones } from '../controllers/recomendacionesController.js';

const router = express.Router();

// Ruta para obtener productos recomendados
router.get('/', getRecomendaciones);

export default router;
