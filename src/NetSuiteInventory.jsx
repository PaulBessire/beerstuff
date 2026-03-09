import { useState, useCallback } from "react";

const PRELOADED_RAW = [
  { itemid: "SILO 2 Rahr Blend Pilsner Bulk", totalquantityonhand: 21217, averagecost: 0.39 },
  { itemid: "Lactose", totalquantityonhand: 6545, averagecost: 0.132 },
  { itemid: "Whirlfloc T", totalquantityonhand: 7428.5, averagecost: 0.146 },
  { itemid: "Corn Sugar (Dextrose)", totalquantityonhand: 2810, averagecost: 1.003 },
  { itemid: "Flaked Maize OIO", totalquantityonhand: 2400, averagecost: 1.773 },
  { itemid: "Weyermann - Pale Wheat", totalquantityonhand: 1870, averagecost: 0.862 },
  { itemid: "Simpsons - Caramalt", totalquantityonhand: 1307.9, averagecost: 1.203 },
  { itemid: "Grain Millers Flaked Oats", totalquantityonhand: 1000, averagecost: 0.832 },
  { itemid: "Weyermann - Caramunich 1", totalquantityonhand: 935, averagecost: 0.987 },
  { itemid: "Weyermann - Munich Lt Type 1", totalquantityonhand: 935, averagecost: 0.942 },
  { itemid: "Rice Syrup Solids 50#", totalquantityonhand: 750, averagecost: 3.25 },
  { itemid: "Rice Hulls", totalquantityonhand: 659, averagecost: 0.74 },
  { itemid: "Ghirardelli Chocolate Sauce", totalquantityonhand: 512, averagecost: 0.274 },
  { itemid: "Focus IRC Beer Base 21%", totalquantityonhand: 350.43, averagecost: 7.872 },
  { itemid: "Citra", totalquantityonhand: 357.96, averagecost: 14.02 },
  { itemid: "Hallertau Mittelfruh", totalquantityonhand: 330.6, averagecost: 13.09 },
  { itemid: "Mosaic", totalquantityonhand: 289.52, averagecost: 14.0 },
  { itemid: "Azacca", totalquantityonhand: 242, averagecost: 14.94 },
  { itemid: "Galaxy", totalquantityonhand: 217, averagecost: 18.17 },
  { itemid: "Cascade", totalquantityonhand: 145, averagecost: 9.0 },
  { itemid: "SUCRALOSE DR400", totalquantityonhand: 107.25, averagecost: 29.318 },
  { itemid: "Idaho 7", totalquantityonhand: 77, averagecost: 11.76 },
  { itemid: "Barbe Rouge", totalquantityonhand: 57.5, averagecost: 11 },
  { itemid: "Amarillo", totalquantityonhand: 55, averagecost: 14.69 },
  { itemid: "Magnum", totalquantityonhand: 50, averagecost: 11.06 },
  { itemid: "Challenger", totalquantityonhand: 44, averagecost: 0 },
  { itemid: "Simcoe", totalquantityonhand: 26.5, averagecost: 13.28 },
  { itemid: "East Kent Golding", totalquantityonhand: 25.4, averagecost: 13.03 },
  { itemid: "Centennial", totalquantityonhand: 22, averagecost: 11 },
  { itemid: "Sinamar - Weyermann", totalquantityonhand: 112.5, averagecost: 7.974 },
  { itemid: "Fermcap AT", totalquantityonhand: 123.46, averagecost: 1.902 },
  { itemid: "Gypsum (Calcium Sulfate)", totalquantityonhand: 119.28, averagecost: 0.463 },
  { itemid: "Calcium Chloride", totalquantityonhand: 82.16, averagecost: 1.076 },
  { itemid: "Yeastex 82", totalquantityonhand: 66.68, averagecost: 0.98 },
  { itemid: "Can End Silver/Silver", totalquantityonhand: 232416, averagecost: 0.042 },
  { itemid: "PakTech 6Pak Black", totalquantityonhand: 1106700, averagecost: 0 },
  { itemid: "Daizy's Watermelon Can Shell", totalquantityonhand: 360917, averagecost: 0 },
  { itemid: "Daizy's Grape Can Shell", totalquantityonhand: 190242, averagecost: 0 },
  { itemid: "Scooter Can Shell", totalquantityonhand: 83146, averagecost: 0.198 },
  { itemid: "Birdie Can Shell (Shrink)", totalquantityonhand: 25285, averagecost: 0.285 },
  { itemid: "Keg Collar", totalquantityonhand: 8923, averagecost: 0.177 },
  { itemid: "Barrel Bourbon Buffalo Trace 53G", totalquantityonhand: 41, averagecost: 72.05 },
  { itemid: "Phosphoric Acid", totalquantityonhand: 52996, averagecost: 0.028 },
  { itemid: "Attenuzyme Pro", totalquantityonhand: 250000, averagecost: 0.005 },
];

