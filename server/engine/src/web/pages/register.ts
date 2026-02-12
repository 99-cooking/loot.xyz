/**
 * Homepage and registration for loot.xyz
 * Dark blue/gold gradient design
 */

import { db } from '#/db/query.js';
import bcrypt from 'bcrypt';
import World from '#/engine/World.js';
import { layout, GITHUB_URL } from './layout.js';

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
    <div style="text-align: center; margin-bottom: 40px;">
        <a href="/play" class="btn btn-play">Play Now</a>
    </div>

    <div class="stats">
        <div class="stat">
            <div class="stat-value">${stats.players}</div>
            <div class="stat-label">Players Online</div>
        </div>
        <div class="stat">
            <div class="stat-value">${stats.accounts}</div>
            <div class="stat-label">Registered Players</div>
        </div>
    </div>

    <div class="features">
        <div class="feature">
            <h3>25x XP Rate</h3>
            <p>Level up faster than ever. Perfect for bot training experiments.</p>
        </div>
        <div class="feature">
            <h3>Bot-Friendly</h3>
            <p>Full SDK support for automation. Train your AI agents!</p>
        </div>
        <div class="feature">
            <h3>2004 Authentic</h3>
            <p>Experience RuneScape as it was in 2004. Nostalgia included.</p>
        </div>
        <div class="feature">
            <h3>Members Content</h3>
            <p>All members areas and skills unlocked for everyone.</p>
        </div>
    </div>

    <div class="card">
        <h2>Quick Start</h2>
        <p>1. <a href="/register">Register an account</a> or create one when you first log in</p>
        <p>2. <a href="/play">Launch the game client</a></p>
        <p>3. Enter your username and password</p>
        <p>4. Start your adventure!</p>
    </div>

    <div class="card">
        <h2>For Bot Developers</h2>
        <p>Clone the SDK and start automating:</p>
        <pre>git clone ${GITHUB_URL}.git
cd rs-sdk && bun install
bun scripts/create-bot.ts mybot
bun bots/mybot/script.ts</pre>
        <p style="margin-top: 15px;">
            <a href="${GITHUB_URL}">View SDK Documentation →</a>
        </p>
    </div>
    `;

    return new Response(layout('Home', content, 'home'), {
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

            if (!username || username.length < 1 || username.length > 12) {
                error = 'Username must be 1-12 characters';
            } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
                error = 'Username can only contain letters, numbers, and underscores';
            } else if (!password || password.length < 4) {
                error = 'Password must be at least 4 characters';
            } else if (password !== confirm) {
                error = 'Passwords do not match';
            } else {
                const existing = await db.selectFrom('account')
                    .select('id')
                    .where('username', '=', username.toLowerCase())
                    .executeTakeFirst();

                if (existing) {
                    error = 'Username already taken';
                } else {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    await db.insertInto('account')
                        .values({
                            username: username.toLowerCase(),
                            password: hashedPassword
                        })
                        .execute();
                    success = `Account "${username}" created! You can now play.`;
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
    <div class="card" style="max-width: 500px; margin: 0 auto;">
        <h2>Create Account</h2>
        ${error ? `<p class="error">${error}</p>` : ''}
        ${success ? `<p class="success">${success}</p>` : ''}

        <form method="POST" action="/register">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required
                       minlength="1" maxlength="12" pattern="[a-zA-Z0-9_]+"
                       placeholder="Enter username (1-12 chars)">
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required
                       minlength="4" placeholder="Enter password (min 4 chars)">
            </div>
            <div class="form-group">
                <label for="confirm">Confirm Password</label>
                <input type="password" id="confirm" name="confirm" required
                       placeholder="Confirm your password">
            </div>
            <button type="submit" class="btn" style="width: 100%;">Create Account</button>
        </form>

        <p style="text-align: center; margin-top: 20px; color: #999;">
            Already have an account? <a href="/play">Play Now</a>
        </p>
    </div>
    `;

    return new Response(layout('Register', content, 'register'), {
        headers: { 'Content-Type': 'text/html' }
    });
}
