import express from 'express';
import { getPosts, getGenerations, schedulePost, generatePost } from '../controllers/postController';
import { protect } from '../middlewares/authMiddleware';
import { upload } from '../config/multer';

const postRouter = express.Router();

postRouter.get('/', protect, getPosts);
postRouter.get('/generations', protect, getGenerations);
postRouter.post('/', protect, upload.single('media'), schedulePost);
postRouter.post('/generate', protect, generatePost);

export default postRouter;