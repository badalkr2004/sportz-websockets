import express from 'express';
import matchRouter from './routes/matches.js';
import { listMatchesQuerySchema } from './validation/matches.js';

const app = express();
const PORT = 8000;

// Use JSON middleware
app.use(express.json());

// Root route
app.get('/', (req, res) => {

});

app.use("/matches", matchRouter)

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
