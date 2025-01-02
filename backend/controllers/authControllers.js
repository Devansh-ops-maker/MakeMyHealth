import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

export const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role
    });

    const token = createToken(user._id);

    res.status(201).json({
      token,
      user: user.profile
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findByEmailWithPassword(email);
    if (!user || !(await user.comparePassword(password))) {
      await user?.incrementLoginAttempts();
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.isLocked) {
      return res.status(423).json({ message: 'Account is locked' });
    }

    await user.resetLoginAttempts();
    const token = createToken(user._id);

    res.json({
      token,
      user: user.profile
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
