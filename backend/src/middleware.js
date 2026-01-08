// Minimal auth middleware
function authMiddleware(req, res, next) {
  req.userId = '1'; // Dummy user id
  next();
}

module.exports = { authMiddleware };
