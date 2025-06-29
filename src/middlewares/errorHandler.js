function errorHandler(err, req, res, next) {
    // Setea el status code, si no viene en el error, es un 500
    const statusCode = err.status || 500;
  
    // Loguea el error
    console.error(err.stack);
  
    // Si la petición es para una API, responde con JSON
    if (req.originalUrl.startsWith('/api')) {
      return res.status(statusCode).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        // No exponer el stack en producción
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
      });
    }
  
    // Si es una petición de vista, renderiza la página de error
    res.status(statusCode);
    res.render('error', {
      message: err.message,
      // No exponer el error en producción
      error: process.env.NODE_ENV === 'production' ? {} : err,
    });
  }
  
  module.exports = errorHandler; 