import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 4173;

app.use(express.json());
app.use(express.static(join(__dirname, 'dist')));

const NS_MCP = {
  type: "url",
  url: "https://8311319.suitetalk.api.netsuite.com/services/mcp/v1/suiteapp/com.netsuite.mcpstandardtools",
  name: "netsuite"
};

app.post('/api/netsuite', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ ok: false, error: "ANTHROPIC_API_KEY not set" });
  const { sql } = req.body;
  if (!sql) return res.status(400).json({ ok: false, error: "Missing sql" });
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 8000, system: "Run the SuiteQL query. Return ONLY the raw JSON data.", messages: [{ role: "user", content: "Run this SuiteQL: " + sql }], mcp_servers: [NS_MCP] }),
    });
    if (!response.ok) return res.status(502).json({ ok: false, error: "Anthropic API " + response.status });
    const data = await response.json();
    for (const block of (data.content || [])) {
      if (block.type === "mcp_tool_result" && block.content) {
        const subs = Array.isArray(block.content) ? block.content : [block.content];
        for (const s of subs) {
          const txt = typeof s === "string" ? s : (s && s.text ? s.text : "");
          if (!txt) continue;
          try { const p = JSON.parse(txt); if (p.data && Array.isArray(p.data)) return res.json({ ok: true, data: p.data, count: p.data.length }); if (Array.isArray(p)) return res.json({ ok: true, data: p, count: p.length }); } catch {}
        }
      }
      if (block.type === "text" && block.text) {
        const match = block.text.match(/\[[\s\S]*?\]/);
        if (match) try { const arr = JSON.parse(match[0]); return res.json({ ok: true, data: arr, count: arr.length }); } catch {}
      }
    }
    return res.json({ ok: false, error: "Could not parse response" });
  } catch (err) { return res.status(500).json({ ok: false, error: err.message }); }
});

app.get('/api/health', (req, res) => res.json({ status: "ok", hasApiKey: !!process.env.ANTHROPIC_API_KEY }));
app.get('*', (req, res) => res.sendFile(join(__dirname, 'dist', 'index.html')));
app.listen(PORT, '0.0.0.0', () => console.log("Brewhouse Planner on port " + PORT));
