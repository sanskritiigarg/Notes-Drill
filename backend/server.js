import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import errorHandler from './middlewares/errorHandler.js';
import connectDB from './config/db.js';

// ES6 reconstruction of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Intialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware to handle cors
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
import authRouter from './routes/auth.routes.js';

app.use('/api/users', authRouter);

app.use(errorHandler);

// Handle 404 route error
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route Not Found',
    statusCode: 404,
  });
});

//Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle async errors
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
