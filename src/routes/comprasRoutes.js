import express from 'express';
import { registrarCompra } from '../controllers/comprasController.js';
const router = express.Router();

router.post('/', registrarCompra);

export default router;
