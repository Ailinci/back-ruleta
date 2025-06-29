const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

// Opciones para JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    (req) => req.cookies?.jwt, // También busca en cookies
  ]),
  secretOrKey: process.env.JWT_SECRET,
};

// Estrategia Local (login con email y password)
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const usuario = await Usuario.findOne({ email }).select('+password');
        
        if (!usuario) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }

        const isMatch = await usuario.comparePassword(password);
        if (!isMatch) {
          return done(null, false, { message: 'Contraseña incorrecta' });
        }

        return done(null, usuario);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Estrategia JWT (para proteger rutas)
passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const usuario = await Usuario.findById(payload.id);
      if (!usuario) return done(null, false);
      return done(null, usuario);
    } catch (error) {
      return done(error);
    }
  })
);

module.exports = passport;