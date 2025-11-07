import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = 'ember17';
const users = new Map();

export const authService = {
  register: async (username, password) => {
    if (users.has(username)) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: Date.now().toString(),
      username,
      password: hashedPassword
    };

    users.set(username, user);
    return user;
  },

  login: async (username, password) => {
    const user = users.get(username);
    if (!user) {
      throw new Error('User not found');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { user: { id: user.id, username: user.username }, token };
  }
};