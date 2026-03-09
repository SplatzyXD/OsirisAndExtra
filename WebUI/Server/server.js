const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files from the build directory (assuming React app is built there)
app.use(express.static(path.join(__dirname, '../build')));

const clients = new Set();
let gameClient = null;

wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === 'auth') {
                if (data.username === 'admin' && data.password === 'admin') {
                    ws.send(JSON.stringify({ type: 'auth_success' }));
                    ws.isAuthenticated = true;
                    clients.add(ws);
                    console.log('Client authenticated');
                } else {
                    ws.send(JSON.stringify({ type: 'auth_error', message: 'Invalid credentials' }));
                }
            } else if (data.type === 'game_connect') {
                gameClient = ws;
                console.log('Game client connected');
                // Broadcast to WebUIs that game is connected
                clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN && client.isAuthenticated) {
                        client.send(JSON.stringify({ type: 'game_status', connected: true }));
                    }
                });
            } else if (ws.isAuthenticated) {
                // Forward commands from WebUI to Game
                if (gameClient && gameClient.readyState === WebSocket.OPEN) {
                    gameClient.send(message.toString());
                }
            } else if (ws === gameClient) {
                // Forward data from Game to WebUIs
                clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN && client.isAuthenticated) {
                        client.send(message.toString());
                    }
                });
            }
        } catch (e) {
            console.error('Failed to parse message:', e);
        }
    });

    ws.on('close', () => {
        console.log('WebSocket disconnected');
        clients.delete(ws);
        if (ws === gameClient) {
            gameClient = null;
            clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN && client.isAuthenticated) {
                    client.send(JSON.stringify({ type: 'game_status', connected: false }));
                }
            });
        }
    });
});

const PORT = 9001;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
