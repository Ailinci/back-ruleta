const User = require('../models/User');
const express = require('express');
const router = express.Router();

class AuthController {
  // Mostrar formulario de login
  showLogin(req, res) {
    res.render('auth/login', { error: null });
  }

  // Procesar login
  async login(req, res) {
    const { email, password } = req.body;
    
    try {
      const user = await User.findByEmail(email);
      
      if (!user || user.password !== password) {
        return res.render('auth/login', { 
          error: 'Email o contraseña incorrectos' 
        });
      }

      // Guardar usuario en sesión (simplificado)
      req.session.user = user;
      res.redirect('/');
      
    } catch (error) {
      res.render('auth/login', { 
        error: 'Error al iniciar sesión' 
      });
    }
  }

  // Mostrar formulario de registro
  showRegister(req, res) {
    res.render('auth/register', { error: null });
  }

  // Procesar registro
  async register(req, res) {
    const { name, email, password, role } = req.body;
    
    try {
      // Verificar si el usuario ya existe
      if (await User.findByEmail(email)) {
        return res.render('auth/register', { 
          error: 'El email ya está registrado' 
        });
      }

      // Crear nuevo usuario
      const user = new User({ name, email, password, role });
      await user.save();
      
      // Autologin después de registro
      req.session.user = user;
      res.redirect('/');
      
    } catch (error) {
      res.render('auth/register', { 
        error: 'Error al registrar usuario' 
      });
    }
  }

  // Cerrar sesión
  logout(req, res) {
    req.session.destroy();
    res.redirect('/auth/login');
  }
}

module.exports = new AuthController();