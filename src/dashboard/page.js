function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function riskLabel(score) {
  if (score >= 80) return "Critical";
  if (score >= 55) return "High";
  if (score >= 25) return "Medium";
  return "Low";
}

function renderBandBar(label, value, accent) {
  return `
    <div class="band">
      <div class="band__meta">
        <span>${escapeHtml(label)}</span>
        <strong>${value}</strong>
      </div>
      <div class="band__track">
        <span class="band__fill" style="width:${Math.min(value * 24, 100)}%; background:${accent};"></span>
      </div>
    </div>
  `;
}

export function renderDashboardPage(data) {
  const { metrics, bands, pullRequests, governance, installUrl, generatedAt } = data;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ai-sprawl</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #07111f;
        --bg2: #0b1d33;
        --panel: rgba(10, 20, 35, 0.78);
        --panel-strong: rgba(15, 28, 48, 0.92);
        --text: #eaf2ff;
        --muted: #8fa7c4;
        --line: rgba(149, 178, 214, 0.16);
        --accent: #8ff7d5;
        --accent2: #7da7ff;
        --warning: #ffc94d;
        --critical: #ff6b7a;
        --ok: #4de3a1;
        --shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background:
          radial-gradient(circle at top left, rgba(125, 167, 255, 0.24), transparent 30%),
          radial-gradient(circle at 85% 10%, rgba(143, 247, 213, 0.2), transparent 24%),
          linear-gradient(180deg, var(--bg), var(--bg2));
        color: var(--text);
      }
      .shell {
        max-width: 1260px;
        margin: 0 auto;
        padding: 32px 20px 40px;
      }
      .hero {
        display: grid;
        grid-template-columns: 1.35fr 0.95fr;
        gap: 18px;
        margin-bottom: 18px;
      }
      .panel {
        background: var(--panel);
        border: 1px solid var(--line);
        border-radius: 24px;
        box-shadow: var(--shadow);
        backdrop-filter: blur(14px);
      }
      .hero__main {
        padding: 28px;
        position: relative;
        overflow: hidden;
      }
      .hero__main::after {
        content: "";
        position: absolute;
        inset: auto -10% -30% auto;
        width: 280px;
        height: 280px;
        border-radius: 999px;
        background: radial-gradient(circle, rgba(143, 247, 213, 0.24), transparent 70%);
        pointer-events: none;
      }
      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border-radius: 999px;
        border: 1px solid rgba(143, 247, 213, 0.25);
        background: rgba(143, 247, 213, 0.08);
        color: var(--accent);
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      h1 {
        margin: 16px 0 12px;
        font-size: clamp(36px, 5vw, 62px);
        line-height: 0.96;
        letter-spacing: -0.05em;
        max-width: 9ch;
      }
      .lede {
        max-width: 58ch;
        color: var(--muted);
        font-size: 16px;
        line-height: 1.6;
      }
      .hero__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 20px;
      }
      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-height: 44px;
        padding: 0 16px;
        border-radius: 14px;
        border: 1px solid var(--line);
        text-decoration: none;
        color: var(--text);
        background: rgba(255, 255, 255, 0.04);
      }
      .button--primary {
        background: linear-gradient(135deg, rgba(143, 247, 213, 0.18), rgba(125, 167, 255, 0.22));
        border-color: rgba(125, 167, 255, 0.38);
      }
      .hero__side {
        display: grid;
        gap: 18px;
      }
      .card {
        padding: 22px;
      }
      .card h2, .section h2 {
        margin: 0 0 10px;
        font-size: 16px;
        letter-spacing: 0.02em;
      }
      .meta {
        display: grid;
        gap: 10px;
      }
      .meta__row {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        align-items: center;
      }
      .meta__label {
        color: var(--muted);
        font-size: 13px;
      }
      .meta__value {
        font-weight: 700;
      }
      .grid-4 {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 14px;
        margin-bottom: 18px;
      }
      .stat {
        padding: 18px;
      }
      .stat__label {
        color: var(--muted);
        font-size: 13px;
        margin-bottom: 8px;
      }
      .stat__value {
        font-size: 32px;
        font-weight: 760;
        letter-spacing: -0.04em;
      }
      .stat__foot {
        margin-top: 10px;
        color: var(--muted);
        font-size: 12px;
      }
      .content {
        display: grid;
        grid-template-columns: 1.15fr 0.85fr;
        gap: 18px;
      }
      .section {
        padding: 22px;
      }
      .section--tall {
        min-height: 100%;
      }
      .bands {
        display: grid;
        gap: 14px;
      }
      .band {
        display: grid;
        gap: 8px;
      }
      .band__meta {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        color: var(--muted);
        font-size: 13px;
      }
      .band__meta strong {
        color: var(--text);
      }
      .band__track {
        height: 11px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.06);
        overflow: hidden;
      }
      .band__fill {
        display: block;
        height: 100%;
        border-radius: inherit;
      }
      .list {
        display: grid;
        gap: 12px;
      }
      .pr {
        padding: 16px;
        border-radius: 18px;
        border: 1px solid var(--line);
        background: rgba(255, 255, 255, 0.03);
      }
      .pr__top {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: start;
      }
      .pr__repo {
        color: var(--muted);
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .pr__title {
        margin: 6px 0 10px;
        font-size: 15px;
        font-weight: 650;
      }
      .pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 7px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 700;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--line);
        white-space: nowrap;
      }
      .pill--critical { color: #ff8f9a; border-color: rgba(255, 107, 122, 0.35); background: rgba(255, 107, 122, 0.08); }
      .pill--high { color: #ffd17a; border-color: rgba(255, 201, 77, 0.35); background: rgba(255, 201, 77, 0.08); }
      .pill--medium { color: #d5d97b; border-color: rgba(213, 217, 123, 0.32); background: rgba(213, 217, 123, 0.07); }
      .pill--low { color: #7ee0be; border-color: rgba(78, 227, 161, 0.28); background: rgba(78, 227, 161, 0.06); }
      .signals {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 12px;
      }
      .signal {
        padding: 7px 9px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid var(--line);
        color: var(--muted);
        font-size: 12px;
      }
      .checklist {
        display: grid;
        gap: 12px;
      }
      .check {
        display: grid;
        gap: 6px;
        padding: 16px;
        border-radius: 18px;
        border: 1px solid var(--line);
        background: rgba(255, 255, 255, 0.03);
      }
      .check__row {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: center;
      }
      .check__label {
        font-weight: 650;
      }
      .check__value {
        color: var(--muted);
        font-size: 13px;
      }
      .status {
        padding: 6px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .status--live {
        color: var(--ok);
        background: rgba(77, 227, 161, 0.1);
      }
      .status--ready {
        color: var(--warning);
        background: rgba(255, 201, 77, 0.1);
      }
      .status--planned {
        color: var(--muted);
        background: rgba(255, 255, 255, 0.04);
      }
      .footer {
        margin-top: 18px;
        color: var(--muted);
        font-size: 12px;
        display: flex;
        justify-content: space-between;
        gap: 16px;
        flex-wrap: wrap;
      }
      @media (max-width: 980px) {
        .hero, .content, .grid-4 { grid-template-columns: 1fr; }
      }
      @media (max-width: 720px) {
        .shell { padding: 16px; }
        .hero__main, .card, .section { padding: 18px; }
        h1 { max-width: none; }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <section class="hero">
        <div class="panel hero__main">
          <div class="eyebrow">AI Code Governance · GitHub native control layer</div>
          <h1>See the sprawl before it ships.</h1>
          <p class="lede">
            AI coding makes software cheap to create. This dashboard keeps the resulting code,
            scripts, agents, and automations inside a governance loop so teams can still move fast
            without losing ownership, review discipline, or security posture.
          </p>
          <div class="hero__actions">
            <a class="button button--primary" href="${escapeHtml(installUrl)}">Install GitHub App</a>
            <a class="button" href="/api/dashboard">Inspect live summary</a>
            <a class="button" href="/github/config">View app config</a>
          </div>
        </div>

        <div class="hero__side">
          <div class="panel card">
            <h2>Connection</h2>
            <div class="meta">
              <div class="meta__row">
                <span class="meta__label">Organization</span>
                <span class="meta__value">acme</span>
              </div>
              <div class="meta__row">
                <span class="meta__label">Repos connected</span>
                <span class="meta__value">${metrics.connectedRepos}</span>
              </div>
              <div class="meta__row">
                <span class="meta__label">Generated</span>
                <span class="meta__value">${new Date(generatedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div class="panel card">
            <h2>Governance posture</h2>
            <div class="meta">
              ${governance
                .map(
                  (item) => `
                    <div class="meta__row">
                      <span class="meta__label">${escapeHtml(item.label)}</span>
                      <span class="status status--${escapeHtml(item.status)}">${escapeHtml(item.status)}</span>
                    </div>
                  `
                )
                .join("")}
            </div>
          </div>
        </div>
      </section>

      <section class="grid-4">
        <div class="panel stat">
          <div class="stat__label">Average risk score</div>
          <div class="stat__value">${metrics.averageScore}</div>
          <div class="stat__foot">Across the current sample set</div>
        </div>
        <div class="panel stat">
          <div class="stat__label">High-risk PRs</div>
          <div class="stat__value">${metrics.highRiskPullRequests}</div>
          <div class="stat__foot">Require extra review or ownership checks</div>
        </div>
        <div class="panel stat">
          <div class="stat__label">Requires review</div>
          <div class="stat__value">${metrics.requireReview}</div>
          <div class="stat__foot">At or above the governance threshold</div>
        </div>
        <div class="panel stat">
          <div class="stat__label">Critical band</div>
          <div class="stat__value">${bands.critical}</div>
          <div class="stat__foot">Immediate attention, block merge</div>
        </div>
      </section>

      <section class="content">
        <div class="panel section section--tall">
          <h2>Risk radar</h2>
          <div class="bands">
            ${renderBandBar("Low", bands.low, "linear-gradient(90deg, #4de3a1, #7ee0be)")}
            ${renderBandBar("Medium", bands.medium, "linear-gradient(90deg, #d5d97b, #ffc94d)")}
            ${renderBandBar("High", bands.high, "linear-gradient(90deg, #ffc94d, #ff9c61)")}
            ${renderBandBar("Critical", bands.critical, "linear-gradient(90deg, #ff6b7a, #ff8f9a)")}
          </div>
        </div>

        <div class="panel section section--tall">
          <h2>Recent pull requests</h2>
          <div class="list">
            ${pullRequests
              .map(
                (pr) => `
                  <article class="pr">
                    <div class="pr__top">
                      <div>
                        <div class="pr__repo">${escapeHtml(pr.repo)}</div>
                        <div class="pr__title">${escapeHtml(pr.title)}</div>
                      </div>
                      <span class="pill pill--${escapeHtml(pr.riskBand)}">${riskLabel(pr.score)} · ${pr.score}</span>
                    </div>
                    <div class="signals">
                      ${pr.reasons
                        .map(
                          (reason) => `
                            <span class="signal">${escapeHtml(reason.signal)}: ${escapeHtml(reason.value)}</span>
                          `
                        )
                        .join("")}
                    </div>
                  </article>
                `
              )
              .join("")}
          </div>
        </div>
      </section>

      <div class="footer">
        <span>AI Code Governance · GitHub native control layer</span>
        <span>Summary generated from live scoring data and install config</span>
      </div>
    </main>
  </body>
</html>`;
}
