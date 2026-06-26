import { Router } from 'express';
import { auth, optionalAuth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createResourceSchema, updateResourceSchema, createCommentSchema } from '../utils/validator';
import {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
  likeResource,
  unlikeResource,
  getComments,
  createComment,
} from '../controllers/resource.controller';

const router = Router();

router.post('/', auth, validate(createResourceSchema), createResource);
router.get('/', optionalAuth, getResources);
router.get('/:id', optionalAuth, getResourceById);
router.put('/:id', auth, validate(updateResourceSchema), updateResource);
router.delete('/:id', auth, deleteResource);

router.post('/:id/like', auth, likeResource);
router.delete('/:id/like', auth, unlikeResource);

router.get('/:id/comments', getComments);
router.post('/:id/comments', auth, validate(createCommentSchema), createComment);

export default router;
