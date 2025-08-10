import express from "express";
import cors from "cors";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import categoriasRoutes from "./routes/categoriasRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productosRoutes from './routes/productosRoutes.js';
import comprasRoutes from './routes/comprasRoutes.js';
import perfilTiendaRoutes from './routes/perfilTiendaRoutes.js';
import consejosRoutes from './routes/consejosRoutes.js';
import busquedasRoutes from './routes/busquedasRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

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
app.use('/api/compras', comprasRoutes);
app.use('/api', perfilTiendaRoutes);
app.use('/api/consejos', consejosRoutes);
app.use('/api/busquedas', busquedasRoutes);

// Puerto
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});