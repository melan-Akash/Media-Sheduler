import express from 'express';
import { getPosts, getGenerations, schedulePost, generatePost, deletePost } from '../controllers/postController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { upload } from '../config/multer.js';

const postRouter = express.Router();

postRouter.get('/', protect, getPosts);
postRouter.get('/generations', protect, getGenerations);
postRouter.post('/', protect, upload.single('media'), schedulePost);
postRouter.post('/generate', protect, generatePost);
postRouter.delete('/:id', protect, deletePost);

export default postRouter;