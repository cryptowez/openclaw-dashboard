const fs = require("fs");
const path = require("path");
const os = require("os");

const OPENCLAW_DIR = path.join(os.homedir(), ".openclaw");
const ENV_PATH = path.join(OPENCLAW_DIR, ".env");

function parseEnv(content) {
  const map = new Map();
  for (const line of content.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim();
    map.set(k, v);
  }
  return map;
}

function serializeEnv(map) {
  const keys = Array.from(map.keys()).sort();
  return keys.map(k => `${k}=${map.get(k)}`).join("\n") + "\n";
}

async function readVaultKeys() {
  if (!fs.existsSync(ENV_PATH)) return [];
  const content = fs.readFileSync(ENV_PATH, "utf8");
  const map = parseEnv(content);
  return Array.from(map.keys()).sort();
}

async function upsertVaultEntries(entries) {
  const dir = path.dirname(ENV_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const existing = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, "utf8") : "";
  const map = parseEnv(existing);

  for (const [k, v] of Object.entries(entries)) {
    if (v === undefined || v === null) continue;
    map.set(String(k), String(v));
  }

  fs.writeFileSync(ENV_PATH, serializeEnv(map), { mode: 0o600 });
  try { fs.chmodSync(ENV_PATH, 0o600); } catch {}
}

module.exports = { readVaultKeys, upsertVaultEntries };