const PRELOADED_FG = [
  { itemid: "Scooter C4/6/12", totalquantityonhand: 859, averagecost: 3.059 },
  { itemid: "Birdie Loose Case SLEEK", totalquantityonhand: 638, averagecost: 11.709 },
  { itemid: "Dark Charge 2024 Graeter's Chip Set", totalquantityonhand: 614, averagecost: 30.645 },
  { itemid: "Dark Charge 2024 Base 12/500mL", totalquantityonhand: 58.83, averagecost: 39.372 },
  { itemid: "Hop Ridge K12", totalquantityonhand: 36, averagecost: 34.115 },
  { itemid: "Dark Charge 2022 Base 12/22 Btl", totalquantityonhand: 32.92, averagecost: 41.96 },
  { itemid: "Toasted Marshmallow K16", totalquantityonhand: 29, averagecost: 65.832 },
  { itemid: "Berliner Weisse K12", totalquantityonhand: 26.75, averagecost: 16.427 },
  { itemid: "Road Trip C4/6/12", totalquantityonhand: 20.5, averagecost: 18.575 },
  { itemid: "BTTC Mosaic IPA K12", totalquantityonhand: 13.25, averagecost: 99.99 },
  { itemid: "Birdie K12", totalquantityonhand: 3.25, averagecost: 31.498 },
  { itemid: "Fuerte Mexican Lager K12", totalquantityonhand: 2.25, averagecost: 24.16 },
];

const PRELOADED_BOM = [
  { beer: "Storm", ingredient: "SILO 1 Rahr Pale Ale Bulk", quantity: 36.25, onhand: 0 },
  { beer: "Storm", ingredient: "Flaked Maize OIO", quantity: 11, onhand: 2400 },
  { beer: "Storm", ingredient: "Rice Hulls", quantity: 1.25, onhand: 659 },
  { beer: "Storm", ingredient: "Hallertau Mittelfruh", quantity: 0.37, onhand: 330.6 },
  { beer: "Switch", ingredient: "SILO 1 Rahr Pale Ale Bulk", quantity: 57.1, onhand: 0 },
  { beer: "Switch", ingredient: "Caramunich 1", quantity: 1.4, onhand: 935 },
  { beer: "Switch", ingredient: "Centennial", quantity: 0.995, onhand: 22 },
  { beer: "Switch", ingredient: "Simcoe", quantity: 0.6, onhand: 26.5 },
  { beer: "Switch", ingredient: "Cascade", quantity: 1.105, onhand: 145 },
  { beer: "Switch", ingredient: "Corn Sugar", quantity: 2.5, onhand: 2810 },
  { beer: "Tropic Flare", ingredient: "SILO 2 Rahr Pilsner Bulk", quantity: 57.5, onhand: 21217 },
  { beer: "Tropic Flare", ingredient: "Flaked Oats", quantity: 6.25, onhand: 1000 },
  { beer: "Tropic Flare", ingredient: "Pale Wheat", quantity: 6.875, onhand: 1870 },
  { beer: "Tropic Flare", ingredient: "Lactose", quantity: 5.5, onhand: 6545 },
  { beer: "Tropic Flare", ingredient: "Citra", quantity: 1.89, onhand: 357.96 },
  { beer: "Tropic Flare", ingredient: "Mosaic", quantity: 1.845, onhand: 289.52 },
  { beer: "Tropic Flare", ingredient: "Amarillo", quantity: 0.21, onhand: 55 },
  { beer: "Spur Amber Lager", ingredient: "SILO 2 Rahr Pilsner Bulk", quantity: 31.125, onhand: 21217 },
  { beer: "Spur Amber Lager", ingredient: "Caramunich 1", quantity: 2.75, onhand: 935 },
  { beer: "Spur Amber Lager", ingredient: "Magnum", quantity: 0.1125, onhand: 50 },
  { beer: "Spur Amber Lager", ingredient: "Sinamar", quantity: 0.19, onhand: 112.5 },
  { beer: "Haven Hefeweizen", ingredient: "SILO 1 Rahr Pale Ale Bulk", quantity: 29.5, onhand: 0 },
  { beer: "Haven Hefeweizen", ingredient: "Pale Wheat", quantity: 22, onhand: 1870 },
  { beer: "Haven Hefeweizen", ingredient: "Caramalt", quantity: 1, onhand: 1307.9 },
  { beer: "Haven Hefeweizen", ingredient: "Magnum", quantity: 0.14, onhand: 50 },
];

