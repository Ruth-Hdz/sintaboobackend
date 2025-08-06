import express from "express";
import cors from "cors";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import categoriasRoutes from "./routes/categoriasRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productosRoutes from './routes/productosRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Rutas
app.use("/api/inventory", inventoryRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/productos', productosRoutes);

// Puerto
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});