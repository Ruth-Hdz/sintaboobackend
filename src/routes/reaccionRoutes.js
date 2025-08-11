import express from 'express';
import { getReaccionesByProducto, createReaccion, deleteReaccion } from '../controllers/reaccionController.js';

const router = express.Router();

router.get('/:id_producto', getReaccionesByProducto);
router.post('/', createReaccion);
router.delete('/', deleteReaccion);

export default router;