function categorize(name) {
  if (!name) return "other";
  const n = name.toLowerCase();
  if (/silo|malt|pilsner bulk|pale ale bulk|wheat|caramunich|munich|crisp|rahr|maize|caramalt/.test(n)) return "malt";
  if (/hop|citra|mosaic|simcoe|cascade|centennial|amarillo|magnum|hallertau|galaxy|azacca|saaz|warrior|golding|barbe|challenger|idaho/.test(n)) return "hops";
  if (/can |paktech|label|carton|box|bottle|cap|collar|keg c/.test(n)) return "packaging";
  if (/lactose|corn sugar|dextrose|flaked|rice |coffee|coconut|cinnamon|sucralose|exberry|sinamar|chocolate|ghirardelli|focus irc/.test(n)) return "adjunct";
  if (/calcium|gypsum|sodium|phosphoric|fermcap|whirlfloc|yeastex|clarity|attenuzyme/.test(n)) return "chemistry";
  if (/barrel/.test(n)) return "barrel";
  return "other";
}
const CC = { malt:"#d4a053", hops:"#4caf50", packaging:"#42a5f5", adjunct:"#ff9800", chemistry:"#26c6da", barrel:"#8d6e63", other:"#616161" };
const m = { fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem" };

const NS = { type:"url", url:"https://8311319.suitetalk.api.netsuite.com/services/mcp/v1/suiteapp/com.netsuite.mcpstandardtools", name:"netsuite" };

async function queryNS(sql, log) {
  try {
    log("Calling API...");
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:8000, system:"Run the SuiteQL. Return JSON only.", messages:[{role:"user",content:"Run: "+sql}], mcp_servers:[NS] })
    });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const d = await r.json();
    log("Got " + ((d.content||[]).length) + " blocks");
    for (const b of (d.content||[])) {
      if (b.type === "mcp_tool_result") {
        const subs = Array.isArray(b.content) ? b.content : [b.content];
        for (const s of subs) {
          const t = typeof s === "string" ? s : (s && s.text ? s.text : "");
          if (!t) continue;
          try { const p = JSON.parse(t); if (p.data) { log(p.data.length+" rows","success"); return p.data; } if (Array.isArray(p)) { log(p.length+" rows","success"); return p; } } catch {}
        }
      }
      if (b.type === "text" && b.text) {
        const match = b.text.match(/\[[\s\S]*?\]/);
        if (match) try { const a = JSON.parse(match[0]); log(a.length+" rows from text","success"); return a; } catch {}
      }
    }
    throw new Error("Could not parse response");
  } catch (e) { log("Error: "+e.message,"error"); return null; }
}

function Badge({cat}) {
  const c = CC[cat] || "#616161";
  return <span style={{padding:"1px 6px",borderRadius:3,fontSize:"0.65rem",fontWeight:600,...m,background:c+"22",color:c,border:"1px solid "+c+"44",textTransform:"capitalize"}}>{cat}</span>;
}

