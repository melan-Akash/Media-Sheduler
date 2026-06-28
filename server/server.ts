import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

// Import configurations and services
import connectDB from './config/db';
import { initScheduler } from './services/schedulerService';

// Import routers
import authRouter from './routes/authRoutes';
import socialAuthRouter from './routes/socialAuthRoutes';
import accountRouter from './routes/accountRoutes';
import postRouter from './routes/postRoutes';
import activityRouter from './routes/activityRoutes';

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Database Connection
await connectDB();

// Define Port
const port = process.env.PORT || 3000;

// Default test route
app.get('/', (_req: Request, res: Response) => {
  res.send('server is live');
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/auth', socialAuthRouter);
app.use('/api/accounts', accountRouter);
app.use('/api/posts', postRouter);
app.use('/api/activity', activityRouter);

// Initialize background scheduler
initScheduler();

// Global Error Handler
app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  const status = error.status || 500;
  res.status(status).send({
    message: error.message || 'Server error'
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});