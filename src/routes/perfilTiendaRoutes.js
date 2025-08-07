import express from 'express';
import { getPerfilTienda, updatePerfilTienda } from '../controllers/perfilTiendaController.js';
import { upload } from '../config/multer.js';

const router = express.Router();

router.get('/perfil-tienda', getPerfilTienda);

// Middleware `upload.single('logo')` para procesar el campo `logo` con imagen
router.put('/perfil-tienda', upload.single('logo'), updatePerfilTienda);

export default router;
