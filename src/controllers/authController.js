const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usuariosPath = path.join(__dirname, '../../data/usuarios.json');

class AuthController {
  showLogin(req, res) {
    res.render('auth/login', { error: null, token: null });
  }

  showRegister(req, res) {
    res.render('auth/register', { error: null });
  }

  async login(req, res) {
    const { email, password } = req.body;

    const usuarios = JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));
    const usuario = usuarios.find(u => u.email === email);

    if (!usuario) {
      // Si la solicitud viene de fetch (API), devolver JSON
      if (req.headers['content-type'] === 'application/json') {
        return res.status(401).json({ error: 'Usuario no encontrado' });
      }
      return res.render('auth/login', { error: 'Usuario no encontrado', token: null });
    }

    const passwordValida = bcrypt.compareSync(password, usuario.password);
    if (!passwordValida) {
      if (req.headers['content-type'] === 'application/json') {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }
      return res.render('auth/login', { error: 'Contraseña incorrecta', token: null });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol, email: usuario.email },
      process.env.JWT_SECRET || 'secreto123',
      { expiresIn: '2h' }
    );

    if (req.headers['content-type'] === 'application/json') {
      return res.json({ token });
    }

    // Si viene del formulario clásico, renderiza
    res.render('auth/login', { error: null, token });
  }

  async register(req, res) {
    const { name, email, password, rol } = req.body;
    const usuarios = JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));

    if (usuarios.find(u => u.email === email)) {
      return res.render('auth/register', { error: 'Email ya registrado' });
    }

    const nuevoUsuario = {
      id: usuarios.length + 1,
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      rol
    };

    usuarios.push(nuevoUsuario);
    fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));

    res.redirect('/auth/login');



    res.render('auth/error', { error: 'No se encontró el usuario' });
  }
}

module.exports = new AuthController();
