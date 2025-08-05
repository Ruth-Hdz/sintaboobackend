import express from 'express';
import { getCategorias,createCategoria, getCategoriasConProductos, getUltimosProductos, editarCategoria, deleteCategoria} from '../controllers/categoriasController.js';

const router = express.Router();

// Ruta GET /api/categorias
router.get('/', getCategorias);
router.post('/', createCategoria);
router.get('/con-productos', getCategoriasConProductos);
router.get('/ultimos', getUltimosProductos);
router.put('/:id', editarCategoria); 
router.delete('/:id', deleteCategoria); 

// Ruta de prueba
router.get('/test', (req, res) => {
  res.json({ message: 'Ruta de prueba funcionando' });
});

export default router;