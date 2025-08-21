// backend/src/metrics.ts
import os from "os";
import process from "process";
import { PrismaClient } from "@prisma/client";
import prisma from "./lib/prisma";

export type Metrics = {
  app: {
    name: string;
    env: string;
    node: string;
    pid: number;
    startedAt: string;
    uptimeSec: number;
    jwtConfigured: boolean;
  };
  system: {
    platform: string;
    release: string;
    cpus: number;
    loadAvg: number[];
    memory: { rss: number; heapUsed: number; heapTotal: number };
  };
  database: { ok: boolean };
  counts: Record<string, number>;
};

async function safeCount(model: string): Promise<number> {
  try {
    // @ts-expect-error accès dynamique
    if (!prisma[model]?.count) return -1;
    // @ts-expect-error idem
    return await prisma[model].count();
  } catch {
    return -1;
  }
}

export async function collectMetrics(): Promise<Metrics> {
  let dbOk = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch {
    dbOk = false;
  }

  const counts: Record<string, number> = {};
  // mets seulement ce qui t’intéresse ; ceux qui n’existent pas renverront -1
  const models = [
    "user", "artwork", "iPFSMedia", "nft", "wallet",
    "transaction", "exchange", "tShirt", "tShirtPurchase",
    "portfolioItem", "article"
  ];
  await Promise.all(models.map(async m => (counts[m] = await safeCount(m))));

  const startedAt = new Date(Date.now() - process.uptime() * 1000).toISOString();

  return {
    app: {
      name: "Artgold Backend",
      env: process.env.NODE_ENV ?? "development",
      node: process.version,
      pid: process.pid,
      startedAt,
      uptimeSec: Math.floor(process.uptime()),
      jwtConfigured: !!process.env.JWT_SECRET,
    },
    system: {
      platform: process.platform,
      release: os.release(),
      cpus: os.cpus().length,
      loadAvg: typeof os.loadavg === "function" ? os.loadavg() : [],
      memory: {
        rss: process.memoryUsage().rss,
        heapUsed: process.memoryUsage().heapUsed,
        heapTotal: process.memoryUsage().heapTotal,
      },
    },
    database: { ok: dbOk },
    counts,
  };
}

export function renderDashboardHtml(m: Metrics) {
  // petite util
  const fmt = (n: number) =>
    n < 0 ? "n/a" : n.toLocaleString("fr-FR");

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Artgold · Metrics</title>
<style>
  :root {
    --bg: #0f1220; --card: #171a2b; --muted:#9aa3b2; --ok:#3ecf8e; --bad:#ff6b6b; --accent:#7c5cff;
    --text: #e6e8f0; --chip:#24283d; --border:#2a2f45;
  }
  *{box-sizing:border-box} body{margin:0;background:var(--bg);color:var(--text);font:14px/1.45 system-ui,Segoe UI,Roboto,Ubuntu,"Helvetica Neue",Arial}
  .wrap{max-width:1100px;margin:40px auto;padding:0 16px}
  header{display:flex;gap:14px;align-items:center;margin-bottom:20px}
  .pill{background:var(--chip);border:1px solid var(--border);border-radius:999px;padding:6px 10px;color:var(--muted)}
  h1{font-size:20px;margin:0}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px}
  .card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px}
  .title{font-weight:600;margin:0 0 8px 0;color:#fff}
  .kpi{font-size:22px;font-weight:700;margin:8px 0}
  .muted{color:var(--muted)}
  .row{display:flex;justify-content:space-between;gap:12px;padding:6px 0;border-bottom:1px dashed var(--border)}
  .row:last-child{border-bottom:none}
  .ok{color:var(--ok)} .bad{color:var(--bad)}
  footer{margin-top:18px;color:var(--muted);display:flex;justify-content:space-between;align-items:center}
  button{background:var(--accent);border:0;color:#fff;border-radius:9px;padding:8px 12px;font-weight:600;cursor:pointer}
  button:disabled{opacity:.6;cursor:default}
  code{background:var(--chip);border:1px solid var(--border);padding:2px 6px;border-radius:6px}
</style>
</head>
<body>
  <div class="wrap">
    <header>
      <h1>Artgold · Backend Dashboard</h1>
      <span class="pill">Node <code>${m.app.node}</code></span>
      <span class="pill">${m.app.env}</span>
      <span class="pill">PID ${m.app.pid}</span>
    </header>

    <div class="grid">
      <section class="card">
        <div class="title">Application</div>
        <div class="row"><span>Démarré</span><span>${new Date(m.app.startedAt).toLocaleString("fr-FR")}</span></div>
        <div class="row"><span>Uptime</span><span id="uptime">${m.app.uptimeSec}s</span></div>
        <div class="row"><span>JWT secret</span><span class="${m.app.jwtConfigured ? 'ok' : 'bad'}">${m.app.jwtConfigured ? 'configuré' : 'absent'}</span></div>
      </section>

      <section class="card">
        <div class="title">Système</div>
        <div class="row"><span>Plateforme</span><span>${m.system.platform} ${m.system.release}</span></div>
        <div class="row"><span>CPU</span><span>${m.system.cpus}</span></div>
        <div class="row"><span>Charge</span><span>${m.system.loadAvg.map(n=>n.toFixed(2)).join(" / ") || 'n/a'}</span></div>
        <div class="row"><span>RSS</span><span>${fmt(m.system.memory.rss)} o</span></div>
        <div class="row"><span>Heap</span><span>${fmt(m.system.memory.heapUsed)} / ${fmt(m.system.memory.heapTotal)} o</span></div>
      </section>

      <section class="card">
        <div class="title">Base de données</div>
        <div class="kpi ${m.database.ok ? 'ok' : 'bad'}">${m.database.ok ? 'CONNECTÉE' : 'HORS LIGNE'}</div>
        <div class="muted">PostgreSQL via Prisma</div>
      </section>

      <section class="card">
        <div class="title">Comptages (si existants)</div>
        ${Object.entries(m.counts).map(([k,v])=>`
          <div class="row"><span>${k}</span><span>${fmt(v)}</span></div>
        `).join("")}
      </section>
    </div>

    <footer>
      <span class="muted">Auto-rafraîchissement toutes les 15s</span>
      <button id="refreshBtn">Rafraîchir</button>
    </footer>
  </div>

<script>
async function refresh(){
  const btn = document.getElementById('refreshBtn');
  btn.disabled = true;
  try{
    const res = await fetch('/metrics.json');
    const m = await res.json();
    document.getElementById('uptime').textContent = m.app.uptimeSec + 's';
    // on pourrait mettre à jour d'autres champs si besoin
  }finally{
    btn.disabled = false;
  }
}
document.getElementById('refreshBtn').addEventListener('click', refresh);
setInterval(refresh, 15000);
</script>
</body>
</html>`;
}
