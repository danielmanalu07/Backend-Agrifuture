const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/userRepository');

class AuthService {
    static async register(name, email, password, phone, address) {
        const hashedPassword = await bcrypt.hash(password, 14);
        return await UserRepository.createUser(name, email, hashedPassword, phone, address);
    }

    static async login(email, password) {
        const user = await UserRepository.findByEmail(email);
        if (!user) throw new Error('Customer Not Found');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error('Invalid Credentials');

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

        await UserRepository.updateRememberToken(user.id, token);

        return token;
    }

    static async getProfile(userId) {
        const user = await UserRepository.findById(userId);
        if (!user) throw new Error('User Not Found');
        return user;
    }

    static async logout(userId) {
        return await UserRepository.clearRememberToken(userId);
    }
}

module.exports = AuthService;