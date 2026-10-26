"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sparkles, MessageSquare, Image as ImageIcon, Video, Film, WandSparkles,
  Sun, Moon, Plus, ArrowUp, Paperclip, Mic, ChevronDown, Crown, Check,
  ShieldCheck, Copy, Download, Menu, X, Clock3, Captions, Play, Pause,
  Scissors, Settings2, CircleHelp, Zap, RotateCcw, UploadCloud
} from "lucide-react";

type Tab = "chat" | "image" | "video" | "upgrade";
type Message = { role: "user" | "assistant"; text: string };

const starters = [
  { icon: "✦", title: "Write a powerful hook", sub: "for my next video" },
  { icon: "▧", title: "Create an image prompt", sub: "for a futuristic city" },
  { icon: "↗", title: "Plan a 30-second reel", sub: "with scene-by-scene timing" },
];

export default function Home() {
  const [tab, setTab] = useState<Tab>("chat");
  const [dark, setDark] = useState(true);
  const [mobileNav, setMobileNav] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [aspect, setAspect] = useState("16:9");
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageResult, setImageResult] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [duration, setDuration] = useState("10");
  const [captions, setCaptions] = useState(false);
  const [videoFile, setVideoFile] = useState("");
  const [payName, setPayName] = useState("");
  const [payEmail, setPayEmail] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [paymentSent, setPaymentSent] = useState(false);
  const [notice, setNotice] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function sendChat(text = prompt) {
    const value = text.trim();
    if (!value || busy) return;
    setMessages(m => [...m, { role: "user", text: value }]);
    setPrompt("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: value, history: messages.slice(-12) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setMessages(m => [...m, { role: "assistant", text: data.text }]);
    } catch (e) {
      setMessages(m => [...m, { role: "assistant", text: e instanceof Error ? e.message : "Something went wrong." }]);
    } finally { setBusy(false); }
  }

  async function createImage() {
    if (!imagePrompt.trim()) return;
    setNotice("Image generation needs an image provider. This workspace is ready for provider integration; no fake image has been generated.");
    setImageResult("");
  }

  async function requestPayment() {
    if (!payName.trim() || !payEmail.trim() || !transactionId.trim()) {
      setNotice("Please complete your name, email, and transaction ID."); return;
    }
    try {
      const res = await fetch("/api/payment-request", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: payName, email: payEmail, transactionId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not submit request");
      setPaymentSent(true);
      setNotice("Payment request submitted. Pro remains locked until the payment is independently verified.");
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Unable to submit payment request.");
    }
  }

  const nav = [
    { id: "chat" as Tab, label: "AI Chat", icon: MessageSquare },
    { id: "image" as Tab, label: "Image Studio", icon: ImageIcon },
    { id: "video" as Tab, label: "Video Workspace", icon: Film },
  ];

  return (
    <main className={dark ? "app dark" : "app light"}>
      <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
        <div className="brand"><div className="brand-mark"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 2 36 13 30 31 20 38 10 31 4 13Z" /><path d="M20 2 20 38M4 13 36 13M10 31 30 31M4 13 20 24 36 13M10 31 20 24 30 31" /></svg></div><span>VOXON <b>AI</b></span><button className="mobile-close" onClick={() => setMobileNav(false)}><X size={18}/></button></div>
        <button className="new-chat" onClick={() => { setTab("chat"); setMessages([]); setMobileNav(false); }}><Plus size={17}/> New conversation</button>
        <div className="nav-label">WORKSPACE</div>
        {nav.map(item => <button key={item.id} className={`nav-item ${tab === item.id ? "active" : ""}`} onClick={() => { setTab(item.id); setMobileNav(false); }}><item.icon size={18}/><span>{item.label}</span>{item.id === "image" && <span className="tiny-tag">NEW</span>}</button>)}
        <div className="nav-label tools-label">YOUR SPACE</div>
        <button className="nav-item" onClick={() => setNotice("Your saved creations will appear here once storage is connected.")}><Clock3 size={18}/> Recent creations</button>
        <button className="nav-item" onClick={() => setNotice("Settings will be available after authentication is configured.")}><Settings2 size={18}/> Settings</button>
        <div className="sidebar-bottom"><div className="upgrade-card"><div className="upgrade-icon"><Crown size={17}/></div><strong>Unlock your potential</strong><p>Go Pro for longer video exports and a faster creative workflow.</p><button onClick={() => setTab("upgrade")}>Explore Pro <span>↗</span></button></div><div className="profile"><div className="avatar">V</div><div className="profile-info"><strong>Guest creator</strong><span>Free plan</span></div><button aria-label="Profile settings" onClick={() => setNotice("Add an authentication provider to enable accounts.")}><ChevronDown size={16}/></button></div></div>
      </aside>
      {mobileNav && <button className="scrim" aria-label="Close menu" onClick={() => setMobileNav(false)} />}
      <section className="main-area">
        <header className="topbar"><button className="menu-button" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu size={20}/></button><div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{nav.find(n => n.id === tab)?.label || "Upgrade to Pro"}</strong></div><div className="top-actions"><span className="plan-pill"><span className="status-dot"/> Free plan</span><button className="theme-toggle" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun size={17}/> : <Moon size={17}/>}</button><button className="top-pro" onClick={() => setTab("upgrade")}><Crown size={15}/> Upgrade</button></div></header>

        {tab === "chat" && <div className="chat-page">
          {messages.length === 0 ? <div className="welcome"><div className="eyebrow"><span className="eyebrow-line"/> YOUR CREATIVE INTELLIGENCE <span className="eyebrow-line"/></div><h1>Ideas are just the<br/><span>beginning.</span></h1><p className="welcome-sub">Meet your creative AI partner. Think bigger, create faster, and bring your next idea to life.</p><div className="starter-grid">{starters.map((s, i) => <button className="starter" key={s.title} onClick={() => sendChat(`${s.title} ${s.sub}`)}><span className={`starter-symbol symbol-${i}`}>{s.icon}</span><span><strong>{s.title}</strong><small>{s.sub}</small></span><span className="starter-arrow">↗</span></button>)}</div></div> :
          <div className="conversation">{messages.map((m, i) => <div className={`message ${m.role}`} key={i}><div className="message-avatar">{m.role === "user" ? "Y" : <Sparkles size={16}/>}</div><div className="message-content"><div className="message-role">{m.role === "user" ? "You" : "VOXON AI"}</div><p>{m.text}</p>{m.role === "assistant" && <button className="copy-btn" onClick={() => navigator.clipboard?.writeText(m.text)}><Copy size={13}/> Copy</button>}</div></div>)}{busy && <div className="typing"><span/><span/><span/> VOXON is thinking…</div>}<div ref={endRef}/></div>}
          <div className="composer-wrap"><div className="composer"><textarea value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } }} placeholder="Ask VOXON anything… try an idea, a question, or a challenge" rows={2}/><div className="composer-bottom"><div className="composer-tools"><button onClick={() => setTab("image")}><Paperclip size={15}/> Attach / create</button><span className="model-select"><Sparkles size={13}/> Gemini-powered <ChevronDown size={13}/></span></div><button className="send-btn" onClick={() => sendChat()} disabled={!prompt.trim() || busy} aria-label="Send message"><ArrowUp size={19}/></button></div></div><p className="disclaimer">VOXON AI can make mistakes. Verify important information.</p></div>
        </div>}

        {tab === "image" && <div className="studio-page"><div className="page-heading"><div><div className="eyebrow left"><Sparkles size={13}/> VOXON CREATIVE SUITE</div><h1>Image <span>Studio</span></h1><p>Turn a simple thought into a visual masterpiece.</p></div><span className="beta-pill">BETA WORKSPACE</span></div><div className="studio-layout"><section className="panel prompt-panel"><label className="field-label">DESCRIBE YOUR IMAGE</label><textarea className="large-input" value={imagePrompt} onChange={e => setImagePrompt(e.target.value)} placeholder="A cinematic glass crystal floating above a futuristic city at midnight, emerald and violet lighting, ultra-detailed…"/><div className="field-row"><label className="field-label">ASPECT RATIO</label><span className="muted">Choose your canvas</span></div><div className="ratio-grid">{[["1:1","Square"],["16:9","Landscape"],["9:16","Portrait"],["4:3","Classic"]].map(([v,l])=><button key={v} className={`ratio-option ${aspect === v ? "selected" : ""}`} onClick={() => setAspect(v)}><span className={`ratio-shape ratio-${v.replace(":","")}`}/><strong>{v}</strong><small>{l}</small></button>)}</div><button className="primary-btn full" onClick={createImage}><WandSparkles size={17}/> Generate image <span className="btn-spark">✦</span></button><p className="small-note">Image provider not connected yet. Add a supported image API to enable generation.</p></section><section className="panel preview-panel"><div className="preview-top"><strong>Canvas preview</strong><span className="muted">{aspect}</span></div><div className="image-empty"><div className="empty-orbit"><div className="orbit-core"><Sparkles size={28}/></div></div><h3>Your next visual starts here</h3><p>Describe your vision and generate an image to see it come to life.</p><span className="preview-chip"><ImageIcon size={13}/> AI IMAGE CANVAS</span></div></section></div></div>}

        {tab === "video" && <div className="video-page"><div className="page-heading"><div><div className="eyebrow left"><Film size={13}/> CREATOR WORKSPACE</div><h1>Video <span>Workspace</span></h1><p>A creative timeline designed for your next big story.</p></div><span className="beta-pill">EDITOR PREVIEW</span></div><div className="editor-shell"><div className="editor-toolbar"><div className="editor-file"><div className="file-icon"><Film size={17}/></div><div><strong>Untitled project</strong><span>1080p · 30 FPS</span></div></div><div className="editor-actions"><button onClick={() => setCaptions(!captions)} className={captions ? "tool-active" : ""}><Captions size={15}/> Auto captions</button><button onClick={() => setNotice("Export is a preview. Connect a video processing/rendering service for real exports.")}><Download size={15}/> Export</button></div></div><div className="editor-body"><div className="video-preview"><div className="preview-art"><div className="preview-glow"/><div className="preview-crystal">◇</div><span className="preview-watermark">VOXON STUDIO</span></div><button className="play-button" onClick={() => setNotice("Preview playback requires an imported video clip.")}><Play size={22} fill="currentColor"/></button><div className="preview-controls"><span>00:00:00:00</span><span>00:00:10:00</span></div></div><div className="timeline"><div className="timeline-top"><div><strong>Timeline</strong><span className="muted"> Multi-track editor</span></div><div className="timeline-buttons"><button aria-label="Undo"><RotateCcw size={14}/></button><button aria-label="Timeline settings"><Settings2 size={14}/></button></div></div><div className="ruler"><span>00:00</span><span>00:02</span><span>00:04</span><span>00:06</span><span>00:08</span><span>00:10</span></div><div className="track"><span className="track-label"><Film size={13}/> Video</span><label className="clip clip-video"><span>◇</span> Cinematic intro <small>00:10</small></label></div><div className="track"><span className="track-label"><Captions size={13}/> Text</span>{captions ? <label className="clip clip-text">Auto captions · draft</label> : <div className="empty-track">Add captions or titles</div>}</div><div className="track"><span className="track-label">♫ Audio</span><div className="empty-track">Drop audio here</div></div><div className="playhead"/></div></div><div className="video-bottom"><div className="upload-box"><UploadCloud size={19}/><span><strong>{videoFile || "Import your footage"}</strong><small>MP4, MOV · local preview only</small></span><label className="secondary-btn">Browse<input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files?.[0]?.name || "")} hidden/></label></div><div className="generation-box"><label className="field-label">AI VIDEO GENERATION</label><textarea value={videoPrompt} onChange={e => setVideoPrompt(e.target.value)} placeholder="Describe your video scene…"/><div className="generation-row"><label>Duration <select value={duration} onChange={e => setDuration(e.target.value)}><option value="10">10 seconds · Free limit</option><option value="60">60 seconds · Pro</option></select></label><button className="primary-btn" onClick={() => setNotice(duration === "60" ? "60-second generation requires an active, verified Pro subscription and a connected video provider." : "Video generation provider not connected yet. Add an API integration to generate real video.")}><Sparkles size={15}/> Generate</button></div><p className="small-note">Free: up to 10 seconds. Pro: up to 60 seconds / Full HD, once video generation and plan verification are configured.</p></div></div></div></div>}

        {tab === "upgrade" && <div className="upgrade-page"><div className="upgrade-hero"><div className="pro-emblem"><Crown size={24}/></div><div className="eyebrow">THE CREATOR'S ADVANTAGE</div><h1>Make room for <span>more.</span></h1><p>Go beyond the limits. Build faster, create more, and bring bigger ideas to life with VOXON Pro.</p></div><div className="plans"><section className="plan-card"><div className="plan-top"><span className="plan-name">FREE</span><span className="plan-symbol"><Zap size={17}/></span></div><div className="plan-price">Rs 0 <small>/ forever</small></div><p className="plan-description">Your creative journey starts here.</p><ul><li><Check size={15}/> AI chat access (when configured)</li><li><Check size={15}/> Image Studio workspace</li><li><Check size={15}/> Up to 10-second video generation*</li><li><Check size={15}/> Standard queue*</li></ul><button className="secondary-btn full" onClick={() => setTab("chat")}>Current plan</button></section><section className="plan-card pro-plan"><div className="popular-tag">CREATOR FAVORITE</div><div className="plan-top"><span className="plan-name"><Crown size={15}/> VOXON PRO</span><span className="plan-symbol"><Sparkles size={17}/></span></div><div className="plan-price">Manual <small>payment review</small></div><p className="plan-description">For creators ready to go further.</p><ul><li><Check size={15}/> Everything in Free</li><li><Check size={15}/> Up to 60-second video generation*</li><li><Check size={15}/> Full HD export capability*</li><li><Check size={15}/> Pro badge after verification</li><li><Check size={15}/> Priority workflow*</li></ul><button className="primary-btn full" onClick={() => document.getElementById("payment")?.scrollIntoView({ behavior: "smooth" })}>Upgrade to Pro <ArrowUp size={16}/></button><p className="small-note">*Features require the relevant provider, server-side entitlement checks, and a verified plan.</p></section></div><section className="payment-panel" id="payment"><div className="payment-heading"><div className="payment-icon"><ShieldCheck size={20}/></div><div><h2>Manual payment verification</h2><p>Send your payment through EasyPaisa, then submit the transaction details below.</p></div></div><div className="payment-details"><div className="payment-detail"><span>PAYMENT METHOD</span><strong>EasyPaisa</strong></div><div className="payment-detail"><span>ACCOUNT HOLDER</span><strong>MUMTAZ BIBI</strong></div><div className="payment-detail"><span>ACCOUNT NUMBER</span><strong>03106210016</strong></div><div className="payment-detail"><span>SUPPORT EMAIL</span><strong>rafaqataliwattoo730@gmail.com</strong></div></div><div className="security-note"><ShieldCheck size={17}/><span>Submitting a transaction ID does not automatically unlock Pro. A trusted administrator must verify the payment against the provider record before upgrading the account.</span></div>{paymentSent ? <div className="submitted-state"><Check size={18}/><div><strong>Request submitted</strong><p>Your request is awaiting verification. Pro features remain locked until approved.</p></div></div> : <div className="payment-form"><div className="form-field"><label>YOUR NAME</label><input value={payName} onChange={e => setPayName(e.target.value)} placeholder="Name on your account"/></div><div className="form-field"><label>EMAIL ADDRESS</label><input type="email" value={payEmail} onChange={e => setPayEmail(e.target.value)} placeholder="you@example.com"/></div><div className="form-field wide"><label>EASYPAISA TRANSACTION ID</label><input value={transactionId} onChange={e => setTransactionId(e.target.value)} placeholder="Enter the transaction / reference ID"/></div><button className="primary-btn full wide" onClick={requestPayment}>Submit for verification <ArrowUp size={16}/></button><p className="small-note wide">Never submit your EasyPaisa PIN, password, or one-time passcode. Payment requests are stored for review; they are not proof of payment.</p></div>}</section></div>}

        <footer className="footer"><span>© 2026 VOXON AI. Built for the bold.</span><div><button onClick={() => setNotice("Privacy policy: publish a reviewed policy before collecting real user data.")}>Privacy</button><button onClick={() => setNotice("Help center coming soon.")}>Help center</button><button onClick={() => setNotice("Support: contact the site administrator.")}>Support <CircleHelp size={13}/></button></div></footer>
      </section>
      {notice && <div className="toast" role="status"><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Dismiss notification"><X size={16}/></button></div>}
    </main>
  );
}
