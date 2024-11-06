const db = require('../configs/db');
const User = require('../models/user');

class UserRepository {
    static async createUser(name, email, password, phone, address) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO customers (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)', [name, email, password, phone, address], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static async findByEmail(email) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM customers WHERE email = ?', [email], (err, result) => {
                if (err) return reject(err);
                if (result.length === 0) return resolve(null);
                const user = new User(result[0].id, result[0].name, result[0].email, result[0].password, result[0].phone, result[0].address, result[0].photo, result[0].remember_token);
                resolve(user);
            });
        });
    }

    static async updateRememberToken(userId, token) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE customers SET remember_token = ? WHERE id = ?';
            db.query(query, [token, userId], (err, result) => {
                if (err) return reject(new Error(`Failed to update remember_token: ${err.message}`));
                resolve(result);
            });
        });
    }

    static async getRememberToken(userId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT remember_token FROM customers WHERE id = ?';
            db.query(query, [userId], (err, result) => {
                if (err) return reject(new Error(`Failed to retrieve remember_token: ${err.message}`));
                resolve(result[0]?.remember_token || null);
            });
        });
    }

    static async findById(id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM customers WHERE id = ?';
            db.query(query, [id], (err, result) => {
                if (err) return reject(`Database query failed: ${err.message}`);
                if (result.length === 0) return resolve(null);

                const { id, name, email, password, phone, address, photo, remember_token } = result[0];
                resolve(new User(id, name, email, password, phone, address, photo, remember_token));
            });
        });
    }

    static async clearRememberToken(userId) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE customers SET remember_token = NULL WHERE id = ?';
            db.query(query, [userId], (err, result) => {
                if (err) return reject(new Error(`Failed to clear remember_token: ${err.message}`));
                resolve(result);
            });
        });
    }

}

module.exports = UserRepository;