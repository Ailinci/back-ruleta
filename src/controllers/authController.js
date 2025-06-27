const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UsuarioRepositoryMONGO = require('../../repositories/usuarioRepositoryMONGO');

class AuthController {
  showLogin(req, res) {
    res.render('auth/login', { error: null, token: null });
  }

  showRegister(req, res) {
    res.render('auth/register', { error: null });
  }

  async login(req, res) {
    const { email, password } = req.body;

    const usuario = await UsuarioRepositoryMONGO.getByEmail(email);
    if (!usuario) {
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
      { id: usuario._id, rol: usuario.rol, email: usuario.email },
      process.env.JWT_SECRET || 'secreto123',
      { expiresIn: '2h' }
    );

    if (req.headers['content-type'] === 'application/json') {
      return res.json({ token });
    }

    res.render('auth/login', { error: null, token });
  }

  async register(req, res) {
    const { name, email, password, rol } = req.body;

    const existe = await UsuarioRepositoryMONGO.existsByEmail(email);
    if (existe) {
      return res.render('auth/register', { error: 'Email ya registrado' });
    }

    const nuevoUsuario = {
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      rol
    };

    await UsuarioRepositoryMONGO.save(nuevoUsuario);
    res.redirect('/auth/login');
  }
}

module.exports = new AuthController();
