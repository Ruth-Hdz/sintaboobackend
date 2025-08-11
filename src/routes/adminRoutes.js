import express from 'express';
import { getAdmins, createAdmin, updateAdmin, deleteAdmin,loginAdmin, getAdminById, cambiarPasswordAdmin } from '../controllers/adminController.js';
import { verifySuperadmin } from '../middlewares/verifyAdmin.js';

const router = express.Router();

router.post('/login', loginAdmin);

// Solo superadmins pueden acceder
router.get('/', verifySuperadmin, getAdmins);
router.get('/:id', verifySuperadmin);
router.post('/', verifySuperadmin, createAdmin);
router.put('/:id', verifySuperadmin, updateAdmin);
router.delete('/:id', verifySuperadmin, deleteAdmin);
router.get('/info/:id', getAdminById);
router.post('/:id/cambiar-password', verifySuperadmin, cambiarPasswordAdmin);

export default router;
