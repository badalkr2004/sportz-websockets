import express from 'express';
import http from "http"
import matchRouter from './routes/matches.js';
import { attachWebSocketServer } from './ws/server.js';
import { listMatchesQuerySchema } from './validation/matches.js';
import { securityMiddleware } from './arcjet.js';

const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || "0.0.0.0";

const app = express();
const server = http.createServer(app)


// Use JSON middleware
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use(securityMiddleware)

app.use("/matches", matchRouter)

const { broadcastMatchCreated } = attachWebSocketServer(server)
app.locals.broadcastMatchCreated = broadcastMatchCreated
// Start server
server.listen(PORT, HOST, () => {
    const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`
    const wsUrl = new URL(baseUrl);
    wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:';
    console.log(`Server is running on ${baseUrl}`);
    console.log(`Server is running on ${wsUrl.toString()}/ws`);
});
