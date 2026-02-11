/**
 * Registration and landing page for loot.xyz
 * ✨ 2000s Internet Aesthetic ✨
 */

import { db } from '#/db/query.js';
import bcrypt from 'bcrypt';
import World from '#/engine/World.js';

const SERVER_NAME = 'loot.xyz';
const GITHUB_URL = 'https://github.com/99-cooking/rs-sdk';

// 2000s AESTHETIC CSS 
const SITE_STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=VT323&family=Press+Start+2P&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
        font-family: 'Comic Neue', 'Comic Sans MS', cursive;
        background: #000033 url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="10" cy="10" r="1" fill="white" opacity="0.5"/><circle cx="50" cy="30" r="0.5" fill="white" opacity="0.7"/><circle cx="80" cy="70" r="1" fill="white" opacity="0.4"/><circle cx="30" cy="80" r="0.5" fill="white" opacity="0.6"/><circle cx="70" cy="20" r="1" fill="white" opacity="0.5"/><circle cx="90" cy="90" r="0.5" fill="white"/></svg>');
        min-height: 100vh;
        color: #00ff00;
    }
    
    /* Scrolling stars background */
    body::before {
        content: '';
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: transparent url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><circle cx="20" cy="40" r="1" fill="%23ffff00" opacity="0.8"/><circle cx="100" cy="80" r="1.5" fill="white" opacity="0.6"/><circle cx="160" cy="120" r="1" fill="%2300ffff" opacity="0.7"/><circle cx="60" cy="180" r="0.5" fill="white" opacity="0.9"/></svg>');
        animation: twinkle 4s infinite;
        pointer-events: none;
        z-index: -1;
    }
    
    @keyframes twinkle {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    
    @keyframes rainbow {
        0% { color: #ff0000; }
        16% { color: #ff8800; }
        33% { color: #ffff00; }
        50% { color: #00ff00; }
        66% { color: #0088ff; }
        83% { color: #8800ff; }
        100% { color: #ff0000; }
    }
    
    @keyframes blink {
        0%, 49% { opacity: 1; }
        50%, 100% { opacity: 0; }
    }
    
    @keyframes marquee {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
    }
    
    @keyframes fire {
        0% { text-shadow: 0 0 4px #ff0000, 0 -5px 4px #ff6600, 0 -10px 6px #ff9900; }
        50% { text-shadow: 0 0 4px #ff3300, 0 -8px 4px #ff6600, 0 -15px 6px #ffcc00; }
        100% { text-shadow: 0 0 4px #ff0000, 0 -5px 4px #ff6600, 0 -10px 6px #ff9900; }
    }
    
    @keyframes glow {
        0%, 100% { text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00; }
        50% { text-shadow: 0 0 20px #00ff00, 0 0 40px #00ff00, 0 0 60px #00ff00; }
    }
    
    .container { 
        max-width: 800px; 
        margin: 0 auto; 
        padding: 10px;
    }
    
    /* HEADER */
    header {
        text-align: center;
        padding: 20px;
        border: 3px ridge #ffff00;
        background: linear-gradient(180deg, #000066 0%, #000033 50%, #330066 100%);
        margin: 10px;
    }
    
    header h1 {
        font-family: 'Press Start 2P', monospace;
        font-size: 2.5em;
        animation: rainbow 3s linear infinite, fire 0.5s ease-in-out infinite;
        margin-bottom: 10px;
        letter-spacing: 2px;
    }
    
    header p { 
        color: #00ffff; 
        font-size: 1.1em;
        text-shadow: 2px 2px #000;
    }
    
    /* MARQUEE */
    .marquee-container {
        overflow: hidden;
        background: #ff0000;
        padding: 5px 0;
        border: 2px solid #ffff00;
        margin: 10px;
    }
    
    .marquee-text {
        display: inline-block;
        white-space: nowrap;
        animation: marquee 15s linear infinite;
        color: #ffff00;
        font-weight: bold;
        font-size: 1.1em;
    }
    
    .marquee-text span {
        margin: 0 50px;
    }
    
    /* NAVIGATION */
    .nav {
        display: flex;
        justify-content: center;
        gap: 5px;
        margin: 10px;
        flex-wrap: wrap;
    }
    
    .nav a {
        color: #ffff00;
        text-decoration: none;
        padding: 8px 15px;
        background: linear-gradient(180deg, #333399 0%, #000066 100%);
        border: 2px outset #6666ff;
        font-weight: bold;
        font-family: 'VT323', monospace;
        font-size: 1.2em;
    }
    
    .nav a:hover {
        background: linear-gradient(180deg, #6666cc 0%, #333399 100%);
        border-style: inset;
        color: #ffffff;
    }
    
    /* BUTTONS */
    .btn {
        display: inline-block;
        padding: 15px 30px;
        background: linear-gradient(180deg, #00cc00 0%, #006600 50%, #009900 100%);
        color: #ffffff;
        text-decoration: none;
        border: 3px outset #00ff00;
        font-size: 1.3em;
        font-weight: bold;
        font-family: 'Comic Neue', cursive;
        cursor: pointer;
        text-shadow: 2px 2px #003300;
    }
    
    .btn:hover {
        border-style: inset;
        background: linear-gradient(180deg, #009900 0%, #003300 50%, #006600 100%);
    }
    
    .btn-play {
        font-size: 1.8em;
        padding: 20px 50px;
        animation: glow 1.5s ease-in-out infinite;
        background: linear-gradient(180deg, #ff6600 0%, #cc3300 50%, #ff3300 100%);
        border-color: #ff9900;
    }
    
    /* CARDS / BOXES */
    .card {
        background: linear-gradient(180deg, #000066 0%, #000033 100%);
        border: 3px ridge #00ffff;
        padding: 20px;
        margin: 15px 10px;
    }
    
    .card h2 { 
        color: #ff00ff;
        font-family: 'VT323', monospace;
        font-size: 1.8em;
        margin-bottom: 15px;
        text-shadow: 2px 2px #000;
        border-bottom: 2px dashed #ff00ff;
        padding-bottom: 10px;
    }
    
    .card p { 
        line-height: 1.8; 
        margin-bottom: 12px;
        color: #00ff00;
    }
    
    /* STATS */
    .stats {
        display: flex;
        justify-content: center;
        gap: 30px;
        margin: 20px 10px;
        flex-wrap: wrap;
    }
    
    .stat {
        text-align: center;
        background: #000;
        border: 3px inset #00ff00;
        padding: 15px 25px;
    }
    
    .stat-value {
        font-family: 'VT323', monospace;
        font-size: 3em;
        color: #ffff00;
        text-shadow: 0 0 10px #ffff00;
    }
    
    .stat-label {
        color: #00ffff;
        font-size: 0.9em;
        text-transform: uppercase;
    }
    
    /* FEATURES */
    .features {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        margin: 20px 10px;
    }
    
    @media (max-width: 600px) {
        .features { grid-template-columns: 1fr; }
    }
    
    .feature {
        background: #000;
        border: 2px solid #ff00ff;
        padding: 15px;
        text-align: center;
    }
    
    .feature h3 {
        color: #ffff00;
        margin-bottom: 8px;
        font-family: 'VT323', monospace;
        font-size: 1.4em;
    }
    
    .feature p { color: #00ff00; font-size: 0.95em; }
    
    /* FORMS */
    form { max-width: 350px; margin: 0 auto; }
    
    .form-group { margin-bottom: 15px; }
    
    label {
        display: block;
        margin-bottom: 5px;
        color: #ffff00;
        font-weight: bold;
        font-family: 'VT323', monospace;
        font-size: 1.2em;
    }
    
    input[type="text"], input[type="password"] {
        width: 100%;
        padding: 10px;
        border: 2px inset #00ff00;
        background: #001a00;
        color: #00ff00;
        font-family: 'VT323', monospace;
        font-size: 1.2em;
    }
    
    input:focus {
        outline: none;
        border-color: #ffff00;
        box-shadow: 0 0 10px #00ff00;
    }
    
    .error { 
        color: #ff0000; 
        margin-bottom: 15px; 
        text-align: center;
        animation: blink 1s infinite;
        font-weight: bold;
    }
    
    .success { 
        color: #00ff00; 
        margin-bottom: 15px; 
        text-align: center;
        text-shadow: 0 0 10px #00ff00;
        font-weight: bold;
    }
    
    /* FOOTER */
    footer {
        text-align: center;
        padding: 20px;
        margin: 20px 10px;
        border-top: 2px dashed #00ffff;
        color: #888;
        font-size: 0.9em;
    }
    
    footer a { color: #00ffff; }
    
    .badges {
        display: flex;
        justify-content: center;
        gap: 15px;
        flex-wrap: wrap;
        margin: 15px 0;
    }
    
    .badge {
        background: #000;
        border: 2px ridge #666;
        padding: 5px 10px;
        font-family: 'VT323', monospace;
        font-size: 0.8em;
        color: #888;
    }
    
    .counter {
        font-family: 'VT323', monospace;
        background: #000;
        color: #00ff00;
        padding: 3px 8px;
        border: 2px inset #333;
        display: inline-block;
    }
    
    pre {
        background: #000;
        padding: 15px;
        border: 2px inset #00ff00;
        overflow-x: auto;
        font-family: 'VT323', monospace;
        color: #00ff00;
        font-size: 1.1em;
    }
    
    a { color: #00ffff; }
    a:hover { color: #ff00ff; }
    
    /* SEPARATOR */
    .separator {
        height: 10px;
        background: repeating-linear-gradient(90deg, #ff0000, #ff0000 10px, #ffff00 10px, #ffff00 20px, #00ff00 20px, #00ff00 30px, #00ffff 30px, #00ffff 40px, #0000ff 40px, #0000ff 50px, #ff00ff 50px, #ff00ff 60px);
        margin: 15px 10px;
    }
    
    /* CONSTRUCTION */
    .construction {
        text-align: center;
        color: #ffff00;
        font-weight: bold;
        animation: blink 0.8s infinite;
    }
    
    /* WEBRING */
    .webring {
        text-align: center;
        margin: 10px;
        padding: 10px;
        background: #111;
        border: 1px solid #444;
    }
    
    .webring span { margin: 0 15px; }
`;

function layout(title: string, content: string): string {
    const visitorCount = Math.floor(Math.random() * 9000) + 1000 + Date.now() % 10000;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>~*~ ${title} ~*~ ${SERVER_NAME} ~*~ Welcome 2 My Site ~*~</title>
    <style>${SITE_STYLES}</style>
</head>
<body>
    <div class="marquee-container">
        <div class="marquee-text">
            <span>★ WELCOME TO LOOT.XYZ ★</span>
            <span>🎮 FREE RUNESCAPE 2004 SERVER 🎮</span>
            <span>💎 25x XP RATES 💎</span>
            <span>🤖 BOT FRIENDLY 🤖</span>
            <span>⚔️ ALL MEMBERS CONTENT FREE ⚔️</span>
            <span>★ SIGN UP TODAY ★</span>
        </div>
    </div>
    
    <header>
        <h1>✧ LOOT.XYZ ✧</h1>
        <p>~ Your #1 Source for RuneScape 2004 Nostalgia ~</p>
        <p style="font-size: 0.8em; color: #ff00ff;">Est. 2026 | Gielinor's Finest</p>
    </header>
    
    <nav class="nav">
        <a href="/">⌂ HOME</a>
        <a href="/register">📝 REGISTER</a>
        <a href="/hiscores">🏆 HISCORES</a>
        <a href="/rs2.cgi">▶ PLAY NOW</a>
    </nav>
    
    <div class="separator"></div>
    
    <div class="container">
        ${content}
    </div>
    
    <div class="separator"></div>
    
    <footer>
        <div class="badges">
            <span class="badge">BEST VIEWED IN 800x600</span>
            <span class="badge">NETSCAPE NAVIGATOR</span>
            <span class="badge">MADE WITH NOTEPAD</span>
        </div>
        <p>
            Powered by <a href="https://github.com/LostCityRS/Server">LostCity</a> | 
            SDK: <a href="https://github.com/99-cooking/rs-sdk">rs-sdk</a> |
            Hosted by <a href="https://github.com/99-cooking">99 Cooking</a> 🦞
        </p>
        <p style="margin-top: 10px;">
            You are visitor #<span class="counter">${visitorCount.toString().padStart(6, '0')}</span>
        </p>
        <p style="margin-top: 10px; color: #666; font-size: 0.8em;">
            © 2026 loot.xyz | This is a fan project. Not affiliated with Jagex Ltd.
        </p>
        <div class="webring">
            <span>← PREV</span>
            <span>[ RSPS WEBRING ]</span>
            <span>NEXT →</span>
        </div>
    </footer>
</body>
</html>`;
}

async function getStats(): Promise<{ players: number; accounts: number }> {
    try {
        const result = await db.selectFrom('account')
            .select(eb => eb.fn.countAll().as('count'))
            .executeTakeFirst();
        return {
            players: World.getTotalPlayers(),
            accounts: Number(result?.count || 0)
        };
    } catch (e) {
        return { players: 0, accounts: 0 };
    }
}

export async function handleHomePage(url: URL): Promise<Response | null> {
    if (url.pathname !== '/' && url.pathname !== '/home' && url.pathname !== '/home/') {
        return null;
    }
    
    const stats = await getStats();
    
    const content = `
    <div style="text-align: center; margin-bottom: 30px;">
        <a href="/rs2.cgi" class="btn btn-play">► ENTER GAME ◄</a>
        <p style="margin-top: 10px; color: #ffff00;">~ Click to Start Your Adventure ~</p>
    </div>
    
    <div class="stats">
        <div class="stat">
            <div class="stat-value">${stats.players}</div>
            <div class="stat-label">⚔️ Online Now</div>
        </div>
        <div class="stat">
            <div class="stat-value">${stats.accounts}</div>
            <div class="stat-label">📜 Adventurers</div>
        </div>
    </div>
    
    <div class="card">
        <h2>★ WELCOME TO LOOT.XYZ ★</h2>
        <p>Greetings, traveler! You have discovered <b style="color: #ffff00;">loot.xyz</b> - a RuneScape 2004 private server where legends are born and lobsters are cooked! 🦞</p>
        <p style="color: #ff00ff; font-style: italic;">Experience the golden age of RuneScape, before the Grand Exchange, before HD graphics, when the Wilderness was WILD!</p>
    </div>
    
    <div class="features">
        <div class="feature">
            <h3>⚡ 25x XP RATE ⚡</h3>
            <p>Level up faster! Perfect for training experiments.</p>
        </div>
        <div class="feature">
            <h3>🤖 BOT FRIENDLY</h3>
            <p>Full SDK support. Train your AI agents!</p>
        </div>
        <div class="feature">
            <h3>🎮 AUTHENTIC 2004</h3>
            <p>The REAL RuneScape experience. Nostalgia overload!</p>
        </div>
        <div class="feature">
            <h3>💎 FREE MEMBERS</h3>
            <p>All P2P areas & skills unlocked for everyone!</p>
        </div>
    </div>
    
    <div class="card">
        <h2>📖 HOW TO PLAY</h2>
        <p>➊ <a href="/register">Create an account</a> (or register in-game)</p>
        <p>➋ <a href="/rs2.cgi">Launch the web client</a></p>
        <p>➌ Enter your credentials</p>
        <p>➍ Begin your quest for glory!</p>
        <p style="margin-top: 15px; text-align: center;">
            <a href="/rs2.cgi" class="btn">▶ PLAY NOW</a>
        </p>
    </div>
    
    <div class="card">
        <h2>🤖 FOR BOT DEVELOPERS</h2>
        <p>Clone our SDK and automate your grind:</p>
        <pre>git clone ${GITHUB_URL}.git
cd rs-sdk && bun install
bun scripts/create-bot.ts mybot
bun bots/mybot/script.ts</pre>
        <p style="margin-top: 15px; text-align: center;">
            <a href="${GITHUB_URL}">📚 View Documentation →</a>
        </p>
    </div>
    
    <div class="card" style="text-align: center;">
        <h2>💬 GUESTBOOK</h2>
        <p class="construction">🚧 UNDER CONSTRUCTION 🚧</p>
        <p style="color: #888; font-size: 0.9em;">Sign our guestbook coming soon!</p>
    </div>
    `;
    
    return new Response(layout('Home', content), {
        headers: { 'Content-Type': 'text/html' }
    });
}

export async function handleRegisterPage(req: Request, url: URL): Promise<Response | null> {
    if (url.pathname !== '/register' && url.pathname !== '/register/') {
        return null;
    }
    
    let error = '';
    let success = '';
    
    if (req.method === 'POST') {
        try {
            const formData = await req.formData();
            const username = formData.get('username')?.toString()?.trim() || '';
            const password = formData.get('password')?.toString() || '';
            const confirm = formData.get('confirm')?.toString() || '';
            
            // Validation
            if (!username || username.length < 1 || username.length > 12) {
                error = 'Username must be 1-12 characters';
            } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
                error = 'Username can only contain letters, numbers, and underscores';
            } else if (!password || password.length < 4) {
                error = 'Password must be at least 4 characters';
            } else if (password !== confirm) {
                error = 'Passwords do not match';
            } else {
                // Check if username exists
                const existing = await db.selectFrom('account')
                    .select('id')
                    .where('username', '=', username.toLowerCase())
                    .executeTakeFirst();
                
                if (existing) {
                    error = 'Username already taken';
                } else {
                    // Create account
                    const hashedPassword = await bcrypt.hash(password, 10);
                    await db.insertInto('account')
                        .values({
                            username: username.toLowerCase(),
                            password: hashedPassword
                        })
                        .execute();
                    success = `Account "${username}" created! You may now enter the realm!`;
                }
            }
        } catch (e: any) {
            console.error('Registration error:', e);
            if (e?.message?.includes('UNIQUE')) {
                error = 'Username already taken';
            } else {
                error = 'Registration failed. Please try again.';
            }
        }
    }
    
    const content = `
    <div class="card" style="max-width: 450px; margin: 0 auto;">
        <h2>📜 CREATE THY ACCOUNT</h2>
        ${error ? `<p class="error">⚠️ ${error}</p>` : ''}
        ${success ? `<p class="success">✓ ${success}</p>` : ''}
        
        <form method="POST" action="/register">
            <div class="form-group">
                <label for="username">CHARACTER NAME:</label>
                <input type="text" id="username" name="username" required 
                       minlength="1" maxlength="12" pattern="[a-zA-Z0-9_]+"
                       placeholder="Enter thy name..." autocomplete="username">
            </div>
            <div class="form-group">
                <label for="password">SECRET PASSWORD:</label>
                <input type="password" id="password" name="password" required
                       minlength="4" placeholder="Shh... keep it secret" autocomplete="new-password">
            </div>
            <div class="form-group">
                <label for="confirm">CONFIRM PASSWORD:</label>
                <input type="password" id="confirm" name="confirm" required
                       placeholder="Type it again!" autocomplete="new-password">
            </div>
            <div style="text-align: center;">
                <button type="submit" class="btn">⚔️ CREATE ACCOUNT ⚔️</button>
            </div>
        </form>
        
        <p style="text-align: center; margin-top: 20px; color: #888;">
            Already a member? <a href="/rs2.cgi">Enter the Realm →</a>
        </p>
    </div>
    
    <div class="card" style="max-width: 450px; margin: 20px auto; text-align: center;">
        <p style="color: #ffff00;">💡 PRO TIP</p>
        <p style="font-size: 0.9em;">You can also create an account by typing any new username when logging into the game client!</p>
    </div>
    `;
    
    return new Response(layout('Register', content), {
        headers: { 'Content-Type': 'text/html' }
    });
}
