import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 4173;

app.use(express.json());

// Serve the Vite build
app.use(express.static(join(__dirname, 'dist')));

// ─── NetSuite proxy endpoint ────────────────────────────────────────────────────
const NS_MCP = {
  type: "url",
  url: "https://8311319.suitetalk.api.netsuite.com/services/mcp/v1/suiteapp/com.netsuite.mcpstandardtools",
  name: "netsuite"
};

app.post('/api/netsuite', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ ok: false, error: "ANTHROPIC_API_KEY not set on server" });
  }

  const { sql } = req.body;
  if (!sql) {
    return res.status(400).json({ ok: false, error: "Missing sql in request body" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8000,
        system: "Run the SuiteQL query. Return ONLY the raw JSON data from the tool result. No commentary.",
        messages: [{ role: "user", content: "Run this SuiteQL query: " + sql }],
        mcp_servers: [NS_MCP],
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "Unknown");
      console.error("Anthropic API error:", response.status, errText.slice(0, 500));
      return res.status(502).json({ ok: false, error: `Anthropic API returned ${response.status}` });
    }

    const data = await response.json();

    // Parse MCP tool results
    for (const block of (data.content || [])) {
      if (block.type === "mcp_tool_result" && block.content) {
        const subs = Array.isArray(block.content) ? block.content : [block.content];
        for (const s of subs) {
          const txt = typeof s === "string" ? s : (s && s.text ? s.text : "");
          if (!txt) continue;
          try {
            const parsed = JSON.parse(txt);
            if (parsed.data && Array.isArray(parsed.data)) {
              return res.json({ ok: true, data: parsed.data, count: parsed.data.length });
            }
            if (Array.isArray(parsed)) {
              return res.json({ ok: true, data: parsed, count: parsed.length });
            }
          } catch { /* try next */ }
        }
      }
    }

    // Try text blocks
    for (const block of (data.content || [])) {
      if (block.type === "text" && block.text) {
        const match = block.text.match(/\[[\s\S]*?\]/);
        if (match) {
          try {
            const arr = JSON.parse(match[0]);
            return res.json({ ok: true, data: arr, count: arr.length });
          } catch { /* continue */ }
        }
      }
    }

    console.error("Could not parse response:", JSON.stringify(data.content?.map(b => b.type)));
    return res.json({ ok: false, error: "Could not parse data from API response" });

  } catch (err) {
    console.error("Proxy error:", err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: "ok", hasApiKey: !!process.env.ANTHROPIC_API_KEY });
});

// SPA fallback - serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Brewhouse Planner running on port ${PORT}`);
  console.log(`API key configured: ${!!process.env.ANTHROPIC_API_KEY}`);
});
