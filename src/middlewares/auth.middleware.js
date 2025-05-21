export const authorizeAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ status: 'error', message: 'Forbidden: Admin access required' });
    }
    next();
};

export const authorizeUser = (req, res, next) => {
    if (!req.user || req.user.role !== 'user') {
        return res.status(403).json({ status: 'error', message: 'Forbidden: User access required' });
    }
    next();
};
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
