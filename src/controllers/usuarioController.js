const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  async registrar(req, res) {
    try {
      const { nombre, email, password } = req.body;

      // Validación básica
      if (!nombre || !email || !password) {
        return res.status(400).json({ 
          error: 'Nombre, email y password son requeridos' 
        });
      }

      // Verificar si el usuario ya existe
      const existeUsuario = await Usuario.findOne({ email });
      if (existeUsuario) {
        return res.status(400).json({ 
          error: 'El email ya está registrado' 
        });
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 12);

      // Crear nuevo usuario
      const nuevoUsuario = new Usuario({
        nombre,
        email,
        password: hashedPassword
      });

      // Guardar en la base de datos
      const usuarioGuardado = await nuevoUsuario.save();

      // Eliminar password de la respuesta
      const usuarioResponse = usuarioGuardado.toObject();
      delete usuarioResponse.password;

      return res.status(201).json(usuarioResponse);

    } catch (error) {
      console.error('Error en registro:', error);
      return res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validación básica
      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email y password son requeridos' 
        });
      }

      // Buscar usuario
      const usuario = await Usuario.findOne({ email }).select('+password');
      if (!usuario) {
        return res.status(401).json({ 
          error: 'Credenciales inválidas' 
        });
      }

      // Comparar contraseñas
      const passwordValida = await bcrypt.compare(password, usuario.password);
      if (!passwordValida) {
        return res.status(401).json({ 
          error: 'Credenciales inválidas' 
        });
      }

      // Crear token JWT
      const token = jwt.sign(
        { 
          id: usuario._id, 
          email: usuario.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Eliminar password de la respuesta
      const usuarioResponse = usuario.toObject();
      delete usuarioResponse.password;

      return res.json({ 
        token,
        usuario: usuarioResponse 
      });

    } catch (error) {
      console.error('Error en login:', error);
      return res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }
};