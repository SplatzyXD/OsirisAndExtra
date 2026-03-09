import { useState, useEffect, useRef } from "react";

const TABS = ["Main", "Ragebot", "Legitbot", "Antiaim", "Visuals", "Misc", "Skins", "Configs", "Players"];

const menuData = {
  Main: {
    sections: [
      {
        title: "Connection",
        items: [
          { type: "info", label: "Status", value: "Connected" },
          { type: "info", label: "Latency", value: "12ms" },
          { type: "button", label: "Unhook" },
          { type: "button", label: "Update" },
        ],
      },
      {
        title: "General",
        items: [
          { type: "checkbox", label: "Watermark", checked: true },
          { type: "checkbox", label: "Keybinds list", checked: false },
          { type: "checkbox", label: "Spectator list", checked: true },
          { type: "checkbox", label: "Player List", checked: false },
          { type: "checkbox", label: "No Title Bar", checked: true },
          { type: "checkbox", label: "Keyboard display", checked: false },
          { type: "checkbox", label: "Freecam", checked: false },
          { type: "checkbox", label: "Thirdperson", checked: false },
          { type: "checkbox", label: "Full bright", checked: false },
          { type: "checkbox", label: "Motion Blur", checked: false },
          { type: "checkbox", label: "Keep FOV during scope", checked: true },
          { type: "checkbox", label: "Disable HUD blur", checked: true },
          { type: "checkbox", label: "Disable post-processing", checked: false },
          { type: "checkbox", label: "No 3d sky", checked: false },
          { type: "slider", label: "Fov", min: 60, max: 130, value: 90 },
          { type: "slider", label: "Aspect Ratio", min: 0.5, max: 2.5, value: 1.0, step: 0.01 },
          { type: "combo", label: "Screen effect", options: ["None", "Drunk", "High", "Dreamy"] },
          { type: "combo", label: "Skybox", options: ["Default", "Night", "Dawn", "Overcast", "Custom"] },
          { type: "input-text", label: "Skybox filename", placeholder: "skybox_name" },
        ],
      },
    ],
  },
  Ragebot: {
    sections: [
      {
        title: "General",
        items: [
          { type: "checkbox", label: "Enabled", checked: false },
          { type: "checkbox", label: "Silent", checked: false },
          { type: "checkbox", label: "Friendly fire", checked: false },
          { type: "checkbox", label: "Disable in freeztime", checked: true },
          { type: "combo", label: "Target", options: ["All", "Enemies", "Friends"] },
          { type: "combo", label: "Priority", options: ["Nearest", "Lowest HP", "Highest HP", "FOV"] },
          { type: "slider-int", label: "Hitchance", min: 0, max: 100, value: 75 },
          { type: "slider-int", label: "Min damage", min: 0, max: 200, value: 10 },
          { type: "slider-int", label: "Min damage override", min: 0, max: 200, value: 0 },
          { type: "slider-int", label: "Multipoint", min: 0, max: 100, value: 50 },
          { type: "checkbox", label: "Disable multipoint if low fps", checked: true },
        ],
      },
      {
        title: "Hitboxes",
        items: [
          { type: "checkbox", label: "Headshot", checked: true },
          { type: "checkbox", label: "Killshot", checked: false },
          { type: "checkbox", label: "Noscope", checked: false },
          { type: "checkbox", label: "Thrusmoke", checked: false },
          { type: "checkbox", label: "Penetrated", checked: false },
          { type: "checkbox", label: "Only Headshots", checked: false },
          { type: "checkbox", label: "Visible only", checked: true },
          { type: "checkbox", label: "Spotted Only", checked: false },
          { type: "checkbox", label: "At targets", checked: false },
        ],
      },
      {
        title: "Recoil Control",
        items: [
          { type: "checkbox", label: "Recoil control system", checked: true },
          { type: "checkbox", label: "Silent RCS", checked: false },
          { type: "slider", label: "RCS Horizontal", min: 0, max: 100, value: 80 },
          { type: "slider", label: "RCS Vertical", min: 0, max: 100, value: 80 },
          { type: "slider-int", label: "RCS Ignore Shots", min: 0, max: 10, value: 1 },
        ],
      },
      {
        title: "Backtrack",
        items: [
          { type: "checkbox", label: "Backtrack", checked: false },
          { type: "checkbox", label: "Disable backtrack if low fps", checked: true },
          { type: "slider-int", label: "Time limit", min: 0, max: 200, value: 100 },
          { type: "slider-int", label: "Pred Amnt", min: 0, max: 64, value: 12 },
        ],
      },
    ],
  },
  Legitbot: {
    sections: [
      {
        title: "Aimbot",
        items: [
          { type: "checkbox", label: "Enabled", checked: false },
          { type: "checkbox", label: "Aimlock", checked: false },
          { type: "checkbox", label: "Between shots", checked: false },
          { type: "checkbox", label: "Auto scope", checked: false },
          { type: "checkbox", label: "Scoped only", checked: false },
          { type: "checkbox", label: "Ignore flash", checked: true },
          { type: "checkbox", label: "Ignore smoke", checked: true },
          { type: "slider", label: "Fov", min: 0, max: 30, value: 5 },
          { type: "slider", label: "Smooth", min: 1, max: 100, value: 20 },
          { type: "slider", label: "Max angle delta", min: 0, max: 90, value: 10 },
          { type: "slider-int", label: "Reaction time", min: 0, max: 500, value: 100 },
          { type: "slider-int", label: "Shot delay", min: 0, max: 500, value: 0 },
        ],
      },
      {
        title: "Triggerbot",
        items: [
          { type: "checkbox", label: "Triggerbot", checked: false },
          { type: "checkbox", label: "Friendly fire", checked: false },
          { type: "checkbox", label: "Scoped only", checked: false },
          { type: "checkbox", label: "Ignore flash", checked: true },
          { type: "checkbox", label: "Ignore smoke", checked: true },
          { type: "checkbox", label: "Attackerblind", checked: false },
          { type: "checkbox", label: "Audible Only", checked: false },
          { type: "slider-int", label: "Shot delay", min: 0, max: 500, value: 50 },
          { type: "slider-int", label: "Min damage", min: 0, max: 200, value: 1 },
          { type: "slider-int", label: "Hitchance", min: 0, max: 100, value: 50 },
          { type: "slider-int", label: "Prediction Amnt", min: 0, max: 64, value: 0 },
        ],
      },
      {
        title: "Weapons",
        items: [
          { type: "combo", label: "Primary weapon", options: ["AK-47", "M4A1-S", "AWP", "SG 553"] },
          { type: "combo", label: "Secondary weapon", options: ["Glock-18", "USP-S", "Desert Eagle"] },
        ],
      },
    ],
  },
  Antiaim: {
    sections: [
      {
        title: "Anti-Aim",
        items: [
          { type: "checkbox", label: "AntiAim", checked: false },
          { type: "checkbox", label: "Fakeduck", checked: false },
          { type: "checkbox", label: "Extend", checked: false },
          { type: "combo", label: "Pitch", options: ["None", "Down", "Up", "Zero"] },
          { type: "combo", label: "Yaw base", options: ["Local view", "Opposite", "Custom"] },
          { type: "combo", label: "Yaw modifier", options: ["None", "Jitter", "Spin", "Switch"] },
          { type: "combo", label: "Lby mode", options: ["None", "Opposite", "Sway"] },
          { type: "slider-int", label: "Yaw add", min: -180, max: 180, value: 0 },
          { type: "slider-int", label: "Jitter yaw range", min: 0, max: 180, value: 30 },
          { type: "slider-int", label: "Spin base", min: -180, max: 180, value: 0 },
          { type: "slider-int", label: "Left limit", min: 0, max: 60, value: 58 },
          { type: "slider-int", label: "Right limit", min: 0, max: 60, value: 58 },
        ],
      },
      {
        title: "Fake Lag",
        items: [
          { type: "checkbox", label: "FakeLag", checked: false },
          { type: "checkbox", label: "Enabled Fake Latency", checked: false },
          { type: "slider-int", label: "Ping", min: 0, max: 200, value: 0 },
          { type: "slider-int", label: "Limit", min: 1, max: 14, value: 6 },
        ],
      },
      {
        title: "Fake Angle",
        items: [
          { type: "checkbox", label: "Fake Angle", checked: false },
          { type: "slider", label: "##roll", min: -90, max: 90, value: 0 },
          { type: "slider-int", label: "Crouch lock", min: 0, max: 100, value: 0 },
        ],
      },
    ],
  },
  Visuals: {
    sections: [
      {
        title: "ESP",
        items: [
          { type: "checkbox", label: "Esp", checked: false },
          { type: "checkbox", label: "Health Bar", checked: true },
          { type: "checkbox", label: "Health based", checked: true },
          { type: "checkbox", label: "Armor", checked: false },
          { type: "checkbox", label: "Health", checked: true },
          { type: "checkbox", label: "Money", checked: false },
          { type: "checkbox", label: "Rank", checked: false },
          { type: "checkbox", label: "Wins", checked: false },
          { type: "checkbox", label: "Steam ID", checked: false },
          { type: "checkbox", label: "Dominated", checked: true },
          { type: "checkbox", label: "Blinking", checked: false },
          { type: "checkbox", label: "Spotted Only", checked: false },
          { type: "slider-int", label: "Radius", min: 0, max: 100, value: 50 },
        ],
      },
      {
        title: "Chams & Glow",
        items: [
          { type: "checkbox", label: "Chams", checked: false },
          { type: "checkbox", label: "Glow", checked: false },
          { type: "checkbox", label: "Wireframe", checked: false },
          { type: "checkbox", label: "Ignore-Z", checked: false },
          { type: "checkbox", label: "Visible only", checked: true },
          { type: "combo", label: "Material", options: ["Normal", "Flat", "Metallic", "Pearlescent", "Chrome"] },
          { type: "combo", label: "Type", options: ["Players", "Weapons", "Bomb", "Chickens"] },
          { type: "slider", label: "Alpha", min: 0, max: 1, value: 0.8, step: 0.01 },
        ],
      },
      {
        title: "Visuals Misc",
        items: [
          { type: "checkbox", label: "Radar hack", checked: false },
          { type: "checkbox", label: "No smoke", checked: false },
          { type: "checkbox", label: "No molotov", checked: false },
          { type: "checkbox", label: "Smoke Circle", checked: false },
          { type: "checkbox", label: "Smoke Timer", checked: false },
          { type: "checkbox", label: "Molotov Timer", checked: false },
          { type: "checkbox", label: "Molotov Polygon", checked: false },
          { type: "checkbox", label: "Wireframe smoke", checked: false },
          { type: "checkbox", label: "Wireframe molotov", checked: false },
          { type: "checkbox", label: "Grenade Prediction", checked: false },
          { type: "checkbox", label: "Draw velocity", checked: false },
          { type: "checkbox", label: "Zoom", checked: false },
          { type: "checkbox", label: "No scope overlay", checked: false },
          { type: "checkbox", label: "No aim punch", checked: false },
          { type: "checkbox", label: "No view punch", checked: false },
          { type: "checkbox", label: "No view bob", checked: false },
          { type: "checkbox", label: "No fog", checked: false },
          { type: "checkbox", label: "No grass", checked: false },
          { type: "checkbox", label: "No shadows", checked: false },
          { type: "checkbox", label: "No hands", checked: false },
          { type: "checkbox", label: "No sleeves", checked: false },
          { type: "checkbox", label: "No weapons", checked: false },
          { type: "checkbox", label: "Shadow changer", checked: false },
          { type: "checkbox", label: "Trails", checked: false },
          { type: "checkbox", label: "Purchase List", checked: false },
          { type: "checkbox", label: "Show Prices", checked: false },
          { type: "checkbox", label: "Killfeed changer", checked: false },
          { type: "checkbox", label: "Preserve Killfeed", checked: false },
          { type: "checkbox", label: "Disable jiggle bones", checked: false },
          { type: "checkbox", label: "Disable model occlusion", checked: false },
          { type: "slider", label: "Text Cull Distance", min: 0, max: 5000, value: 1000, step: 50 },
        ],
      },
      {
        title: "Sound",
        items: [
          { type: "combo", label: "Hit Sound", options: ["None", "Default", "Skeet", "Custom"] },
          { type: "combo", label: "Kill Sound", options: ["None", "Default", "Skeet", "Custom"] },
          { type: "input-text", label: "Hit Sound filename", placeholder: "sound.wav" },
          { type: "input-text", label: "Kill Sound filename", placeholder: "sound.wav" },
          { type: "combo", label: "Hit effect", options: ["None", "Blood", "Spark"] },
          { type: "combo", label: "Hit marker", options: ["None", "Default", "Cross"] },
          { type: "slider", label: "Hit effect time", min: 0, max: 5, value: 1, step: 0.1 },
          { type: "slider", label: "Hit marker time", min: 0, max: 5, value: 1, step: 0.1 },
          { type: "slider", label: "Bullet Impacts time", min: 0, max: 5, value: 2, step: 0.1 },
        ],
      },
    ],
  },
  Misc: {
    sections: [
      {
        title: "Movement",
        items: [
          { type: "checkbox", label: "Bunny hop", checked: false },
          { type: "checkbox", label: "Auto strafe", checked: false },
          { type: "checkbox", label: "Auto stop", checked: false },
          { type: "checkbox", label: "Fast Stop", checked: false },
          { type: "checkbox", label: "Fast duck", checked: false },
          { type: "checkbox", label: "Fakeduck", checked: false },
          { type: "checkbox", label: "Slowwalk", checked: false },
          { type: "slider-int", label: "Slowwalk Amnt", min: 0, max: 100, value: 50 },
          { type: "checkbox", label: "Edge Jump", checked: false },
          { type: "checkbox", label: "Edge Bug", checked: false },
          { type: "checkbox", label: "Jump Bug", checked: false },
          { type: "checkbox", label: "Mini jump", checked: false },
          { type: "checkbox", label: "Jump stats", checked: false },
          { type: "checkbox", label: "Auto pixel surf", checked: false },
          { type: "checkbox", label: "Moonwalk", checked: false },
          { type: "checkbox", label: "Forward enabled", checked: false },
          { type: "checkbox", label: "Magnet", checked: false },
        ],
      },
      {
        title: "Automation",
        items: [
          { type: "checkbox", label: "Auto accept", checked: false },
          { type: "checkbox", label: "Auto pistol", checked: false },
          { type: "checkbox", label: "Auto reload", checked: false },
          { type: "checkbox", label: "Auto shot", checked: false },
          { type: "checkbox", label: "Auto scope", checked: false },
          { type: "checkbox", label: "Autobuy", checked: false },
          { type: "checkbox", label: "Fast plant", checked: false },
          { type: "checkbox", label: "Knifebot", checked: false },
          { type: "checkbox", label: "Block bot", checked: false },
          { type: "checkbox", label: "Prepare revolver", checked: false },
          { type: "checkbox", label: "Anti AFK kick", checked: false },
          { type: "checkbox", label: "Fix tablet signal", checked: false },
          { type: "checkbox", label: "Deagle spinner", checked: false },
          { type: "checkbox", label: "Opposite Hand Knife", checked: false },
        ],
      },
      {
        title: "Information",
        items: [
          { type: "checkbox", label: "Reveal money", checked: false },
          { type: "checkbox", label: "Reveal ranks", checked: false },
          { type: "checkbox", label: "Reveal suspect", checked: false },
          { type: "checkbox", label: "Reveal votes", checked: false },
          { type: "checkbox", label: "Chat revealer", checked: false },
          { type: "checkbox", label: "Name stealer", checked: false },
        ],
      },
      {
        title: "Bypass",
        items: [
          { type: "checkbox", label: "Sv pure bypass", checked: false },
          { type: "checkbox", label: "Unlock hidden cvars", checked: false },
          { type: "checkbox", label: "Unlock inventory", checked: false },
          { type: "checkbox", label: "Adblock", checked: false },
        ],
      },
      {
        title: "Clan Tag",
        items: [
          { type: "checkbox", label: "Custom clantag", checked: false },
          { type: "checkbox", label: "Animated clan tag", checked: false },
          { type: "checkbox", label: "Clock tag", checked: false },
          { type: "input-text", label: "Custom name", placeholder: "Tag name" },
          { type: "input-text", label: "Custom Player Model", placeholder: "models/..." },
          { type: "combo", label: "CT Player Model", options: ["Default", "GIGN", "SAS", "FBI"] },
          { type: "combo", label: "T Player Model", options: ["Default", "Phoenix", "L337 Krew", "Pirate"] },
        ],
      },
      {
        title: "Reportbot",
        items: [
          { type: "checkbox", label: "Reportbot", checked: false },
          { type: "checkbox", label: "Aim Hacking", checked: true },
          { type: "checkbox", label: "Wall Hacking", checked: true },
          { type: "checkbox", label: "Other Hacking", checked: false },
          { type: "checkbox", label: "Griefing", checked: false },
          { type: "checkbox", label: "Abusive Communications", checked: false },
          { type: "slider-int", label: "Delay (s)", min: 1, max: 60, value: 5 },
          { type: "slider-int", label: "Rounds", min: 1, max: 30, value: 1 },
        ],
      },
      {
        title: "Misc Options",
        items: [
          { type: "checkbox", label: "Kill message", checked: false },
          { type: "checkbox", label: "Show fails", checked: false },
          { type: "checkbox", label: "Show color on fails", checked: false },
          { type: "checkbox", label: "Show key tiles", checked: false },
          { type: "checkbox", label: "Simplify naming", checked: true },
          { type: "checkbox", label: "Inverse ragdoll gravity", checked: false },
          { type: "combo", label: "Force region", options: ["Auto", "NA", "EU", "Asia"] },
          { type: "input-text", label: "Name Tag", placeholder: "Custom name" },
          { type: "slider-int", label: "Seed", min: 0, max: 999, value: 0 },
        ],
      },
    ],
  },
  Skins: {
    sections: [
      {
        title: "Skin Changer",
        items: [
          { type: "combo", label: "Knife", options: ["Default", "Bayonet", "Flip", "Gut", "Karambit", "M9 Bayonet"] },
          { type: "combo", label: "Glove", options: ["Default", "Bloodhound", "Sport", "Driver", "Hand Wraps"] },
          { type: "combo", label: "Quality", options: ["Normal", "Genuine", "Vintage", "Unusual", "Unique", "Community", "Valve"] },
          { type: "combo", label: "Style", options: ["Normal", "StatTrak", "Souvenir"] },
          { type: "slider", label: "Wear", min: 0, max: 1, value: 0.01, step: 0.001 },
          { type: "input-int", label: "StatTrak™", placeholder: "0" },
          { type: "input-text", label: "Name Tag", placeholder: "Skin name" },
          { type: "checkbox", label: "Unlock inventory", checked: false },
        ],
      },
    ],
  },
  Configs: {
    sections: [
      {
        title: "Config Manager",
        items: [
          { type: "config-panel" },
        ],
      },
    ],
  },
};

