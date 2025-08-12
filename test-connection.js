import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      
      connectTimeout: 5000, // timeout a 5 segundos para no esperar demasiado
    });

    console.log('✅ Conexión exitosa a la base de datos!');
    await connection.end();
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error.message);
  }
}

testConnection();
