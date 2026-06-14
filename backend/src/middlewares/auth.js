const jwt = require('jsonwebtoken');

exports.requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Token de autenticación no proporcionado' });
  }
  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({ success: false, message: 'Formato de token no válido' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token de autenticación inválido' });
  }
};

exports.requireAdmin = (req, res, next) => {
  exports.requireAuth(req, res, () => {
    if (!req.user.is_admin) {
      return res.status(403).json({ success: false, message: 'Acceso denegado: se requieren permisos de administrador' });
    }
    next();
  });
};
