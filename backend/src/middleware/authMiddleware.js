export const ensureAuth = (req, res, next) => {
    // If running an MVP without actual login, we might want a bypass
    // But since req requirements explicitly specify premium protection, we check `req.isAuthenticated()`
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    } else {
        return res.status(401).json({ message: 'Not authorized, please log in.' });
    }
};

export const ensurePremium = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        if (req.user && req.user.plan === 'premium') {
            return next();
        } else {
            return res.status(403).json({ message: 'Access denied. Premium plan required.' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, please log in.' });
    }
};
