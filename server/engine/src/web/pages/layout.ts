/**
 * Shared site layout for loot.xyz
 * Dark blue/gold gradient design
 */

export const SERVER_NAME = 'loot.xyz';
export const GITHUB_URL = 'https://github.com/99-cooking/rs-sdk';

export function layout(title: string, content: string, activePage: string = ''): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - 99 Cooking RS</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            min-height: 100vh;
            color: #fff;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        header {
            text-align: center;
            padding: 40px 20px;
            background: rgba(0,0,0,0.3);
            margin-bottom: 0;
        }
        header h1 {
            font-size: 3em;
            color: #ffd700;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            margin-bottom: 10px;
        }
        header p { color: #ccc; font-size: 1.2em; }
        .btn {
            display: inline-block;
            padding: 15px 40px;
            background: linear-gradient(180deg, #4a9eff 0%, #0066cc 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-size: 1.2em;
            font-weight: bold;
            border: none;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(74, 158, 255, 0.4);
        }
        .btn-play {
            background: linear-gradient(180deg, #4aff4a 0%, #00cc00 100%);
            font-size: 1.5em;
            padding: 20px 60px;
        }
        .card {
            background: rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
            backdrop-filter: blur(10px);
        }
        .card h2 { color: #ffd700; margin-bottom: 20px; }
        .card p { line-height: 1.6; margin-bottom: 15px; }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 40px 0;
        }
        .feature {
            background: rgba(255,255,255,0.05);
            padding: 25px;
            border-radius: 10px;
            text-align: center;
        }
        .feature h3 { color: #4aff4a; margin-bottom: 10px; }
        form { max-width: 400px; margin: 0 auto; }
        .form-group { margin-bottom: 20px; }
        label {
            display: block;
            margin-bottom: 8px;
            color: #ffd700;
            font-weight: bold;
        }
        input[type="text"], input[type="password"] {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid rgba(255,255,255,0.2);
            border-radius: 6px;
            background: rgba(0,0,0,0.3);
            color: white;
            font-size: 1em;
        }
        input:focus {
            outline: none;
            border-color: #4a9eff;
        }
        .error { color: #ff4a4a; margin-bottom: 15px; }
        .success { color: #4aff4a; margin-bottom: 15px; }
        .nav {
            display: flex;
            justify-content: center;
            gap: 0;
            background: rgba(0,0,0,0.2);
            border-bottom: 2px solid rgba(255,215,0,0.2);
        }
        .nav a {
            color: #ccc;
            text-decoration: none;
            padding: 15px 25px;
            transition: background 0.2s, color 0.2s;
            font-weight: 500;
        }
        .nav a:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .nav a.active { color: #ffd700; background: rgba(255,215,0,0.1); border-bottom: 2px solid #ffd700; }
        .stats {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin: 30px 0;
        }
        .stat { text-align: center; }
        .stat-value { font-size: 2.5em; color: #ffd700; font-weight: bold; }
        .stat-label { color: #999; }
        footer {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        footer a { color: #4a9eff; }
        pre {
            background: #000;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            color: #4aff4a;
        }
        a { color: #4a9eff; }
    </style>
</head>
<body>
    <header>
        <h1>loot.xyz</h1>
        <p>A RuneScape 2004 Private Server</p>
    </header>
    <nav class="nav">
        <a href="/"${activePage === 'home' ? ' class="active"' : ''}>Home</a>
        <a href="/register"${activePage === 'register' ? ' class="active"' : ''}>Register</a>
        <a href="/hiscores"${activePage === 'hiscores' ? ' class="active"' : ''}>Hiscores</a>
        <a href="/play"${activePage === 'play' ? ' class="active"' : ''}>Play</a>
    </nav>
    <div class="container">
        ${content}
    </div>
    <footer>
        <p>Powered by <a href="https://github.com/LostCityRS/Server">LostCity</a> | 
           SDK by <a href="${GITHUB_URL}">rs-sdk</a> |
           Hosted by <a href="https://github.com/99-cooking">99 Cooking</a></p>
        <p style="margin-top: 12px; font-size: 0.75em; color: #555;">This is a fan-made project and is not affiliated with or endorsed by Jagex Ltd. RuneScape is a registered trademark of Jagex Ltd.</p>
    </footer>
</body>
</html>`;
}
