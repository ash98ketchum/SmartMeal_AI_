import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../prisma/client';
import { generateToken } from '../utils/jwt';

export const signup = async (req: Request, res: Response) => {
  const { email, password, role, ngoName, aadharNumber } = req.body;

  if (!email || !password || !ngoName || !aadharNumber) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

const user = await prisma.user.create({
  data: {
    email,
    passwordHash: hashedPassword,  // ✅ correct field name
    role,
    ngoName,                        // ✅ only if role === NGO
    aadharNumber,
  },
});

    const token = generateToken(user.id);
    return res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
