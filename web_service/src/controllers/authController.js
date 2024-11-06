const { emit } = require('nodemon');
const AuthService = require('../services/authService');

class AuthController {
    static async register(req, res) {
        try {
            const { name, email, password, phone, address } = req.body;
            await AuthService.register(name, email, password, phone, address);

            res.status(201).json({
                message: 'Registered Successfully',
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            const token = await AuthService.login(email, password);
            res.json({
                message: 'Login Successfully',
                token: token,
            });
        } catch (error) {
            res.status(400).json({
                message: error.message,
            });
        }
    }


    static async profile(req, res) {
        try {
            const user = await AuthService.getProfile(req.userId);
            res.json({
                message: 'Success',
                data: {
                    id: user.id,
                    name: user.name,
                    password: user.password,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    photo: user.photo,
                    remember_token: user.remember_token
                }
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }

    static async logout(req, res) {
        try {
            await AuthService.logout(req.userId);
            res.json({
                message: "Logout Successful",
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }
}

module.exports = AuthController;