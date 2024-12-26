import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const router = Router();
const SECRET_KEY = 'CoderKeyQueFuncionaComoUnSecret';

// Registro de usuario
router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, cart } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(406).json({ status: 'error', error: 'User already exists' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new User({ first_name, last_name, email, age, password: hashedPassword, cart });
        await newUser.save();

        const access_token = jwt.sign({ userId: newUser._id }, SECRET_KEY);
        res.status(201).json({ status: 'success', access_token });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

// Login de usuario
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, SECRET_KEY, { expiresIn: '24h' });
        res.cookie('tokenCookie', token, { httpOnly: true, maxAge: 60 * 60 * 1000 }).json({ message: 'Login exitoso' });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

// Middleware de autenticación
export const authenticate = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ status: 'error', message: 'Autenticación fallida' });
    }
};

// Ruta current
router.get('/current', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        res.status(200).json({ status: 'success', user });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

export default router;
