import { pool } from './db.js';

async function obtenerProductos() {
  try {
    const [rows] = await pool.query('SELECT * FROM productos LIMIT 2');
    if (rows.length > 0) {
      console.log('Resultados:', rows);
    } else {
      console.log('La tabla productos está vacía o no existen resultados.');
    }
  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
  }
}

obtenerProductos(); 