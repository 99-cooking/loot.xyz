import { db } from '#/db/query.js';
import Environment from '#/util/Environment.js';
import { tryParseInt } from '#/util/TryParse.js';
import { escapeHtml, SKILL_NAMES, ENABLED_SKILLS } from '../utils.js';
import { rsLayout } from './layout.js';

const hiddenNames = Environment.HISCORES_HIDDEN_NAMES;

// Format gold value with K/M suffixes
function formatGold(value: number): string {
    if (value >= 10_000_000) return `${Math.floor(value / 1_000_000)}M`;
    if (value >= 100_000) return `${Math.floor(value / 1_000)}K`;
    return value.toLocaleString();
}

// Format playtime (in game ticks, 0.6s each)
function formatPlaytime(ticks: number): string {
    const totalSeconds = Math.floor(ticks * 0.6);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

// Build the skill sidebar HTML
function buildSkillSidebar(profile: string, activeCategory: number): string {
    const skills = [
        { id: 0, name: 'Overall' },
        ...ENABLED_SKILLS.map(s => ({ id: s.id + 1, name: s.name }))
    ];

    const items = skills.map(s =>
        `<li><a href="/hiscores?category=${s.id}&profile=${profile}"${s.id === activeCategory ? ' class="active"' : ''}>${s.name}</a></li>`
    ).join('\n');

    return `
    <div class="rs-panel">
        <div class="rs-panel-header"><h2>Skills</h2></div>
        <div class="rs-panel-body" style="padding: 5px 0;">
            <ul class="hs-skill-list">
                ${items}
                <li class="hs-special"><a href="/hiscores/outfit?profile=${profile}">Equipment</a></li>
            </ul>
        </div>
    </div>`;
}

// Player profile page
export async function handleHiscoresPlayerPage(url: URL): Promise<Response | null> {
    const match = url.pathname.match(/^\/hi(?:gh)?scores\/player\/([^/]+)\/?$/);
    if (!match) return null;

    const username = decodeURIComponent(match[1]);
    const profile = url.searchParams.get('profile') || 'main';

    const accountQuery = db
        .selectFrom('account')
        .select(['id', 'username'])
        .where('username', '=', username)
        .where('staffmodlevel', '<=', 1);
    const account = await (hiddenNames.length > 0
        ? accountQuery.where(eb => eb.not(eb(eb.fn('lower', ['username']), 'in', hiddenNames)))
        : accountQuery
    ).executeTakeFirst();

    if (!account) {
        const content = `<div class="rs-panel"><div class="rs-panel-body" style="text-align:center;">Player "${escapeHtml(username)}" not found.</div></div>`;
        return new Response(rsLayout('Player Not Found', content, 'hiscores'), {
            status: 404, headers: { 'Content-Type': 'text/html' }
        });
    }

    const overallStats = await db
        .selectFrom('hiscore_large')
        .select(['level', 'value', 'playtime'])
        .where('account_id', '=', account.id)
        .where('profile', '=', profile)
        .where('type', '=', 0)
        .executeTakeFirst();

    let overallRank = '-';
    if (overallStats) {
        let rankQuery = db
            .selectFrom('hiscore_large')
            .innerJoin('account', 'account.id', 'hiscore_large.account_id')
            .select(db.fn.count('hiscore_large.account_id').as('rank'))
            .where('hiscore_large.type', '=', 0)
            .where('hiscore_large.profile', '=', profile)
            .where('account.staffmodlevel', '<=', 1)
            .where((eb) => eb.or([
                eb('hiscore_large.level', '>', overallStats.level),
                eb.and([
                    eb('hiscore_large.level', '=', overallStats.level),
                    eb('hiscore_large.playtime', '<', overallStats.playtime)
                ])
            ]));
        if (hiddenNames.length > 0) {
            rankQuery = rankQuery.where(eb => eb.not(eb(eb.fn('lower', ['account.username']), 'in', hiddenNames)));
        }
        const rankResult = await rankQuery.executeTakeFirst();
        overallRank = String((Number(rankResult?.rank) || 0) + 1);
    }

    const skillStats = await db
        .selectFrom('hiscore')
        .select(['type', 'level', 'value', 'playtime'])
        .where('account_id', '=', account.id)
        .where('profile', '=', profile)
        .execute();

    // Build skill rows
    let skillRows = `
        <tr>
            <td><a href="/hiscores?category=0&profile=${profile}">Overall</a></td>
            <td class="right">${overallRank}</td>
            <td class="right">${overallStats ? overallStats.level.toLocaleString() : '-'}</td>
            <td class="right">${overallStats ? formatPlaytime(overallStats.playtime) : '-'}</td>
        </tr>`;

    for (const skill of ENABLED_SKILLS) {
        const stat = skillStats.find(s => s.type === skill.id + 1);
        let rank = '-';
        if (stat) {
            let skillRankQuery = db
                .selectFrom('hiscore')
                .innerJoin('account', 'account.id', 'hiscore.account_id')
                .select(db.fn.count('hiscore.account_id').as('rank'))
                .where('hiscore.type', '=', skill.id + 1)
                .where('hiscore.profile', '=', profile)
                .where('account.staffmodlevel', '<=', 1)
                .where((eb) => eb.or([
                    eb('hiscore.level', '>', stat.level),
                    eb.and([
                        eb('hiscore.level', '=', stat.level),
                        eb('hiscore.playtime', '<', stat.playtime)
                    ])
                ]));
            if (hiddenNames.length > 0) {
                skillRankQuery = skillRankQuery.where(eb => eb.not(eb(eb.fn('lower', ['account.username']), 'in', hiddenNames)));
            }
            const rankResult = await skillRankQuery.executeTakeFirst();
            rank = String((Number(rankResult?.rank) || 0) + 1);
        }
        skillRows += `
            <tr>
                <td><a href="/hiscores?category=${skill.id + 1}&profile=${profile}">${skill.name}</a></td>
                <td class="right">${rank}</td>
                <td class="right">${stat ? stat.level.toLocaleString() : '-'}</td>
                <td class="right">${stat ? formatPlaytime(stat.playtime) : '-'}</td>
            </tr>`;
    }

    const content = `
    <div class="rs-panel" style="max-width: 600px; margin: 0 auto;">
        <div class="rs-panel-header">
            <h2>Hiscores for ${escapeHtml(account.username)}</h2>
        </div>
        <div class="rs-panel-body">
            <div style="text-align:center; margin-bottom: 15px;">
                <a href="/hiscores?profile=${profile}">← Back to All Hiscores</a>
            </div>
            <table class="hs-profile-table">
                <tr>
                    <th>Skill</th>
                    <th class="right">Rank</th>
                    <th class="right">Level</th>
                    <th class="right">Time</th>
                </tr>
                ${skillRows}
            </table>
        </div>
    </div>`;

    return new Response(rsLayout(`Hiscores - ${escapeHtml(account.username)}`, content, 'hiscores'), {
        headers: { 'Content-Type': 'text/html' }
    });
}

export async function handleHiscoresPage(url: URL): Promise<Response | null> {
    if (!/^\/hi(?:gh)?scores\/?$/.test(url.pathname)) return null;

    const category = tryParseInt(url.searchParams.get('category'), -1);
    const profile = url.searchParams.get('profile') || 'main';
    const playerSearch = url.searchParams.get('player')?.toLowerCase().trim() || '';
    const rankSearch = tryParseInt(url.searchParams.get('rank'), -1);

    let rows: { rank: number; username: string; level: number; playtime: number }[] = [];
    let selectedSkill = 'Overall';
    let searchedPlayer: { rank: number; username: string; level: number; playtime: number } | null = null;

    if (category === -1 || category === 0) {
        let query = db
            .selectFrom('hiscore_large')
            .innerJoin('account', 'account.id', 'hiscore_large.account_id')
            .select(['account.username', 'hiscore_large.level', 'hiscore_large.playtime'])
            .where('hiscore_large.type', '=', 0)
            .where('hiscore_large.profile', '=', profile)
            .where('account.staffmodlevel', '<=', 1)
            .orderBy('hiscore_large.level', 'desc')
            .orderBy('hiscore_large.playtime', 'asc');
        if (hiddenNames.length > 0) {
            query = query.where(eb => eb.not(eb(eb.fn('lower', ['account.username']), 'in', hiddenNames)));
        }
        const allResults = await query.execute();
        const startRank = rankSearch > 0 ? rankSearch - 1 : 0;
        rows = allResults.slice(startRank, startRank + 21).map((r, i) => ({
            rank: startRank + i + 1, username: r.username, level: r.level, playtime: r.playtime
        }));
        if (playerSearch) {
            const idx = allResults.findIndex(r => r.username.toLowerCase() === playerSearch);
            if (idx !== -1) {
                const r = allResults[idx];
                searchedPlayer = { rank: idx + 1, username: r.username, level: r.level, playtime: r.playtime };
            }
        }
        selectedSkill = 'Overall';
    } else {
        const skillIndex = category - 1;
        const skillName = SKILL_NAMES[skillIndex];
        if (skillName) {
            let query = db
                .selectFrom('hiscore')
                .innerJoin('account', 'account.id', 'hiscore.account_id')
                .select(['account.username', 'hiscore.level', 'hiscore.playtime'])
                .where('hiscore.type', '=', category)
                .where('hiscore.profile', '=', profile)
                .where('account.staffmodlevel', '<=', 1)
                .orderBy('hiscore.level', 'desc')
                .orderBy('hiscore.playtime', 'asc');
            if (hiddenNames.length > 0) {
                query = query.where(eb => eb.not(eb(eb.fn('lower', ['account.username']), 'in', hiddenNames)));
            }
            const allResults = await query.execute();
            const startRank = rankSearch > 0 ? rankSearch - 1 : 0;
            rows = allResults.slice(startRank, startRank + 21).map((r, i) => ({
                rank: startRank + i + 1, username: r.username, level: r.level, playtime: r.playtime
            }));
            if (playerSearch) {
                const idx = allResults.findIndex(r => r.username.toLowerCase() === playerSearch);
                if (idx !== -1) {
                    const r = allResults[idx];
                    searchedPlayer = { rank: idx + 1, username: r.username, level: r.level, playtime: r.playtime };
                }
            }
            selectedSkill = skillName;
        }
    }

    const currentCategory = category === -1 ? 0 : category;

    const tableRows = rows.map(r => `
        <tr>
            <td class="right">${r.rank}</td>
            <td><a href="/hiscores/player/${encodeURIComponent(r.username)}?profile=${profile}">${escapeHtml(r.username)}</a></td>
            <td class="right">${r.level.toLocaleString()}</td>
            <td class="right">${formatPlaytime(r.playtime)}</td>
        </tr>`).join('');

    const content = `
    <div class="hs-layout">
        <div class="hs-sidebar">
            ${buildSkillSidebar(profile, currentCategory)}
        </div>
        <div class="hs-main">
            <div class="rs-panel">
                <div class="rs-panel-header"><h2>${selectedSkill} Hiscores</h2></div>
                <div class="rs-panel-body">
                    ${rows.length > 0 ? `
                    <table class="hs-table">
                        <tr>
                            <th class="right">Rank</th>
                            <th>Name</th>
                            <th class="right">Level</th>
                            <th class="right">Time</th>
                        </tr>
                        ${tableRows}
                    </table>` : '<p style="text-align:center;">No players found</p>'}

                    <div class="hs-search-row">
                        <div class="hs-search-box">
                            <form action="/hiscores">
                                <b>Search by rank</b>
                                <input type="number" maxlength="12" size="12" name="rank" value="">
                                <input type="hidden" name="category" value="${currentCategory}">
                                <input type="hidden" name="profile" value="${profile}">
                                <br><input type="submit" value="Search">
                            </form>
                        </div>
                        <div class="hs-search-box">
                            <form action="/hiscores" autocomplete="off">
                                <b>Search by name</b>
                                <input type="text" maxlength="12" size="12" name="player" value="${escapeHtml(playerSearch)}" autocomplete="off">
                                <input type="hidden" name="category" value="${currentCategory}">
                                <input type="hidden" name="profile" value="${profile}">
                                <br><input type="submit" value="Search">
                            </form>
                        </div>
                    </div>

                    ${searchedPlayer ? `
                    <div class="hs-search-result">
                        Rank: ${searchedPlayer.rank} |
                        <a href="/hiscores/player/${encodeURIComponent(searchedPlayer.username)}?profile=${profile}">${escapeHtml(searchedPlayer.username)}</a> |
                        Level: ${searchedPlayer.level.toLocaleString()} |
                        Time: ${formatPlaytime(searchedPlayer.playtime)}
                    </div>` : playerSearch ? `
                    <div class="hs-search-result">Player "${escapeHtml(playerSearch)}" not found.</div>` : ''}
                </div>
            </div>
        </div>
    </div>`;

    return new Response(rsLayout(`${selectedSkill} Hiscores`, content, 'hiscores'), {
        headers: { 'Content-Type': 'text/html' }
    });
}

// Equipment/outfit hiscores
export async function handleHiscoresOutfitPage(url: URL): Promise<Response | null> {
    const match = url.pathname.match(/^\/hi(?:gh)?scores\/outfit\/?$/);
    if (!match) return null;

    const profile = url.searchParams.get('profile') || 'main';

    let query = db
        .selectFrom('hiscore_outfit')
        .innerJoin('account', 'account.id', 'hiscore_outfit.account_id')
        .select(['account.username', 'hiscore_outfit.value', 'hiscore_outfit.items'])
        .where('hiscore_outfit.profile', '=', profile)
        .where('account.staffmodlevel', '<=', 1)
        .orderBy('hiscore_outfit.value', 'desc')
        .limit(50);
    if (hiddenNames.length > 0) {
        query = query.where(eb => eb.not(eb(eb.fn('lower', ['account.username']), 'in', hiddenNames)));
    }

    const results = await query.execute();

    const tableRows = results.map((r, i) => {
        let itemsList = '';
        try {
            const items = JSON.parse(r.items) as { id?: number; name: string; value: number }[];
            itemsList = items.map(item => {
                if (item.id != null) {
                    return `<canvas class="item-icon" data-item-id="${item.id}" title="${escapeHtml(item.name)} (${item.value.toLocaleString()} gp)" width="32" height="32" style="image-rendering:pixelated;vertical-align:middle"></canvas>`;
                }
                return `<span title="${item.value.toLocaleString()} gp">${escapeHtml(item.name)}</span>`;
            }).join(' ');
        } catch {
            itemsList = escapeHtml(r.items);
        }
        return `
            <tr>
                <td class="right">${i + 1}</td>
                <td><a href="/hiscores/player/${encodeURIComponent(r.username)}?profile=${profile}">${escapeHtml(r.username)}</a></td>
                <td class="right yellow" title="${r.value.toLocaleString()} gp">${formatGold(r.value)}</td>
                <td style="font-size:11px">${itemsList}</td>
            </tr>`;
    }).join('');

    const content = `
    <div class="hs-layout">
        <div class="hs-sidebar">
            ${buildSkillSidebar(profile, -1)}
        </div>
        <div class="hs-main">
            <div class="rs-panel">
                <div class="rs-panel-header"><h2>Equipment Hiscores</h2></div>
                <div class="rs-panel-body">
                    ${results.length > 0 ? `
                    <table class="hs-table">
                        <tr>
                            <th class="right">#</th>
                            <th>Name</th>
                            <th class="right">Value</th>
                            <th>Items</th>
                        </tr>
                        ${tableRows}
                    </table>` : '<p style="text-align:center;">No outfit data found</p>'}
                </div>
            </div>
        </div>
    </div>
    <!-- Hidden canvas required by viewer internals -->
    <canvas id="canvas" width="256" height="256" style="display:none"></canvas>
    <script type="module">
        import { ItemViewer } from '/viewer/viewer.js';
        const icons = document.querySelectorAll('canvas.item-icon');
        if (icons.length > 0) {
            const viewer = new ItemViewer();
            try {
                await viewer.init('');
                for (const el of icons) {
                    const id = parseInt(el.dataset.itemId);
                    if (isNaN(id)) continue;
                    try {
                        const icon = viewer.renderItemIconAsImageData(id);
                        if (icon) {
                            el.getContext('2d').putImageData(icon, 0, 0);
                        } else {
                            el.style.display = 'none';
                            const fallback = document.createElement('span');
                            fallback.textContent = el.title.split(' (')[0];
                            fallback.title = el.title;
                            el.parentNode.insertBefore(fallback, el);
                        }
                    } catch (e) {}
                }
            } catch (err) {
                console.error('ItemViewer init failed:', err);
                for (const el of icons) {
                    const fallback = document.createElement('span');
                    fallback.textContent = el.title.split(' (')[0];
                    fallback.title = el.title;
                    el.parentNode.insertBefore(fallback, el);
                    el.style.display = 'none';
                }
            }
        }
    </script>`;

    return new Response(rsLayout('Equipment Hiscores', content, 'hiscores'), {
        headers: { 'Content-Type': 'text/html' }
    });
}
