import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const initializePassport = () => {
  passport.use('login', new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
        
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: 'Invalid password' });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));
  
  passport.use('jwt', new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    },
    async (jwtPayload, done) => {
      try {
        return done(null, jwtPayload);
      } catch (error) {
        return done(error);
      }
    }
  ));
  
  const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies['jwt'];
    }
    return token;
  };
  
  passport.use('current', new JWTStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_SECRET
    },
    async (jwtPayload, done) => {
      try {
        if (!jwtPayload || !jwtPayload._id) { 
            return done(null, false, { message: 'Invalid token payload: _id missing' });
        }
        return done(null, jwtPayload);
      } catch (error) {
        return done(error);
      }
    }
  ));
};

export default initializePassport;
