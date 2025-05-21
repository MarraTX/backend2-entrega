// Middleware to authorize based on roles

// This middleware assumes that a previous middleware (e.g., passport.authenticate('current', ...))
// has successfully authenticated the user and attached the user object (with a 'role' property) to req.user

export const authorizeAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ status: 'error', message: 'Forbidden: Admin access required' });
    }
    next();
};

export const authorizeUser = (req, res, next) => {
    if (!req.user || req.user.role !== 'user') {
        // Admins might also be considered users for certain actions, 
        // or you might want strict 'user' only. 
        // For now, let's assume only 'user' role can add to cart.
        // If admin should also be able to, the condition would be: 
        // if (!req.user || (req.user.role !== 'user' && req.user.role !== 'admin'))
        return res.status(403).json({ status: 'error', message: 'Forbidden: User access required' });
    }
    next();
};

// A more generic role authorization middleware (optional, but good practice)
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: `Forbidden: Access denied. Required roles: ${allowedRoles.join(' or ')}`
            });
        }
        next();
    };
};
