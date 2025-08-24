const db = require('../config/database');

class Vehicle {
  static async create(vehicleData) {
    const { marca, modelo, placa, año, color, usuario_id } = vehicleData;
    const query = 'INSERT INTO vehiculos (marca, modelo, placa, año, color, usuario_id) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await db.promise().execute(query, [marca, modelo, placa, año, color, usuario_id]);
    return result.insertId;
  }

  static async findByPlate(placa) {
    const query = 'SELECT * FROM vehiculos WHERE placa = ?';
    const [rows] = await db.promise().execute(query, [placa]);
    return rows[0];
  }

  static async findByUser(usuario_id) {
    const query = 'SELECT * FROM vehiculos WHERE usuario_id = ?';
    const [rows] = await db.promise().execute(query, [usuario_id]);
    return rows;
  }
}

module.exports = Vehicle;