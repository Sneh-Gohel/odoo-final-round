import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import api from './api'; // Correctly imports src/api/index.ts
import { checkDbConnection } from './config/db'; // Import the check function

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Main API router
app.use('/api', api);

// Health check route
app.get('/', (req: Request, res: Response) => {
    res.send('Placement Tracker API is running... 🚀');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
    
    // Check the database connection as soon as the server starts
    checkDbConnection(); 
});