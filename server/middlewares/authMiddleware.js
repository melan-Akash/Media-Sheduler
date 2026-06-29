import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
export const protect = async (req, res, next) => {
    let token;
    // Check if authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from 'Bearer <token>'
            token = req.headers.authorization.split(' ')[1];
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Fetch user from DB without the password and attach to request
            req.user = await User.findById(decoded.id).select('-password');
            // Move to the next middleware or controller
            next();
        }
        catch (error) {
            res.status(401).json({ message: error.message || 'Not authorized, token failed' });
        }
    }
    else {
        // If no token was provided at all
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};
//# sourceMappingURL=authMiddleware.js.map