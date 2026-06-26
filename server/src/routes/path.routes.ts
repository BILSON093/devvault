import { Router } from 'express';
import { auth, optionalAuth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createPathSchema, updatePathSchema, addPathItemSchema, updatePathItemSchema } from '../utils/validator';
import {
  createPath,
  getPaths,
  getPathById,
  updatePath,
  deletePath,
  addPathItem,
  updatePathItem,
  removePathItem,
  forkPath,
  getExplore,
} from '../controllers/path.controller';

const router = Router();

router.get('/explore', getExplore);

router.post('/', auth, validate(createPathSchema), createPath);
router.get('/', auth, getPaths);
router.get('/:id', optionalAuth, getPathById);
router.put('/:id', auth, validate(updatePathSchema), updatePath);
router.delete('/:id', auth, deletePath);

router.post('/:id/items', auth, validate(addPathItemSchema), addPathItem);
router.put('/:id/items/:itemId', auth, validate(updatePathItemSchema), updatePathItem);
router.delete('/:id/items/:itemId', auth, removePathItem);
router.post('/:id/fork', auth, forkPath);

export default router;
