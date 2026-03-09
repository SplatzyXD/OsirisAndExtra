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
   `npm install`
4. Start the server by running:
   `npm run start`
5. You should see a message saying `Server listening on port 9001`. **Keep this terminal window open.**

## 3. Starting the WebUI (React JSX)
Since your WebUI is built with React (`trainer-panel.jsx`) and managed with Vite, here is how you launch the UI.
1. Open a **new** terminal or Command Prompt (cmd).
2. Navigate to the `WebUI/UI/vite-project/` directory.
3. Install the UI dependencies by running:
   `npm install`
4. Start the frontend development server by running:
   `npm run dev`
5. Open your browser and navigate to the frontend URL (typically `http://localhost:5173`).

## 4. Connecting the Game
1. Inject `Osiris.dll` into the game.
2. Open the cheat menu by pressing **INSERT**.
3. Go to the **Configs** tab.
4. Under the **WebUI Connection** section:
   - Ensure the WebSocket URL is `ws://127.0.0.1:9001`.
   - Check the **Connect to WebUI** box.
5. In your web browser, you should immediately see the login status change from `WAITING FOR DLL...` (Red) to `DLL INJECTED — READY` (Green).
6. Log into the WebUI using one of the pre-configured credentials:
   - **Username:** admin
   - **Password:** password123
   - (Or use user1/user1 or Splatzy/123)
7. The status indicator on the top bar of the WebUI will show "CONNECTED" and changes you make on the web interface will instantly apply to your game!
