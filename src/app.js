import express from 'express';
import path from 'path';
import { __dirname } from './utils.js';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import viewsRouter from './routes/views.router.js';
import sessionRouter from './routes/session.router.js';
import usersRouter from './routes/users.router.js';
import mongoose from 'mongoose';
import { MONGO_URI } from '../config.js';


// Verificar la URI de conexión específica
console.log('MongoDB URI:', MONGO_URI);

const app = express();
const PORT = 8080;

// Configurar para trabajar con JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar cookie parser y passport
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', viewsRouter);
app.use('/session', sessionRouter);
app.use('/api/users', usersRouter);

// Conectar a MongoDB Atlas usando la URI desde config.js
mongoose.connect(MONGO_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(error => console.error('Error de conexión:', error));


app.listen(PORT, () => console.log(`Listening on ${PORT}`));
