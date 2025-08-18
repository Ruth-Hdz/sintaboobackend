import { Router } from 'express';
import { 
  guardarConversacion, 
  obtenerConversaciones 
} from '../controllers/chatbotController.js';

const router = Router();

router.post('/', guardarConversacion);
router.get('/', obtenerConversaciones);

export default router;