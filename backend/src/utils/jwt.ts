import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'smartmeal-secret';

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};
