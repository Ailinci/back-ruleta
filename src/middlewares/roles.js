

  function soloRol(rolPermitido) {
    return (req, res, next) => {
      if (!req.user || req.user.rol !== rolPermitido) {
        return res.status(403).json({ error: 'No autorizado' });
      }
      next();
    };
  }
  
  module.exports = soloRol;