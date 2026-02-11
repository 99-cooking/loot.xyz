/**
 * Shared site layout for loot.xyz
 * Inspired by the RuneScape website circa 2006-2007
 * Stone/parchment textures, gold accents, gothic medieval feel
 */

export const GITHUB_URL = 'https://github.com/99-cooking/rs-sdk';

export function rsLayout(title: string, content: string, activePage: string = ''): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - loot.xyz</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cinzel+Decorative:wght@400;700;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 13px;
            background: #1a0e05;
            background-image:
                radial-gradient(ellipse at 50% 0%, rgba(60,30,10,0.5) 0%, transparent 70%);
            min-height: 100vh;
            color: #d4c4a0;
        }

        /* ===== TOP BANNER ===== */
        .rs-banner {
            background: linear-gradient(180deg, #2a1a0a 0%, #1a0e05 50%, #0d0704 100%);
            border-bottom: 3px solid #5c3a1e;
            text-align: center;
            padding: 20px 0 0 0;
            position: relative;
        }
        .rs-banner::after {
            content: '';
            display: block;
            height: 4px;
            background: linear-gradient(90deg, transparent 0%, #c8a84e 30%, #ffd760 50%, #c8a84e 70%, transparent 100%);
        }
        .rs-banner h1 {
            font-family: 'Cinzel Decorative', 'Cinzel', Georgia, serif;
            font-size: 2.8em;
            font-weight: 900;
            color: #ffd760;
            text-shadow:
                0 0 10px rgba(255,180,0,0.3),
                2px 2px 0 #2a1500,
                -1px -1px 0 #2a1500;
            margin-bottom: 2px;
            letter-spacing: 3px;
        }
        .rs-banner p {
            color: #a09070;
            font-size: 1em;
            font-family: 'Cinzel', Georgia, serif;
            letter-spacing: 2px;
            margin-bottom: 15px;
        }

        /* ===== NAVIGATION BAR ===== */
        .rs-nav {
            background: linear-gradient(180deg, #4a3520 0%, #3a2815 40%, #2a1a0a 100%);
            border-bottom: 2px solid #5c3a1e;
            border-top: 1px solid #6b4a2a;
            padding: 0;
            text-align: center;
        }
        .rs-nav-inner {
            display: inline-flex;
            gap: 0;
        }
        .rs-nav a {
            display: inline-block;
            color: #d4c4a0;
            text-decoration: none;
            padding: 10px 22px;
            font-family: 'Cinzel', Georgia, serif;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            transition: all 0.15s;
            border-left: 1px solid rgba(92,58,30,0.4);
            border-right: 1px solid rgba(92,58,30,0.4);
            position: relative;
        }
        .rs-nav a:first-child { border-left: none; }
        .rs-nav a:last-child { border-right: none; }
        .rs-nav a:hover {
            color: #ffd760;
            background: rgba(255,215,96,0.08);
            text-shadow: 0 0 8px rgba(255,180,0,0.3);
        }
        .rs-nav a.active {
            color: #ffd760;
            background: rgba(255,215,96,0.12);
            border-bottom: 2px solid #ffd760;
        }

        /* ===== MAIN CONTENT WRAPPER ===== */
        .rs-page {
            max-width: 900px;
            margin: 25px auto;
            padding: 0 15px;
        }

        /* ===== PARCHMENT PANEL ===== */
        .rs-panel {
            background: linear-gradient(180deg, #3a2815 0%, #2d1e10 100%);
            border: 2px solid #5c3a1e;
            border-radius: 4px;
            margin-bottom: 20px;
            position: relative;
            box-shadow:
                inset 0 1px 0 rgba(255,215,96,0.05),
                0 4px 12px rgba(0,0,0,0.5);
        }
        .rs-panel::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            border: 1px solid rgba(255,215,96,0.06);
            border-radius: 3px;
            pointer-events: none;
        }

        /* ===== PANEL HEADER ===== */
        .rs-panel-header {
            background: linear-gradient(180deg, #4a3520 0%, #3a2815 100%);
            border-bottom: 2px solid #5c3a1e;
            padding: 12px 20px;
            position: relative;
        }
        .rs-panel-header::after {
            content: '';
            display: block;
            position: absolute;
            bottom: -1px;
            left: 10%;
            right: 10%;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255,215,96,0.15), transparent);
        }
        .rs-panel-header h2 {
            font-family: 'Cinzel', Georgia, serif;
            color: #ffd760;
            font-size: 1.3em;
            font-weight: 700;
            text-shadow: 1px 1px 0 rgba(0,0,0,0.5);
            letter-spacing: 1px;
        }

        /* ===== PANEL BODY ===== */
        .rs-panel-body {
            padding: 20px;
        }
        .rs-panel-body p {
            line-height: 1.7;
            margin-bottom: 10px;
            color: #c4b490;
        }

        /* ===== STATS ROW ===== */
        .rs-stats {
            display: flex;
            justify-content: center;
            gap: 50px;
            margin: 25px 0;
        }
        .rs-stat { text-align: center; }
        .rs-stat-value {
            font-family: 'Cinzel', Georgia, serif;
            font-size: 2.5em;
            font-weight: 900;
            color: #ffd760;
            text-shadow: 0 0 10px rgba(255,180,0,0.2);
        }
        .rs-stat-label {
            color: #a09070;
            font-size: 0.9em;
            margin-top: 4px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        /* ===== FEATURE GRID ===== */
        .rs-features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .rs-feature {
            background: rgba(0,0,0,0.25);
            border: 1px solid #5c3a1e;
            border-radius: 3px;
            padding: 18px;
            text-align: center;
        }
        .rs-feature h3 {
            font-family: 'Cinzel', Georgia, serif;
            color: #7ecc3e;
            font-size: 1em;
            margin-bottom: 8px;
        }
        .rs-feature p {
            color: #b0a080;
            font-size: 12px;
            line-height: 1.5;
        }

        /* ===== BUTTONS ===== */
        .rs-btn {
            display: inline-block;
            padding: 12px 35px;
            background: linear-gradient(180deg, #5c8a2f 0%, #3d6b15 50%, #2d5510 100%);
            color: #fff;
            text-decoration: none;
            font-family: 'Cinzel', Georgia, serif;
            font-size: 1em;
            font-weight: 700;
            letter-spacing: 1px;
            border: 2px solid #7ecc3e;
            border-radius: 3px;
            cursor: pointer;
            transition: all 0.15s;
            text-shadow: 1px 1px 0 rgba(0,0,0,0.5);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        .rs-btn:hover {
            background: linear-gradient(180deg, #6e9e3a 0%, #4a7e1e 50%, #3a6818 100%);
            box-shadow: 0 2px 12px rgba(126,204,62,0.3);
        }
        .rs-btn-play {
            font-size: 1.3em;
            padding: 16px 55px;
        }
        .rs-btn-gold {
            background: linear-gradient(180deg, #c8a84e 0%, #a08030 50%, #806020 100%);
            border-color: #ffd760;
        }
        .rs-btn-gold:hover {
            background: linear-gradient(180deg, #d8b85e 0%, #b09040 50%, #907030 100%);
            box-shadow: 0 2px 12px rgba(255,215,96,0.3);
        }

        /* ===== FORMS ===== */
        .rs-form { max-width: 400px; margin: 0 auto; }
        .rs-form-group { margin-bottom: 18px; }
        .rs-form-group label {
            display: block;
            margin-bottom: 6px;
            color: #ffd760;
            font-family: 'Cinzel', Georgia, serif;
            font-weight: 700;
            font-size: 12px;
            letter-spacing: 1px;
        }
        .rs-form-group input[type="text"],
        .rs-form-group input[type="password"] {
            width: 100%;
            padding: 10px 12px;
            border: 2px solid #5c3a1e;
            border-radius: 3px;
            background: rgba(0,0,0,0.4);
            color: #d4c4a0;
            font-size: 1em;
            font-family: Arial, Helvetica, sans-serif;
        }
        .rs-form-group input:focus {
            outline: none;
            border-color: #c8a84e;
            box-shadow: 0 0 6px rgba(200,168,78,0.3);
        }

        /* ===== LINKS ===== */
        a { color: #6db8d4; text-decoration: none; }
        a:hover { color: #8dd8f4; text-decoration: underline; }

        /* ===== CODE BLOCK ===== */
        pre {
            background: #0d0704;
            padding: 15px;
            border-radius: 3px;
            border: 1px solid #5c3a1e;
            overflow-x: auto;
            color: #7ecc3e;
            font-size: 12px;
        }

        /* ===== MESSAGES ===== */
        .rs-error {
            color: #ff4444;
            background: rgba(255,0,0,0.08);
            border: 1px solid rgba(255,0,0,0.2);
            padding: 10px 15px;
            border-radius: 3px;
            margin-bottom: 15px;
        }
        .rs-success {
            color: #7ecc3e;
            background: rgba(0,255,0,0.06);
            border: 1px solid rgba(126,204,62,0.2);
            padding: 10px 15px;
            border-radius: 3px;
            margin-bottom: 15px;
        }

        /* ===== FOOTER ===== */
        .rs-footer {
            text-align: center;
            padding: 25px 20px;
            color: #5a4a30;
            font-size: 11px;
            border-top: 1px solid #2d1e10;
            margin-top: 10px;
        }
        .rs-footer a { color: #8a7a50; }
        .rs-footer a:hover { color: #c8a84e; }

        /* ===== GOLD DIVIDER ===== */
        .rs-divider {
            height: 2px;
            background: linear-gradient(90deg, transparent, #5c3a1e, transparent);
            margin: 20px 0;
        }

        /* ===== HISCORES-SPECIFIC ===== */
        .hs-layout {
            display: flex;
            gap: 15px;
        }
        .hs-sidebar {
            width: 170px;
            flex-shrink: 0;
        }
        .hs-main {
            flex: 1;
            min-width: 0;
        }
        .hs-skill-list {
            list-style: none;
            padding: 0;
        }
        .hs-skill-list li {
            border-bottom: 1px solid rgba(92,58,30,0.3);
        }
        .hs-skill-list li:last-child { border-bottom: none; }
        .hs-skill-list a {
            display: block;
            padding: 5px 10px;
            color: #c4b490;
            text-decoration: none;
            font-size: 12px;
            transition: all 0.1s;
        }
        .hs-skill-list a:hover {
            color: #ffd760;
            background: rgba(255,215,96,0.06);
            text-decoration: none;
        }
        .hs-skill-list a.active {
            color: #ffd760;
            background: rgba(255,215,96,0.1);
        }
        .hs-skill-list .hs-special a {
            color: #ffbb22;
        }
        .hs-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
        }
        .hs-table th {
            color: #ffd760;
            font-family: 'Cinzel', Georgia, serif;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 6px 8px;
            border-bottom: 2px solid #5c3a1e;
            text-align: left;
        }
        .hs-table th.right { text-align: right; }
        .hs-table td {
            padding: 4px 8px;
            border-bottom: 1px solid rgba(92,58,30,0.2);
            color: #c4b490;
        }
        .hs-table td.right { text-align: right; }
        .hs-table td a { color: #d4c4a0; }
        .hs-table td a:hover { color: #ffd760; }
        .hs-table tr:hover td { background: rgba(255,215,96,0.03); }
        .hs-search-row {
            display: flex;
            gap: 15px;
            margin-top: 15px;
        }
        .hs-search-box {
            flex: 1;
            background: rgba(0,0,0,0.25);
            border: 1px solid #5c3a1e;
            border-radius: 3px;
            padding: 12px;
            text-align: center;
        }
        .hs-search-box b {
            display: block;
            color: #c4b490;
            margin-bottom: 6px;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .hs-search-box input[type="text"],
        .hs-search-box input[type="number"] {
            padding: 6px 8px;
            border: 1px solid #5c3a1e;
            border-radius: 3px;
            background: rgba(0,0,0,0.4);
            color: #d4c4a0;
            font-size: 12px;
            width: 120px;
        }
        .hs-search-box input:focus {
            outline: none;
            border-color: #c8a84e;
        }
        .hs-search-box input[type="submit"] {
            padding: 5px 14px;
            background: linear-gradient(180deg, #4a3520 0%, #3a2815 100%);
            border: 1px solid #5c3a1e;
            border-radius: 3px;
            color: #d4c4a0;
            cursor: pointer;
            font-size: 11px;
            margin-top: 4px;
        }
        .hs-search-box input[type="submit"]:hover {
            background: linear-gradient(180deg, #5a4530 0%, #4a3825 100%);
            color: #ffd760;
        }
        .hs-search-result {
            background: rgba(0,0,0,0.25);
            border: 1px solid #5c3a1e;
            border-radius: 3px;
            padding: 10px 15px;
            text-align: center;
            margin-top: 10px;
            color: #c4b490;
            font-size: 12px;
        }
        select {
            background: #3a2815;
            border: 1px solid #5c3a1e;
            color: #d4c4a0;
            padding: 4px 8px;
            border-radius: 3px;
        }

        /* Item icons */
        canvas.item-icon {
            image-rendering: pixelated;
            vertical-align: middle;
        }
        .text-orange { color: #ffbb22; }
        .yellow { color: #FFE139; }

        /* Player profile stat table */
        .hs-profile-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
        }
        .hs-profile-table th {
            color: #ffd760;
            font-family: 'Cinzel', Georgia, serif;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 6px 8px;
            border-bottom: 2px solid #5c3a1e;
            text-align: left;
        }
        .hs-profile-table th.right { text-align: right; }
        .hs-profile-table td {
            padding: 4px 8px;
            border-bottom: 1px solid rgba(92,58,30,0.2);
            color: #c4b490;
        }
        .hs-profile-table td.right { text-align: right; }
        .hs-profile-table td a { color: #d4c4a0; }
        .hs-profile-table td a:hover { color: #ffd760; }

        @media (max-width: 700px) {
            .rs-banner h1 { font-size: 2em; }
            .rs-nav a { padding: 8px 12px; font-size: 11px; }
            .rs-stats { gap: 25px; }
            .rs-stat-value { font-size: 2em; }
            .hs-layout { flex-direction: column; }
            .hs-sidebar { width: 100%; }
            .hs-search-row { flex-direction: column; }
        }
    </style>
</head>
<body>
    <div class="rs-banner">
        <h1>🦞 loot.xyz</h1>
        <p>A RuneScape 2004 Private Server</p>
    </div>
    <nav class="rs-nav">
        <div class="rs-nav-inner">
            <a href="/"${activePage === 'home' ? ' class="active"' : ''}>Home</a>
            <a href="/register"${activePage === 'register' ? ' class="active"' : ''}>Register</a>
            <a href="/hiscores"${activePage === 'hiscores' ? ' class="active"' : ''}>Hiscores</a>
            <a href="/rs2.cgi"${activePage === 'play' ? ' class="active"' : ''}>Play Now</a>
        </div>
    </nav>
    <div class="rs-page">
        ${content}
    </div>
    <div class="rs-footer">
        <p>Powered by <a href="https://github.com/LostCityRS/Server">LostCity</a> |
           SDK by <a href="${GITHUB_URL}">rs-sdk</a> |
           Hosted by <a href="https://github.com/99-cooking">99 Cooking</a></p>
    </div>
</body>
</html>`;
}
