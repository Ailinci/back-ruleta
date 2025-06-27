const jwt = require('jsonwebtoken');
const UsuarioService = require('../services/usuarioService');
const Usuario = require('../models/Usuario');

class AuthController {
  generarToken(usuario) {
    const userId = usuario.id || usuario._id?.toString() || usuario._id;
    return jwt.sign(
      { 
        id: userId, 
        email: usuario.email, 
        rol: usuario.rol 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  showLogin(req, res) {
    if (req.session?.token) {
      return res.redirect('/');
    }
    res.render('auth/login', { error: null });
  }

  async login(req, res) {
    const { email, password } = req.body;
    
    try {
      const usuario = await UsuarioService.obtenerPorEmail(email);
      
      if (!usuario) {
        return res.render('auth/login', { 
          error: 'Email o contraseña incorrectos' 
        });
      }

      const usuarioCompleto = new Usuario(usuario);
      const passwordValido = await usuarioCompleto.comparePassword(password);
      
      if (!passwordValido) {
        return res.render('auth/login', { 
          error: 'Email o contraseña incorrectos' 
        });
      }

      const token = this.generarToken(usuario);
      req.session.token = token;
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
      });

      res.redirect('/');
      
    } catch (error) {
      console.error('Error en login:', error);
      res.render('auth/login', { 
        error: 'Error al iniciar sesión' 
      });
    }
  }

  async apiLogin(req, res) {
    const { email, password } = req.body;
    
    try {
      const usuario = await UsuarioService.obtenerPorEmail(email);
      
      if (!usuario) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const usuarioCompleto = new Usuario(usuario);
      const passwordValido = await usuarioCompleto.comparePassword(password);
      
      if (!passwordValido) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const token = this.generarToken(usuario);
      
      res.json({
        mensaje: 'Login exitoso',
        token,
        usuario: new Usuario(usuario).toJSON()
      });
      
    } catch (error) {
      console.error('Error en API login:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  showRegister(req, res) {
    if (req.session?.token) {
      return res.redirect('/');
    }
    res.render('auth/register', { error: null });
  }

  async register(req, res) {
    const { nombre, email, password, rol } = req.body;
    
    try {
      const usuarioExistente = await UsuarioService.obtenerPorEmail(email);
      if (usuarioExistente) {
        return res.render('auth/register', { 
          error: 'El email ya está registrado' 
        });
      }

      const nuevoUsuario = new Usuario({ nombre, email, password, rol });
      await nuevoUsuario.hashPassword();
      
      const usuarioCreado = await UsuarioService.crearUsuarioConPassword({
        nombre,
        email,
        password: nuevoUsuario.password,
        rol
      });
      
      const token = this.generarToken(usuarioCreado);
      req.session.token = token;
      
      res.redirect('/');
      
    } catch (error) {
      console.error('Error en registro:', error);
      res.render('auth/register', { 
        error: error.message || 'Error al registrar usuario' 
      });
    }
  }

  async apiRegister(req, res) {
    const { nombre, email, password, rol } = req.body;
    
    try {
      if (await UsuarioService.obtenerPorEmail(email)) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      const nuevoUsuario = new Usuario({ nombre, email, password, rol });
      await nuevoUsuario.hashPassword();
      
      const usuarioCreado = await UsuarioService.crearUsuarioConPassword({
        nombre,
        email,
        password: nuevoUsuario.password,
        rol
      });

      const token = this.generarToken(usuarioCreado);
      
      res.status(201).json({
        mensaje: 'Usuario registrado exitosamente',
        token,
        usuario: new Usuario(usuarioCreado).toJSON()
      });
      
    } catch (error) {
      console.error('Error en API register:', error);
      res.status(400).json({ error: error.message || 'Error al registrar usuario' });
    }
  }

  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error al destruir sesión:', err);
      }
      res.clearCookie('token');
      res.redirect('/auth/login');
    });
  }

  apiLogout(req, res) {
    res.clearCookie('token');
    res.json({ mensaje: 'Logout exitoso' });
  }

  async me(req, res) {
    try {
      res.json(new Usuario(req.usuario).toJSON());
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener información del usuario' });
    }
  }
}
const authController = new AuthController();

module.exports = {
  showLogin: authController.showLogin.bind(authController),
  login: authController.login.bind(authController),
  apiLogin: authController.apiLogin.bind(authController),
  showRegister: authController.showRegister.bind(authController),
  register: authController.register.bind(authController),
  apiRegister: authController.apiRegister.bind(authController),
  logout: authController.logout.bind(authController),
  apiLogout: authController.apiLogout.bind(authController),
  me: authController.me.bind(authController)
};