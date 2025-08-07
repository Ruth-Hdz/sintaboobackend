import express from 'express';
import {
  getConsejos,
  createConsejo,
  deleteConsejo,
  updateConsejo
} from '../controllers/consejosController.js';

const router = express.Router();

router.get('/', getConsejos);             // GET todos los consejos
router.post('/', createConsejo);          // POST nuevo consejo
router.delete('/:id', deleteConsejo);     // DELETE por id
router.put('/:id', updateConsejo);        // PUT por id

export default router;
