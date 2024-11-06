const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/userRepository');

function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({
        messsage: 'Access Denied',
    });
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid Token' });

        try {
            const dbToken = await UserRepository.getRememberToken(decoded.id);
            if (!dbToken || dbToken !== token) {
                return res.status(401).json({ message: 'Session expired, please log in again' });
            }

            req.userId = decoded.id;
            next();
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    });
}

module.exports = authenticateToken;