const glsl = `
  background: radial-gradient(ellipse at 20% 50%, rgba(20,255,100,0.03) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(0,180,255,0.03) 0%, transparent 50%),
              #0a0a0c;
`;

export default function TrainerPanel() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("Main");
  const [state, setState] = useState({});
  const [configs, setConfigs] = useState(["default", "rage_config", "legit_cfg"]);
  const [selectedConfig, setSelectedConfig] = useState("default");
  const [newConfigName, setNewConfigName] = useState("");
  const [loginAnim, setLoginAnim] = useState(false);
  const [panelAnim, setPanelAnim] = useState(false);
  const [tick, setTick] = useState(0);
  const scanRef = useRef(null);

  const WEAPONS = ["AK-47","M4A1-S","AWP","Desert Eagle","USP-S","Glock-18","SG 553","P250","MP9","MAC-10","Knife","HE Grenade","Flashbang"];

  const DUMMY_PLAYERS = [
    // CT team
    { id: 0,  name: "xXSniper99Xx",  team: "CT", health: 92, armor: 100, weapon: "AWP",          ping: 18,  alive: true,  money: 8300,  kills: 14, deaths: 3,  dist: 320  },
    { id: 1,  name: "cr0wbar",       team: "CT", health: 47, armor: 50,  weapon: "M4A1-S",        ping: 34,  alive: true,  money: 3200,  kills: 6,  deaths: 7,  dist: 1850 },
    { id: 2,  name: "ALPHA_DOG",     team: "CT", health: 0,  armor: 0,   weapon: "USP-S",          ping: 22,  alive: false, money: 1000,  kills: 2,  deaths: 5,  dist: 0    },
    { id: 3,  name: "fr0stbite",     team: "CT", health: 100,armor: 100, weapon: "SG 553",         ping: 67,  alive: true,  money: 12400, kills: 9,  deaths: 4,  dist: 540  },
    { id: 4,  name: "Venom_CT",      team: "CT", health: 15, armor: 0,   weapon: "P250",           ping: 112, alive: true,  money: 650,   kills: 1,  deaths: 9,  dist: 2700 },
    // T team
    { id: 5,  name: "rush_b_blyat",  team: "T",  health: 88, armor: 100, weapon: "AK-47",          ping: 29,  alive: true,  money: 9100,  kills: 11, deaths: 4,  dist: 410  },
    { id: 6,  name: "d3ath_h4nd",    team: "T",  health: 0,  armor: 0,   weapon: "Glock-18",       ping: 44,  alive: false, money: 800,   kills: 3,  deaths: 6,  dist: 0    },
    { id: 7,  name: "Lurk3r",        team: "T",  health: 63, armor: 50,  weapon: "Desert Eagle",   ping: 88,  alive: true,  money: 5500,  kills: 7,  deaths: 5,  dist: 3200 },
    { id: 8,  name: "HeatSeeker",    team: "T",  health: 100,armor: 100, weapon: "AWP",            ping: 15,  alive: true,  money: 15600, kills: 18, deaths: 2,  dist: 290  },
    { id: 9,  name: "bl1ndsh0t",     team: "T",  health: 31, armor: 25,  weapon: "MAC-10",         ping: 55,  alive: true,  money: 2100,  kills: 4,  deaths: 8,  dist: 1100 },
  ];

  const [players, setPlayers] = useState(DUMMY_PLAYERS);

  // Simulate live data updates
  useEffect(() => {
    if (!loggedIn) return;
    const interval = setInterval(() => {
      setTick(t => t + 1);
      setPlayers(prev => prev.map(p => ({
        ...p,
        health: p.alive ? Math.min(100, Math.max(1, p.health + Math.floor((Math.random() - 0.5) * 6))) : 0,
        ping: Math.max(5, Math.min(200, p.ping + Math.floor((Math.random() - 0.5) * 8))),
        weapon: Math.random() > 0.94 ? WEAPONS[Math.floor(Math.random() * WEAPONS.length)] : p.weapon,
        dist: p.alive ? Math.max(50, p.dist + Math.floor((Math.random() - 0.5) * 120)) : 0,
      })));
    }, 1800);
    return () => clearInterval(interval);
  }, [loggedIn]);

  useEffect(() => {
    setLoginAnim(true);
  }, []);

  const handleLogin = () => {
    if (username.trim() === "" || password.trim() === "") {
      setLoginError("Enter credentials.");
      return;
    }
    setLoginError("");
    setLoggedIn(true);
    setTimeout(() => setPanelAnim(true), 50);
  };

  const getVal = (label, defaultVal) => {
    return state[label] !== undefined ? state[label] : defaultVal;
  };

  const setVal = (label, val) => {
    setState(prev => ({ ...prev, [label]: val }));
  };

  const renderItem = (item, idx) => {
    if (item.type === "info") {
      return (
        <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <span style={{ fontSize: 11, color: "#6b7280", fontFamily: "'JetBrains Mono', monospace" }}>{item.label}</span>
          <span style={{ fontSize: 11, color: item.value === "Connected" ? "#22c55e" : "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>{item.value}</span>
        </div>
      );
    }

    if (item.type === "button") {
      return (
        <button key={idx} onClick={() => {}} style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#94a3b8",
          padding: "5px 14px",
          borderRadius: 4,
          fontSize: 11,
          cursor: "pointer",
          fontFamily: "'JetBrains Mono', monospace",
          marginRight: 6,
          marginBottom: 4,
          transition: "all 0.15s",
        }}
          onMouseEnter={e => { e.target.style.background = "rgba(34,197,94,0.12)"; e.target.style.borderColor = "rgba(34,197,94,0.3)"; e.target.style.color = "#22c55e"; }}
          onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.04)"; e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.color = "#94a3b8"; }}
        >{item.label}</button>
      );
    }

    if (item.type === "checkbox") {
      const checked = getVal(item.label, item.checked);
      return (
        <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 0", cursor: "pointer", userSelect: "none" }}
          onClick={() => setVal(item.label, !checked)}>
          <div style={{
            width: 14, height: 14, borderRadius: 3,
            border: checked ? "1px solid rgba(34,197,94,0.8)" : "1px solid rgba(255,255,255,0.15)",
            background: checked ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.03)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s", flexShrink: 0,
          }}>
            {checked && <div style={{ width: 6, height: 6, background: "#22c55e", borderRadius: 1 }} />}
          </div>
          <span style={{ fontSize: 11, color: checked ? "#e2e8f0" : "#64748b", fontFamily: "'JetBrains Mono', monospace", transition: "color 0.15s" }}>{item.label}</span>
        </div>
      );
    }

    if (item.type === "slider" || item.type === "slider-int") {
      const val = getVal(item.label, item.value);
      const pct = ((val - item.min) / (item.max - item.min)) * 100;
      return (
        <div key={idx} style={{ padding: "5px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{item.label}</span>
            <span style={{ fontSize: 10, color: "#22c55e", fontFamily: "'JetBrains Mono', monospace" }}>{item.type === "slider-int" ? Math.round(val) : val.toFixed(2)}</span>
          </div>
          <div style={{ position: "relative", height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #16a34a, #22c55e)", borderRadius: 2, transition: "width 0.05s" }} />
            <input type="range" min={item.min} max={item.max} step={item.step || (item.type === "slider-int" ? 1 : 0.01)} value={val}
              onChange={e => setVal(item.label, parseFloat(e.target.value))}
              style={{ position: "absolute", top: -6, left: 0, width: "100%", opacity: 0, cursor: "pointer", height: 16, margin: 0 }} />
          </div>
        </div>
      );
    }

    if (item.type === "combo") {
      const val = getVal(item.label, item.options[0]);
      return (
        <div key={idx} style={{ padding: "4px 0" }}>
          <div style={{ fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", marginBottom: 3 }}>{item.label}</div>
          <select value={val} onChange={e => setVal(item.label, e.target.value)} style={{
            width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            color: "#94a3b8", padding: "4px 8px", borderRadius: 4, fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace", outline: "none", cursor: "pointer",
          }}>
            {item.options.map(o => <option key={o} value={o} style={{ background: "#111113" }}>{o}</option>)}
          </select>
        </div>
      );
    }

    if (item.type === "input-text" || item.type === "input-int") {
      const val = getVal(item.label, "");
      return (
        <div key={idx} style={{ padding: "4px 0" }}>
          <div style={{ fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", marginBottom: 3 }}>{item.label}</div>
          <input type={item.type === "input-int" ? "number" : "text"} value={val} onChange={e => setVal(item.label, e.target.value)}
            placeholder={item.placeholder} style={{
              width: "100%", boxSizing: "border-box",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              color: "#e2e8f0", padding: "4px 8px", borderRadius: 4, fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace", outline: "none",
            }} />
        </div>
      );
    }

    if (item.type === "config-panel") {
      return (
        <div key={idx}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 10, maxHeight: 180, overflowY: "auto" }}>
            {configs.map(cfg => (
              <div key={cfg} onClick={() => setSelectedConfig(cfg)} style={{
                padding: "6px 10px", borderRadius: 4, cursor: "pointer",
                background: selectedConfig === cfg ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.03)",
                border: selectedConfig === cfg ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(255,255,255,0.06)",
                color: selectedConfig === cfg ? "#22c55e" : "#64748b",
                fontSize: 11, fontFamily: "'JetBrains Mono', monospace", transition: "all 0.15s",
              }}>{cfg}</div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginBottom: 10 }}>
            {["Load selected", "Save selected", "Delete selected", "Reset config", "Open config directory"].map(label => (
              <button key={label} style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                color: "#94a3b8", padding: "5px 8px", borderRadius: 4, fontSize: 10,
                cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", transition: "all 0.15s",
                gridColumn: label === "Open config directory" ? "span 2" : "auto",
              }}
                onMouseEnter={e => { e.target.style.background = "rgba(34,197,94,0.1)"; e.target.style.color = "#22c55e"; }}
                onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.04)"; e.target.style.color = "#94a3b8"; }}
              >{label}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <input value={newConfigName} onChange={e => setNewConfigName(e.target.value)}
              placeholder="config name..." style={{
                flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                color: "#e2e8f0", padding: "5px 8px", borderRadius: 4, fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace", outline: "none",
              }} />
            <button onClick={() => { if (newConfigName.trim()) { setConfigs(p => [...p, newConfigName.trim()]); setNewConfigName(""); } }} style={{
              background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
              color: "#22c55e", padding: "5px 12px", borderRadius: 4, fontSize: 11,
              cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
            }}>Create</button>
          </div>
        </div>
      );
    }

    return null;
  };

  if (!loggedIn) {
    return (
      <div style={{
        width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "#0a0a0c", position: "relative", overflow: "hidden",
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');
          * { box-sizing: border-box; }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: rgba(34,197,94,0.3); border-radius: 2px; }
          input::placeholder { color: rgba(255,255,255,0.2); }
          select option { background: #111113; }
          @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
          @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
          @keyframes gridMove { 0% { transform: translateY(0); } 100% { transform: translateY(40px); } }
          @keyframes glitch { 0%, 95%, 100% { clip-path: none; transform: none; } 96% { clip-path: polygon(0 20%, 100% 20%, 100% 30%, 0 30%); transform: translate(-2px); } 97% { clip-path: polygon(0 60%, 100% 60%, 100% 70%, 0 70%); transform: translate(2px); } 98% { clip-path: none; transform: translate(-1px); } }
        `}</style>

        {/* Grid background */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px", animation: "gridMove 3s linear infinite" }} />

        {/* Corner accents */}
        {[["0,0", "top:0;left:0", "border-top:1px solid rgba(34,197,94,0.4);border-left:1px solid rgba(34,197,94,0.4)"],
          ["100,0", "top:0;right:0", "border-top:1px solid rgba(34,197,94,0.4);border-right:1px solid rgba(34,197,94,0.4)"],
          ["0,100", "bottom:0;left:0", "border-bottom:1px solid rgba(34,197,94,0.4);border-left:1px solid rgba(34,197,94,0.4)"],
          ["100,100", "bottom:0;right:0", "border-bottom:1px solid rgba(34,197,94,0.4);border-right:1px solid rgba(34,197,94,0.4)"]
        ].map(([k, pos, border]) => (
          <div key={k} style={{ position: "absolute", width: 40, height: 40, ...Object.fromEntries(pos.split(";").map(s => s.split(":").map(x => x.trim()))), ...Object.fromEntries(border.split(";").map(s => s.split(":").map(x => x.trim()))) }} />
        ))}

        {/* Scanline */}
        <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.15), transparent)", animation: "scanline 4s linear infinite", pointerEvents: "none" }} />

        {/* Login box */}
        <div style={{
          width: 340, padding: "36px 32px",
          background: "rgba(10,10,12,0.95)",
          border: "1px solid rgba(34,197,94,0.2)",
          borderRadius: 8, position: "relative",
          boxShadow: "0 0 60px rgba(34,197,94,0.08), 0 0 120px rgba(0,0,0,0.8)",
          opacity: loginAnim ? 1 : 0,
          transform: loginAnim ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}>
          {/* Top accent line */}
          <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.6), transparent)" }} />

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 10, color: "rgba(34,197,94,0.5)", letterSpacing: 6, marginBottom: 8, textTransform: "uppercase" }}>SYSTEM ACCESS</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0", letterSpacing: 2, animation: "glitch 6s infinite" }}>
              <span style={{ color: "#22c55e" }}>TRN</span>PANEL
            </div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: 3, marginTop: 4 }}>v2.4.1 — AUTHENTICATED SESSION</div>
          </div>

          {/* Status indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, padding: "8px 12px", background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.1)", borderRadius: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 10, color: "rgba(34,197,94,0.7)", letterSpacing: 1 }}>DLL INJECTED — WAITING</span>
          </div>

          {/* Fields */}
          {[["USERNAME", username, setUsername, "text"], ["PASSWORD", password, setPassword, "password"]].map(([label, val, setter, type]) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, color: "rgba(34,197,94,0.5)", letterSpacing: 2, marginBottom: 5 }}>{label}</div>
              <input type={type} value={val} onChange={e => setter(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder={label.toLowerCase() + "..."}
                style={{
                  width: "100%", background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#e2e8f0", padding: "9px 12px", borderRadius: 4,
                  fontSize: 12, outline: "none", fontFamily: "'JetBrains Mono', monospace",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(34,197,94,0.4)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
            </div>
          ))}

          {loginError && (
            <div style={{ fontSize: 10, color: "#f87171", marginBottom: 12, padding: "6px 10px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 4 }}>
              ⚠ {loginError}
            </div>
          )}

          <button onClick={handleLogin} style={{
            width: "100%", padding: "10px", background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e",
            fontSize: 11, fontWeight: 600, letterSpacing: 3, cursor: "pointer",
            borderRadius: 4, fontFamily: "'JetBrains Mono', monospace",
            textTransform: "uppercase", transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.target.style.background = "rgba(34,197,94,0.18)"; e.target.style.boxShadow = "0 0 20px rgba(34,197,94,0.15)"; }}
            onMouseLeave={e => { e.target.style.background = "rgba(34,197,94,0.1)"; e.target.style.boxShadow = "none"; }}
          >AUTHENTICATE</button>

          <div style={{ marginTop: 16, fontSize: 9, color: "rgba(255,255,255,0.15)", textAlign: "center", letterSpacing: 1 }}>
            LOCALHOST:3000 · WS://127.0.0.1:9001
          </div>
        </div>
      </div>
    );
  }

  const healthColor = (hp) => {
    if (hp > 70) return "#22c55e";
    if (hp > 35) return "#f59e0b";
    return "#ef4444";
  };

  const pingColor = (ms) => {
    if (ms < 40) return "#22c55e";
    if (ms < 80) return "#f59e0b";
    return "#ef4444";
  };

  const renderPlayerTracker = () => {
    const ct = players.filter(p => p.team === "CT");
    const t  = players.filter(p => p.team === "T");

    const NEAR_THRESHOLD = 800;

    const TeamTable = ({ teamPlayers, label, accentColor }) => (
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${accentColor}22`,
        borderRadius: 6, overflow: "hidden", flex: 1,
        position: "relative",
      }}>
        {/* Top accent */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, ${accentColor}55, transparent)` }} />

        {/* Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "22px 1fr 88px 68px 68px 54px 50px 72px",
          gap: 0, padding: "8px 14px",
          borderBottom: `1px solid rgba(255,255,255,0.05)`,
          background: `rgba(${accentColor === "#3b82f6" ? "59,130,246" : "239,68,68"},0.06)`,
        }}>
          <div style={{ fontSize: 9, color: accentColor, fontWeight: 700, letterSpacing: 1 }}>#</div>
          <div style={{ fontSize: 9, color: accentColor, letterSpacing: 2, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 1, background: accentColor, opacity: 0.7 }} />
            {label}
          </div>
          {["WEAPON","HEALTH","ARMOR","PING","K/D","PROXIMITY"].map(h => (
            <div key={h} style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: 1, textAlign: "right" }}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        {teamPlayers.map((p, i) => {
          const isNear = p.alive && p.dist < NEAR_THRESHOLD;
          return (
          <div key={p.id} style={{
            display: "grid",
            gridTemplateColumns: "22px 1fr 88px 68px 68px 54px 50px 72px",
            gap: 0, padding: "9px 14px",
            borderBottom: "1px solid rgba(255,255,255,0.03)",
            background: isNear
              ? "rgba(239,68,68,0.04)"
              : i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
            opacity: p.alive ? 1 : 0.35,
            transition: "opacity 0.3s, background 0.5s",
            alignItems: "center",
          }}>
            {/* Index */}
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: "'JetBrains Mono', monospace" }}>{i + 1}</div>

            {/* Name + alive dot */}
            <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
              <div style={{
                width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
                background: p.alive ? accentColor : "#374151",
                boxShadow: p.alive ? `0 0 6px ${accentColor}88` : "none",
                transition: "all 0.3s",
              }} />
              <span style={{
                fontSize: 11, color: p.alive ? "#e2e8f0" : "#4b5563",
                fontFamily: "'JetBrains Mono', monospace",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>{p.name}</span>
              {!p.alive && <span style={{ fontSize: 8, color: "#ef4444", letterSpacing: 1, opacity: 0.7, marginLeft: 2 }}>DEAD</span>}
            </div>

            {/* Weapon */}
            <div style={{ textAlign: "right" }}>
              <span style={{
                fontSize: 9, color: "#64748b", fontFamily: "'JetBrains Mono', monospace",
                background: "rgba(255,255,255,0.04)", padding: "2px 6px", borderRadius: 3,
                border: "1px solid rgba(255,255,255,0.06)",
              }}>{p.weapon}</span>
            </div>

            {/* Health bar + value */}
            <div style={{ textAlign: "right" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 5 }}>
                <div style={{ width: 28, height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 2,
                    width: `${p.health}%`,
                    background: healthColor(p.health),
                    transition: "width 0.4s ease, background 0.4s ease",
                  }} />
                </div>
                <span style={{ fontSize: 11, color: healthColor(p.health), fontFamily: "'JetBrains Mono', monospace", minWidth: 24, textAlign: "right", transition: "color 0.4s" }}>{p.health}</span>
              </div>
            </div>

            {/* Armor */}
            <div style={{ textAlign: "right" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 5 }}>
                <div style={{ width: 22, height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 2,
                    width: `${p.armor}%`,
                    background: "#60a5fa",
                    transition: "width 0.4s ease",
                  }} />
                </div>
                <span style={{ fontSize: 11, color: p.armor > 0 ? "#60a5fa" : "#374151", fontFamily: "'JetBrains Mono', monospace", minWidth: 24, textAlign: "right" }}>{p.armor}</span>
              </div>
            </div>

            {/* Ping */}
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: 11, color: pingColor(p.ping), fontFamily: "'JetBrains Mono', monospace", transition: "color 0.3s" }}>{p.ping}<span style={{ fontSize: 8, color: "rgba(255,255,255,0.2)", marginLeft: 1 }}>ms</span></span>
            </div>

            {/* K/D */}
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>{p.kills}<span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>{p.deaths}</span>
            </div>

            {/* Proximity */}
            <div style={{ textAlign: "right" }}>
              {!p.alive ? (
                <span style={{ fontSize: 9, color: "#374151", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1 }}>—</span>
              ) : isNear ? (
                <span style={{
                  fontSize: 9, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                  color: "#ef4444", letterSpacing: 1,
                  textShadow: "0 0 8px rgba(239,68,68,0.7)",
                  animation: "nearPulse 1.2s ease-in-out infinite",
                }}>NEAR YOU</span>
              ) : (
                <span style={{
                  fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
                  color: "#e2e8f0", letterSpacing: 1, opacity: 0.6,
                }}>FAR</span>
              )}
            </div>
          </div>
          );
        })}
      </div>
    );

    const ctAlive = ct.filter(p => p.alive).length;
    const tAlive  = t.filter(p => p.alive).length;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14, height: "100%" }}>
        {/* Score bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 16px",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 6, position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, rgba(59,130,246,0.4), transparent 50%, rgba(239,68,68,0.4))" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: 1, background: "#3b82f6" }} />
            <span style={{ fontSize: 11, color: "#3b82f6", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1 }}>CT</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace" }}>5</span>
            <span style={{ fontSize: 9, color: "#60a5fa", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", padding: "2px 6px", borderRadius: 3 }}>{ctAlive} ALIVE</span>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: 2, marginBottom: 2 }}>ROUND</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>12 / 30</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexDirection: "row-reverse" }}>
            <div style={{ width: 8, height: 8, borderRadius: 1, background: "#ef4444" }} />
            <span style={{ fontSize: 11, color: "#ef4444", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1 }}>T</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace" }}>7</span>
            <span style={{ fontSize: 9, color: "#f87171", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", padding: "2px 6px", borderRadius: 3 }}>{tAlive} ALIVE</span>
          </div>
        </div>

        {/* Tables */}
        <div style={{ display: "flex", gap: 12, flex: 1, minHeight: 0 }}>
          <TeamTable teamPlayers={ct} label="Counter-Terrorists" accentColor="#3b82f6" />
          <TeamTable teamPlayers={t}  label="Terrorists" accentColor="#ef4444" />
        </div>

        {/* Footer note */}
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.12)", textAlign: "center", letterSpacing: 1, paddingBottom: 4 }}>
          LIVE DATA — SIMULATED · WIRE TO WS://127.0.0.1:9001 FOR REAL FEED
        </div>
      </div>
    );
  };

  const sections = menuData[activeTab]?.sections || [];

  return (
    <div style={{
      width: "100vw", height: "100vh", background: "#0a0a0c", display: "flex", flexDirection: "column",
      fontFamily: "'JetBrains Mono', monospace", overflow: "hidden", position: "relative",
      opacity: panelAnim ? 1 : 0, transition: "opacity 0.4s ease",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(34,197,94,0.25); border-radius: 2px; }
        input::placeholder { color: rgba(255,255,255,0.15); }
        select option { background: #111113; }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes nearPulse { 0%, 100% { opacity: 1; text-shadow: 0 0 8px rgba(239,68,68,0.7); } 50% { opacity: 0.55; text-shadow: 0 0 2px rgba(239,68,68,0.2); } }
      `}</style>

      {/* Subtle grid */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(34,197,94,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.015) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 }} />

      {/* Top bar */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", height: 42, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,10,12,0.98)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 2, color: "#e2e8f0" }}>
            <span style={{ color: "#22c55e" }}>TRN</span>PANEL
          </div>
          <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.1)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 9, color: "rgba(34,197,94,0.6)", letterSpacing: 1 }}>CONNECTED</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: 1 }}>WS:9001 · LOCAL:3000</span>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>USER: <span style={{ color: "rgba(34,197,94,0.5)" }}>{username.toUpperCase()}</span></span>
          <button onClick={() => setLoggedIn(false)} style={{
            background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
            color: "#f87171", fontSize: 9, padding: "3px 10px", borderRadius: 3,
            cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1,
          }}>DISCONNECT</button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,10,12,0.95)", flexShrink: 0, paddingLeft: 8 }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            background: "none", border: "none",
            borderBottom: activeTab === tab ? "1px solid #22c55e" : "1px solid transparent",
            color: activeTab === tab ? "#22c55e" : "#4b5563",
            padding: "10px 14px", fontSize: 10, letterSpacing: 1.5,
            cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
            textTransform: "uppercase", transition: "all 0.15s",
            marginBottom: -1,
          }}
            onMouseEnter={e => { if (activeTab !== tab) { e.target.style.color = "#94a3b8"; } }}
            onMouseLeave={e => { if (activeTab !== tab) { e.target.style.color = "#4b5563"; } }}
          >{tab}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: 16, position: "relative", zIndex: 5 }}>
        {activeTab === "Players" ? renderPlayerTracker() : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
          {sections.map((section, si) => (
            <div key={si} style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 6, padding: "14px 14px 10px",
              position: "relative", overflow: "hidden",
            }}>
              {/* Section top accent */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, rgba(34,197,94,0.3), transparent)" }} />

              <div style={{ fontSize: 9, color: "rgba(34,197,94,0.5)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 12, height: 1, background: "rgba(34,197,94,0.4)" }} />
                {section.title}
              </div>

              <div>
                {section.items.map((item, ii) => renderItem(item, ii))}
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Status bar */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 26, borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(8,8,10,0.98)", flexShrink: 0 }}>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.15)", letterSpacing: 1 }}>TRNPANEL v2.4.1 — {activeTab.toUpperCase()}</span>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.15)", letterSpacing: 1 }}>{new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
