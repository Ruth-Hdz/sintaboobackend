import express from "express";
import {
  getMensajesPorAdmin,
  getTodasLasConversaciones,
  getConversacionesPorUsuario
} from "../controllers/chatController.js";

const router = express.Router();

// Ruta 1: Obtener mensajes enviados por un admin
router.get("/admin/:adminId", getMensajesPorAdmin);

// Ruta 2: Obtener todas las conversaciones con mensajes
router.get("/todas", getTodasLasConversaciones);

// Ruta 3: Obtener conversaciones por usuario
router.get("/usuario/:usuarioId", getConversacionesPorUsuario);

export default router;
