import express from 'express';
import { upload } from '../config/multer.js';
import { 
  createProduct, 
  getProducts, 
  deleteProduct, 
  updateProduct 
} from '../controllers/inventoryController.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', upload.single('foto'), createProduct);
router.delete('/:id', deleteProduct);
router.put('/:id', upload.single('foto'), updateProduct);

export default router;