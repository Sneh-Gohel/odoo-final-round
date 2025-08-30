// src/index.ts

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares to enable CORS and parse JSON bodies
app.use(cors());
app.use(express.json());

// A simple test route to make sure everything is working
app.get('/', (req: Request, res: Response) => {
    res.send('Hello from the server! It is running correctly. 🚀');
});

// 💡 THIS IS THE MOST IMPORTANT PART 💡
// It starts the server and keeps it running to listen for requests.
app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});