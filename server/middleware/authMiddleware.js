const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid Token' });
  }
};

module.exports = verifyToken;
