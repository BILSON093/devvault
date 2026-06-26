import { Router } from 'express';
import { auth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { authLimiter } from '../middlewares/rateLimiter';
import { registerSchema, loginSchema, updateProfileSchema } from '../utils/validator';
import {
  register,
  login,
  refreshToken,
  getMe,
  updateMe,
  getUserById,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from '../controllers/user.controller';

const router = Router();

// Auth
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refreshToken);

// Profile
router.get('/me', auth, getMe);
router.put('/me', auth, validate(updateProfileSchema), updateMe);

// Users
router.get('/:id', getUserById);
router.post('/:id/follow', auth, followUser);
router.delete('/:id/follow', auth, unfollowUser);
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);

export default router;
