const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json({ message: 'Authentication failed' });
      return;
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: 'Authentication failed' });
        return;
      }
      req.userId = decoded.userId;
      next();
    });
  } catch (error) {
    next(error);
  }
}

module.exports = authMiddleware;
