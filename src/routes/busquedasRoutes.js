import { Router } from 'express';
import { buscarProductosCategorias } from '../controllers/busquedasController.js';

const router = Router();

router.get('/buscar', buscarProductosCategorias);

export default router;
