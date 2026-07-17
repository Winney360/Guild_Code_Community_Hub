import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const sendTokenCookie = (userId: string, role: string, res: Response) => {
  const token = jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '1d' }
  );

  const cookieOptions = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  };

  res.cookie('token', token, cookieOptions);
};
