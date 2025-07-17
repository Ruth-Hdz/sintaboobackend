import express from 'express';
import { getCategorias } from '../controllers/categoriasController.js';

const router = express.Router();

// Ruta GET /api/categorias
router.get('/', getCategorias);

// Ruta de prueba
router.get('/test', (req, res) => {
  res.json({ message: 'Ruta de prueba funcionando' });
});

export default router;