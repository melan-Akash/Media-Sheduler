import 'dotenv/config';
import express from 'express';
import cors from 'cors';
// Import configurations and services
import connectDB from './config/db.js';
import { initScheduler } from './services/schedulerService.js';
// Import routers
import authRouter from './routes/authRoutes.js';
import socialAuthRouter from './routes/socialAuthRoutes.js';
import accountRouter from './routes/accountRoutes.js';
import postRouter from './routes/postRoutes.js';
import activityRouter from './routes/activityRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';
const app = express();
// Global Middlewares
app.use(cors());
app.use(express.json());
// Database Connection
await connectDB();
// Define Port
const port = process.env.PORT || 3000;
// Default test route
app.get('/', (_req, res) => {
    res.send('server is live');
});
// API Routes
app.use('/api/auth', authRouter);
app.use('/api/auth', socialAuthRouter);
app.use('/api/accounts', accountRouter);
app.use('/api/posts', postRouter);
app.use('/api/activity', activityRouter);
app.use('/api/payment', paymentRouter);
// Initialize background scheduler
initScheduler();
// Global Error Handler
app.use((error, _req, res, _next) => {
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
//# sourceMappingURL=server.js.map