function InvTable({data, showCat}) {
  const [search, setSearch] = useState("");
  const [catF, setCatF] = useState("all");
  if (!data || !data.length) return <div style={{color:"#475569",padding:20,textAlign:"center"}}>No data</div>;
  const rows = data.map(r => ({ name: String(r.itemid||r.itemId||""), qty: Number(r.totalquantityonhand||r.totalQuantityOnHand||0)||0, cost: Number(r.averagecost||r.averageCost||0)||0, cat: categorize(String(r.itemid||r.itemId||"")) }));
  const cats = [...new Set(rows.map(r=>r.cat))].sort();
  const sl = search.toLowerCase();
  const f = rows.filter(r=>(catF==="all"||r.cat===catF)&&(!sl||r.name.toLowerCase().includes(sl))).sort((a,b)=>b.qty-a.qty);
  const tv = f.reduce((s,r)=>s+r.qty*r.cost,0);
  return (<div>
    <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap",alignItems:"center"}}>
      <input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} style={{padding:"5px 10px",borderRadius:6,border:"1px solid #2d3748",background:"#0b0f14",color:"#e2e8f0",...m,outline:"none",width:200}} />
      {showCat && <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
        {["all",...cats].map(c=><button key={c} onClick={()=>setCatF(c)} style={{padding:"2px 8px",borderRadius:4,border:"1px solid "+(catF===c?(CC[c]||"#c8854a"):"#2d3748"),background:catF===c?(CC[c]||"#c8854a")+"22":"transparent",color:catF===c?(CC[c]||"#c8854a"):"#64748b",cursor:"pointer",fontSize:"0.65rem",fontFamily:"'DM Sans'",textTransform:"capitalize"}}>{c} ({c==="all"?rows.length:rows.filter(r=>r.cat===c).length})</button>)}
      </div>}
      <span style={{marginLeft:"auto",fontSize:"0.7rem",color:"#64748b"}}>{f.length} items · ${Math.round(tv).toLocaleString()}</span>
    </div>
    <div style={{maxHeight:"50vh",overflow:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.8rem"}}>
        <thead style={{position:"sticky",top:0,background:"#111820",zIndex:1}}><tr>
          <th style={{padding:"7px 12px",textAlign:"left",color:"#94a3b8",fontSize:"0.7rem",fontWeight:600,textTransform:"uppercase",borderBottom:"1px solid #1e293b"}}>Item</th>
          {showCat && <th style={{padding:"7px 12px",textAlign:"left",color:"#94a3b8",fontSize:"0.7rem",fontWeight:600,textTransform:"uppercase",borderBottom:"1px solid #1e293b"}}>Cat</th>}
          <th style={{padding:"7px 12px",textAlign:"right",color:"#94a3b8",fontSize:"0.7rem",fontWeight:600,textTransform:"uppercase",borderBottom:"1px solid #1e293b"}}>On Hand</th>
          <th style={{padding:"7px 12px",textAlign:"right",color:"#94a3b8",fontSize:"0.7rem",fontWeight:600,textTransform:"uppercase",borderBottom:"1px solid #1e293b"}}>Value</th>
        </tr></thead>
        <tbody>{f.slice(0,150).map((r,i)=><tr key={i} style={{background:i%2?"#0d1117":"transparent"}}>
          <td style={{padding:"5px 12px",borderBottom:"1px solid #1e293b08",fontWeight:500,color:"#f8fafc"}}>{r.name}</td>
          {showCat && <td style={{padding:"5px 12px",borderBottom:"1px solid #1e293b08"}}><Badge cat={r.cat}/></td>}
          <td style={{padding:"5px 12px",borderBottom:"1px solid #1e293b08",textAlign:"right",...m,color:r.qty>100?"#81c784":r.qty>10?"#e2e8f0":"#fca5a5"}}>{r.qty.toLocaleString(undefined,{maximumFractionDigits:1})}</td>
          <td style={{padding:"5px 12px",borderBottom:"1px solid #1e293b08",textAlign:"right",...m,color:"#c8854a"}}>{r.qty*r.cost>0?"$"+Math.round(r.qty*r.cost).toLocaleString():"—"}</td>
        </tr>)}</tbody>
      </table>
    </div>
  </div>);
}

function RecipeView({data}) {
  const [sel, setSel] = useState(null);
  if (!data || !data.length) return <div style={{color:"#475569",padding:20,textAlign:"center"}}>No BOM data</div>;
  const beers = [...new Set(data.filter(r=>r.beer).map(r=>r.beer))].sort();
  const cur = sel || beers[0] || "";
  const ings = data.filter(r=>r.beer===cur);
  return (<div>
    <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>{beers.map(b=>
      <button key={b} onClick={()=>setSel(b)} style={{padding:"5px 12px",borderRadius:6,border:cur===b?"1px solid #c8854a":"1px solid #2d3748",background:cur===b?"#c8854a":"#1a2332",color:cur===b?"#0b0f14":"#e2e8f0",cursor:"pointer",fontFamily:"'DM Sans'",fontSize:"0.75rem",fontWeight:600}}>{b}</button>
    )}</div>
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.8rem"}}>
      <thead><tr>{["Ingredient","Cat","Recipe Qty","On Hand","Batches"].map((h,i)=>
        <th key={i} style={{padding:"7px 12px",textAlign:i>1?"right":"left",color:"#94a3b8",fontSize:"0.7rem",fontWeight:600,textTransform:"uppercase",borderBottom:"1px solid #1e293b"}}>{h}</th>
      )}</tr></thead>
      <tbody>{ings.map((r,i)=>{
        const cat = categorize(r.ingredient);
        const qty = Number(r.quantity)||0;
        const oh = Number(r.onhand)||0;
        const batches = qty>0&&oh>0 ? Math.floor(oh/qty) : oh>0 ? "∞" : 0;
        const warn = typeof batches==="number" && batches<5;
        return <tr key={i} style={{background:i%2?"#0d1117":"transparent"}}>
          <td style={{padding:"5px 12px",borderBottom:"1px solid #1e293b08",fontWeight:500}}>{r.ingredient}</td>
          <td style={{padding:"5px 12px",borderBottom:"1px solid #1e293b08"}}><Badge cat={cat}/></td>
          <td style={{padding:"5px 12px",borderBottom:"1px solid #1e293b08",textAlign:"right",...m}}>{qty.toFixed(3)}</td>
          <td style={{padding:"5px 12px",borderBottom:"1px solid #1e293b08",textAlign:"right",...m,color:oh>0?"#81c784":"#fca5a5"}}>{oh.toLocaleString(undefined,{maximumFractionDigits:1})}</td>
          <td style={{padding:"5px 12px",borderBottom:"1px solid #1e293b08",textAlign:"right",...m,fontWeight:600,color:warn?"#fca5a5":"#81c784"}}>{String(batches)}{warn?" ⚠":""}</td>
        </tr>;
      })}</tbody>
    </table>
  </div>);
}

export default function NetSuiteInventory() {
  const [tab, setTab] = useState("raw");
  const [raw, setRaw] = useState(PRELOADED_RAW);
  const [fg, setFg] = useState(PRELOADED_FG);
  const [bom, setBom] = useState(PRELOADED_BOM);
  const [ld, setLd] = useState({});
  const [st, setSt] = useState({raw:"Pre-loaded",fg:"Pre-loaded",bom:"Pre-loaded"});
  const [logs, setLogs] = useState([{time:new Date().toLocaleTimeString(),msg:"Loaded pre-cached NetSuite data (3/9/2026)",type:"success"}]);
  const [err, setErr] = useState(null);

  const log = useCallback((msg,type)=>setLogs(p=>[{time:new Date().toLocaleTimeString(),msg,type:type||"info"},...p].slice(0,50)),[]);

  const sync = useCallback(async(key,sql,set)=>{
    setLd(p=>({...p,[key]:true})); setErr(null);
    const d = await queryNS(sql, log);
    if (d && Array.isArray(d) && d.length) { set(d); setSt(p=>({...p,[key]:new Date().toLocaleTimeString()})); }
    else if (!d) setErr("Live sync failed — showing cached data");
    setLd(p=>({...p,[key]:false}));
  },[log]);

  const rawV = (raw||[]).reduce((s,r)=>s+(Number(r.totalquantityonhand||0)*Number(r.averagecost||0)),0);
  const bomN = bom ? [...new Set(bom.filter(r=>r.beer).map(r=>r.beer))].length : 0;
  const anyLd = Object.values(ld).some(Boolean);
  const Btn = ({label,onClick,loading}) => <button onClick={onClick} disabled={loading} style={{padding:"6px 14px",borderRadius:6,border:"1px solid #c8854a",background:"#c8854a",color:"#0b0f14",cursor:loading?"wait":"pointer",fontFamily:"'DM Sans'",fontSize:"0.8rem",fontWeight:600,opacity:loading?0.6:1}}>{loading?"Syncing...":label}</button>;

  return (<div style={{fontFamily:"'DM Sans', sans-serif",background:"#0b0f14",color:"#e2e8f0",minHeight:"100vh"}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap'); *{box-sizing:border-box;margin:0;padding:0} ::-webkit-scrollbar{width:6px;height:6px} ::-webkit-scrollbar-track{background:#111820} ::-webkit-scrollbar-thumb{background:#2d3748;border-radius:3px} button:hover:not(:disabled){opacity:0.85}`}</style>

    <div style={{background:"#111820",borderBottom:"1px solid #1e293b",padding:"14px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:34,height:34,borderRadius:7,background:"linear-gradient(135deg,#c8854a,#8b5e34)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem"}}>🔗</div>
        <div><div style={{fontWeight:700,fontSize:"1rem",color:"#f8fafc"}}>NetSuite Live Inventory</div><div style={{fontSize:"0.65rem",color:"#475569"}}>Pre-loaded + live MCP sync</div></div>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <span style={{width:8,height:8,borderRadius:"50%",background:"#22c55e"}} /><span style={{fontSize:"0.7rem",color:"#22c55e"}}>Data loaded</span>
        <Btn label="↻ Sync All" loading={anyLd} onClick={()=>{
          sync("raw","SELECT i.itemId,i.totalQuantityOnHand,i.averageCost FROM item i LEFT JOIN itemType it ON i.itemType=it.id WHERE i.isInactive='F' AND it.id='InvtPart' AND i.totalQuantityOnHand>0 ORDER BY i.totalQuantityOnHand DESC",setRaw);
          sync("fg","SELECT i.itemId,i.totalQuantityOnHand,i.averageCost FROM item i LEFT JOIN itemType it ON i.itemType=it.id WHERE i.isInactive='F' AND it.id='Assembly' AND i.totalQuantityOnHand>0 ORDER BY i.totalQuantityOnHand DESC",setFg);
        }} />
      </div>
    </div>

    <div style={{display:"flex",gap:2,background:"#111820",padding:"0 24px",borderBottom:"1px solid #1e293b"}}>
      {[{id:"raw",l:"🌾 Raw Materials",n:(raw||[]).length},{id:"fg",l:"🍺 Finished Goods",n:(fg||[]).length},{id:"bom",l:"📋 BOM Recipes",n:bomN},{id:"log",l:"🔌 API Log",n:logs.length}].map(t=>
        <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"10px 16px",background:tab===t.id?"#1a2332":"transparent",color:tab===t.id?"#f8fafc":"#94a3b8",border:"none",borderBottom:tab===t.id?"2px solid #c8854a":"2px solid transparent",cursor:"pointer",fontFamily:"'DM Sans'",fontSize:"0.85rem",fontWeight:tab===t.id?600:400}}>{t.l} ({t.n})</button>
      )}
    </div>

    <div style={{padding:"20px 24px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
        {[{l:"Raw Materials",v:(raw||[]).length,c:"#c8854a",s:st.raw},{l:"Finished Goods",v:(fg||[]).length,c:"#3b82f6",s:st.fg},{l:"Raw Inventory Value",v:"$"+Math.round(rawV).toLocaleString(),c:"#22c55e"},{l:"BOM Recipes",v:bomN+" beers",c:"#ffe599",s:st.bom}].map((x,i)=>
          <div key={i} style={{background:"#111820",border:"1px solid #1e293b",borderRadius:8,padding:"12px 16px"}}>
            <div style={{fontSize:"0.7rem",color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4}}>{x.l}</div>
            <div style={{fontSize:"1.3rem",fontWeight:700,color:x.c,...m}}>{x.v}</div>
            {x.s && <div style={{fontSize:"0.65rem",color:"#475569",marginTop:2}}>{x.s}</div>}
          </div>
        )}
      </div>

      {err && <div style={{background:"#111820",border:"1px solid #ef444466",borderRadius:8,padding:"12px 16px",marginBottom:16,color:"#fca5a5",fontSize:"0.85rem"}}>⚠ {err}</div>}

      <div style={{background:"#111820",border:"1px solid #1e293b",borderRadius:8,padding:16}}>
        {tab==="raw" && <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div><div style={{fontSize:"1rem",fontWeight:600,color:"#f8fafc"}}>Raw Material Inventory</div><div style={{fontSize:"0.75rem",color:"#475569"}}>From NetSuite · brewing ingredients, hops, malts, packaging</div></div>
            <Btn label="↻ Refresh" loading={ld.raw} onClick={()=>sync("raw","SELECT i.itemId,i.totalQuantityOnHand,i.averageCost FROM item i LEFT JOIN itemType it ON i.itemType=it.id WHERE i.isInactive='F' AND it.id='InvtPart' AND i.totalQuantityOnHand>0 ORDER BY i.totalQuantityOnHand DESC",setRaw)} />
          </div>
          <InvTable data={raw} showCat={true} />
        </div>}
        {tab==="fg" && <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div><div style={{fontSize:"1rem",fontWeight:600,color:"#f8fafc"}}>Finished Goods</div><div style={{fontSize:"0.75rem",color:"#475569"}}>Packaged beers — kegs, cases, canned products</div></div>
            <Btn label="↻ Refresh" loading={ld.fg} onClick={()=>sync("fg","SELECT i.itemId,i.totalQuantityOnHand,i.averageCost FROM item i LEFT JOIN itemType it ON i.itemType=it.id WHERE i.isInactive='F' AND it.id='Assembly' AND i.totalQuantityOnHand>0 ORDER BY i.totalQuantityOnHand DESC",setFg)} />
          </div>
          <InvTable data={fg} showCat={false} />
        </div>}
        {tab==="bom" && <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div><div style={{fontSize:"1rem",fontWeight:600,color:"#f8fafc"}}>Beer Recipes (BOM)</div><div style={{fontSize:"0.75rem",color:"#475569"}}>Real NetSuite BOMs with batch feasibility</div></div>
            <Btn label="↻ Refresh" loading={ld.bom} onClick={()=>sync("bom","SELECT asm.itemId AS beer,comp.itemId AS ingredient,brc.quantity,comp.totalQuantityOnHand AS onhand FROM assemblyItemBom ab JOIN item asm ON ab.assembly=asm.id JOIN bomRevisionComponentMember brc ON brc.bomRevision=ab.currentRevision JOIN item comp ON brc.item=comp.id WHERE ab.masterDefault='T' AND ab.currentRevision IS NOT NULL AND ROWNUM<=300 ORDER BY asm.itemId,brc.lineId",setBom)} />
          </div>
          <RecipeView data={bom} />
        </div>}
        {tab==="log" && <div>
          <div style={{fontSize:"1rem",fontWeight:600,color:"#f8fafc",marginBottom:12}}>API Connection Log</div>
          <div style={{...m,fontSize:"0.75rem",marginBottom:12,padding:"8px 12px",background:"#0b0f14",borderRadius:6,border:"1px solid #1e293b"}}>
            <span style={{color:"#475569"}}>MCP: </span><span style={{color:"#81c784"}}>{NS.url.split("/services")[0]}</span>
          </div>
          {logs.map((l,i)=><div key={i} style={{padding:"5px 0",borderBottom:"1px solid #1e293b08",display:"flex",gap:10,alignItems:"baseline",fontSize:"0.75rem",...m}}>
            <span style={{color:"#475569",width:70,flexShrink:0}}>{l.time}</span>
            <span style={{width:6,height:6,borderRadius:"50%",background:l.type==="success"?"#22c55e":l.type==="error"?"#ef4444":"#3b82f6",flexShrink:0}} />
            <span style={{color:l.type==="error"?"#fca5a5":l.type==="success"?"#81c784":"#e2e8f0"}}>{l.msg}</span>
          </div>)}
        </div>}
      </div>
    </div>
  </div>);
}
