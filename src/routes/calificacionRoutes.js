import express from 'express';
import {
  getTodasCalificaciones,
  getCalificacionesByProducto,
  createCalificacion,
  updateCalificacion,
  deleteCalificacion
} from '../controllers/calificacionController.js';

const router = express.Router();

router.get('/', getTodasCalificaciones); // Listar todas las calificaciones
router.get('/:id_producto', getCalificacionesByProducto); // Calificaciones por producto
router.post('/', createCalificacion); // Crear calificación
router.put('/:id', updateCalificacion); // Actualizar calificación por id
router.delete('/:id', deleteCalificacion); // Eliminar calificación por id

export default router;
