// chatController.js
import db from "../database.js";
const db = require('../db');

/**
 * Obtener conversaciones según admin (admin1 o admin2)
 */
exports.getChatsByAdmin = async (req, res) => {
  const adminId = req.params.adminId;

  try {
    const [rows] = await db.query(`
      SELECT m.*, u.nombre AS remitente
      FROM mensajes m
      JOIN users u ON u.id = m.remitente_id
      WHERE m.chat_id IN (
        SELECT chat_id FROM admin_chats WHERE admin_id = ?
      )
      ORDER BY m.fecha
    `, [adminId]);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener todas las conversaciones (colaborativas o no)
 */
exports.getAllConversations = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.id AS chat_id, u.nombre AS usuario, c.estado, c.fecha_creacion,
             m.mensaje, m.fecha, m.es_admin
      FROM chats c
      JOIN users u ON c.usuario_id = u.id
      JOIN mensajes m ON m.chat_id = c.id
      ORDER BY c.id, m.fecha
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener conversaciones por usuario (cliente)
 */
exports.getConversationsByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const [rows] = await db.query(`
      SELECT c.id AS chat_id, m.mensaje, m.fecha, m.es_admin,
             u.nombre AS remitente
      FROM chats c
      JOIN mensajes m ON m.chat_id = c.id
      JOIN users u ON u.id = m.remitente_id
      WHERE c.usuario_id = ?
      ORDER BY c.id, m.fecha
    `, [userId]);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Enviar un mensaje a un chat específico
 */ 
exports.sendMessage = async (req, res) => {
  const { chatId, mensaje, remitenteId, esAdmin } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO mensajes (chat_id, mensaje, remitente_id, es_admin)
      VALUES (?, ?, ?, ?)
    `, [chatId, mensaje, remitenteId, esAdmin]);

    res.status(201).json({ id: result.insertId, chatId, mensaje, remitenteId, esAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}