# Starting the WebUI and Server

This guide explains how to run the Node.js backend server and the React WebUI.

## 1. Prerequisites
You need to have **Node.js** installed on your computer.
You can download it here: [Node.js Official Website](https://nodejs.org/)

## 2. Setting up the Server
The Node.js server acts as the middleman passing configuration data between the WebUI in your browser and the Cheat injected into the game.

1. Open your terminal or Command Prompt (cmd).
2. Navigate to the `WebUI/Server/` directory.
3. Install the dependencies by running:
   ```bash
   npm install
   ```
4. Start the server by running:
   ```bash
   npm start
   ```
5. You should see a message saying `Server listening on port 9001`. **Keep this terminal window open.**

## 3. Starting the WebUI (React JSX)
Since your WebUI is built with React (`trainer-panel.jsx`), you will need to run it via your standard Vite/Create React App/Next.js script (or whatever development environment you are using locally to serve your `jsx` component).
1. Open a **new** terminal or Command Prompt (cmd).
2. Start your frontend development server (e.g. `npm run dev` or `npm start` in your UI folder).
3. Open your browser and navigate to the frontend URL (typically `http://localhost:3000` or `http://localhost:5173`).

## 4. Connecting the Game
1. Inject `Osiris.dll` into the game.
2. Open the cheat menu by pressing **INSERT**.
3. Go to the **Configs** tab.
4. Under the **WebUI Connection** section:
   - Ensure the WebSocket URL is `ws://127.0.0.1:9001`.
   - Check the **Connect** box.
5. In your web browser, log into the WebUI using:
   - **Username:** admin
   - **Password:** admin
6. The status indicator on the WebUI will turn green ("CONNECTED") and changes you make on the web interface will instantly apply to your game!