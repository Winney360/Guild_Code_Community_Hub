import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  // Read token from cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Check if token exists
  if (!token) {
    res.status(401).json({ message: 'Not authorized, token missing' });
    return;
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    ) as { id: string; role: string };

    // Attach decoded user payload to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token verification failed' });
  }
};

// Middleware to attach the user when a valid token is present, but never block anonymous access
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  // Read token from cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    ) as { id: string; role: string };

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
  } catch (error) {
    // Invalid/expired token — treat as anonymous
  }

  next();
};

// Middleware to restrict access based on roles
export const authorize = (...roles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Not authorized to access this route' });
      return;
    }
    next();
  };
};
