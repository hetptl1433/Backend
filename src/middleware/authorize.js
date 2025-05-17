// src/middleware/authorize.js
module.exports = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).end();
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};
