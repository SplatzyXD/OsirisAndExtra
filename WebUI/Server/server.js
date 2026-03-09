const http = require('http');
const WebSocket = require('ws');

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Trainer Panel WebSocket Server");
});
const wss = new WebSocket.Server({ server });

const clients = new Set();
let gameClient = null;

// Hardcoded users list
const USERS = [
    { username: 'admin', password: 'password123' },
    { username: 'user1', password: 'user1' },
    { username: 'Splatzy', password: '123' }
];

wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === 'status_ping') {
                ws.send(JSON.stringify({ type: 'game_status', connected: !!(gameClient && gameClient.readyState === WebSocket.OPEN) }));
                return;
            }

            if (data.type === 'auth') {
                const isValidUser = USERS.some(u => u.username === data.username && u.password === data.password);

                if (isValidUser) {
                    ws.send(JSON.stringify({ type: 'auth_success' }));
                    ws.isAuthenticated = true;
                    clients.add(ws);
                    console.log('Client authenticated as: ' + data.username);

                    // Immediately send game status on successful login
                    if (gameClient && gameClient.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: 'game_status', connected: true }));
                    } else {
                        ws.send(JSON.stringify({ type: 'game_status', connected: false }));
                    }
                } else {
                    ws.send(JSON.stringify({ type: 'auth_error', message: 'Invalid credentials' }));
                }
            } else if (data.type === 'game_connect') {
                gameClient = ws;
                console.log('Game client connected');
                // Broadcast to WebUIs that game is connected (even unauthenticated ones on login screen)
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
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
            console.log('Game client disconnected');
            gameClient = null;
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
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
