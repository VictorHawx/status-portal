import { useState, useEffect } from "react";

/*
  DeltaSmith Brand Tokens (from live site deltasmith.io)
  Background:     #FFFFFF (white)
  Surface:        #F1F5F9 (very light blue-gray)
  Navy/Primary:   #0F1D3D (dark navy — headings, CTA buttons)
  Blue accent:    #2563EB (bright blue — links, highlights, italic accent)
  Text primary:   #1E293B (near-black navy)
  Text secondary: #64748B (muted slate)
  Text tertiary:  #94A3B8 (light gray labels)
  Border:         #E2E8F0 (light gray)
  CTA button:     #0F1D3D background, white text, pill-shaped
  Labels:         Uppercase, letter-spaced, monospace feel
  Font:           Inter
  Style:          Clean, minimal, professional — lots of whitespace
*/

const DEMO_PROJECTS = {
  "DS-2026-001": {
    clientPin: "4821",
    clientName: "Ashwin Santiago",
    company: "Santiago Ventures",
    projectName: "Full Data Stack + AI Analytics",
    startDate: "2026-02-10",
    estimatedEnd: "2026-06-30",
    currentPhase: 1,
    phases: [
      {
        name: "Structure",
        subtitle: "Pipelines · modeling · validation",
        status: "completed",
        completedDate: "2026-04-15",
        steps: [
          { name: "Data & stack audit", status: "completed", date: "2026-02-20" },
          { name: "Tracking & measurement setup", status: "completed", date: "2026-03-05" },
          { name: "Data pipelines", status: "completed", date: "2026-03-22" },
          { name: "Warehousing & modeling", status: "completed", date: "2026-04-10" },
          { name: "Enrichment & validation", status: "completed", date: "2026-04-15" },
        ],
      },
      {
        name: "Surface",
        subtitle: "Dashboards · BI · reporting",
        status: "in-progress",
        completedDate: null,
        steps: [
          { name: "Dashboard architecture", status: "completed", date: "2026-04-25" },
          { name: "BI portal build", status: "in-progress", date: null },
          { name: "Reporting layer", status: "pending", date: null },
          { name: "Data-quality monitoring", status: "pending", date: null },
        ],
      },
      {
        name: "Activate",
        subtitle: "AI agents · automation",
        status: "pending",
        completedDate: null,
        steps: [
          { name: "AI opportunity mapping", status: "pending", date: null },
          { name: "Conversational analytics", status: "pending", date: null },
          { name: "Agent deployment", status: "pending", date: null },
          { name: "Workflow automation", status: "pending", date: null },
        ],
      },
    ],
    updates: [
      {
        date: "2026-04-28",
        title: "BI portal — first draft in review",
        description: "We've built the initial BI portal with 4 core views: revenue overview, customer acquisition funnel, retention cohorts, and marketing spend efficiency. Internal QA is underway; you'll receive a walkthrough invite this week.",
        phase: "Surface",
      },
      {
        date: "2026-04-25",
        title: "Dashboard architecture approved",
        description: "Based on our kickoff alignment, the dashboard architecture has been finalized. Three primary dashboards will cover executive summary, marketing performance, and operations.",
        phase: "Surface",
      },
      {
        date: "2026-04-15",
        title: "Structure phase complete",
        description: "All data pipelines are live and validated. Your warehouse is modeled, enriched, and passing automated quality checks. The foundation is ready for the analytics layer.",
        phase: "Structure",
      },
      {
        date: "2026-03-22",
        title: "Pipelines deployed to production",
        description: "Data pipelines for GA4, HubSpot, Shopify, and Klaviyo are now running on schedule. Incremental syncs every 6 hours with full refresh weekly.",
        phase: "Structure",
      },
    ],
  },
  "DS-2026-007": {
    clientPin: "1155",
    clientName: "Mariana López",
    company: "Grupo Montejo",
    projectName: "AI Readiness Audit + Structure",
    startDate: "2026-03-20",
    estimatedEnd: "2026-05-30",
    currentPhase: 0,
    phases: [
      {
        name: "Structure",
        subtitle: "Pipelines · modeling · validation",
        status: "in-progress",
        completedDate: null,
        steps: [
          { name: "Data & stack audit", status: "completed", date: "2026-04-02" },
          { name: "Tracking & measurement setup", status: "completed", date: "2026-04-12" },
          { name: "Data pipelines", status: "in-progress", date: null },
          { name: "Warehousing & modeling", status: "pending", date: null },
          { name: "Enrichment & validation", status: "pending", date: null },
        ],
      },
      {
        name: "Surface",
        subtitle: "Dashboards · BI · reporting",
        status: "pending",
        completedDate: null,
        steps: [
          { name: "Dashboard architecture", status: "pending", date: null },
          { name: "BI portal build", status: "pending", date: null },
          { name: "Reporting layer", status: "pending", date: null },
        ],
      },
      {
        name: "Activate",
        subtitle: "AI agents · automation",
        status: "pending",
        completedDate: null,
        steps: [
          { name: "AI opportunity mapping", status: "pending", date: null },
          { name: "Conversational analytics", status: "pending", date: null },
        ],
      },
    ],
    updates: [
      {
        date: "2026-04-20",
        title: "Pipeline development underway",
        description: "Building ETL pipelines for your Meta Ads and Google Ads accounts. Expected completion within 10 business days.",
        phase: "Structure",
      },
      {
        date: "2026-04-12",
        title: "Tracking setup deployed",
        description: "GA4 and GTM containers configured and verified across all properties. Event tracking aligned with your KPI framework.",
        phase: "Structure",
      },
    ],
  },
};

const StatusBadge = ({ status }) => {
  const config = {
    completed: { label: "Completed", bg: "#ECFDF5", color: "#059669", border: "#A7F3D0" },
    "in-progress": { label: "In progress", bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" },
    pending: { label: "Upcoming", bg: "#F8FAFC", color: "#94A3B8", border: "#E2E8F0" },
  };
  const c = config[status] || config.pending;
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, letterSpacing: "0.03em",
      padding: "3px 10px", borderRadius: 20, background: c.bg, color: c.color,
      border: `1px solid ${c.border}`, whiteSpace: "nowrap",
    }}>
      {c.label}
    </span>
  );
};

const PhaseCard = ({ phase, index, isActive }) => {
  const isCompleted = phase.status === "completed";
  const isInProgress = phase.status === "in-progress";
  const completedSteps = phase.steps.filter(s => s.status === "completed").length;
  const progress = (completedSteps / phase.steps.length) * 100;

  return (
    <div style={{
      background: "#FFFFFF",
      border: isActive ? "1.5px solid #2563EB" : "1px solid #E2E8F0",
      borderRadius: 8, padding: "22px 24px",
      position: "relative", overflow: "hidden",
    }}>
      {isActive && (
        <div style={{
          position: "absolute", top: 0, left: 0, width: 3, height: "100%",
          background: "#2563EB",
        }} />
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
            <span style={{
              fontSize: 12, fontWeight: 600,
              color: isCompleted ? "#059669" : isInProgress ? "#2563EB" : "#CBD5E1",
              letterSpacing: "0.02em",
            }}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: "#0F1D3D", margin: 0 }}>
              {phase.name}
            </h3>
          </div>
          <p style={{ fontSize: 13, color: "#94A3B8", margin: "2px 0 0 30px", letterSpacing: "0.01em" }}>
            {phase.subtitle}
          </p>
        </div>
        <StatusBadge status={phase.status} />
      </div>

      <div style={{
        width: "100%", height: 3, background: "#F1F5F9",
        borderRadius: 3, marginBottom: 16, overflow: "hidden",
      }}>
        <div style={{
          width: `${progress}%`, height: "100%", borderRadius: 3,
          background: isCompleted ? "#059669" : "#2563EB",
          transition: "width 0.6s ease",
        }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {phase.steps.map((step, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 18, height: 18, borderRadius: 4, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: step.status === "completed" ? "#ECFDF5"
                : step.status === "in-progress" ? "#EFF6FF"
                : "#F8FAFC",
              border: step.status === "completed" ? "1.5px solid #A7F3D0"
                : step.status === "in-progress" ? "1.5px solid #BFDBFE"
                : "1.5px solid #E2E8F0",
            }}>
              {step.status === "completed" && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5L4.2 7.5L8 2.5" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {step.status === "in-progress" && (
                <div style={{ width: 6, height: 6, borderRadius: 2, background: "#2563EB" }} />
              )}
            </div>
            <span style={{
              fontSize: 14, flex: 1,
              color: step.status === "completed" ? "#94A3B8"
                : step.status === "in-progress" ? "#1E293B"
                : "#CBD5E1",
              textDecoration: step.status === "completed" ? "line-through" : "none",
              textDecorationColor: "#CBD5E1",
            }}>
              {step.name}
            </span>
            {step.date && (
              <span style={{ fontSize: 12, color: "#CBD5E1" }}>
                {new Date(step.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const UpdateCard = ({ update }) => (
  <div style={{
    borderLeft: "2px solid #BFDBFE",
    paddingLeft: 20, paddingBottom: 4,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
      <span style={{ fontSize: 12, color: "#94A3B8", fontVariantNumeric: "tabular-nums" }}>
        {new Date(update.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
      </span>
      <span style={{
        fontSize: 10, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase",
        padding: "2px 8px", borderRadius: 3, background: "#EFF6FF",
        color: "#2563EB", border: "1px solid #BFDBFE",
      }}>
        {update.phase}
      </span>
    </div>
    <h4 style={{ fontSize: 15, fontWeight: 600, color: "#0F1D3D", margin: "0 0 6px 0" }}>
      {update.title}
    </h4>
    <p style={{ fontSize: 14, color: "#64748B", margin: 0, lineHeight: 1.65 }}>
      {update.description}
    </p>
  </div>
);

export default function DeltaSmithPortal() {
  const [view, setView] = useState("lookup");
  const [projectId, setProjectId] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("progress");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLookup = () => {
    setError("");
    const id = projectId.trim().toUpperCase();
    if (!id || !pin.trim()) {
      setError("Enter your project ID and verification PIN.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const found = DEMO_PROJECTS[id];
      if (found && found.clientPin === pin.trim()) {
        setProject(found);
        setView("dashboard");
      } else {
        setError("Project not found. Check your project ID and PIN.");
      }
      setLoading(false);
    }, 800);
  };

  const totalSteps = project ? project.phases.reduce((a, p) => a + p.steps.length, 0) : 0;
  const completedSteps = project ? project.phases.reduce((a, p) => a + p.steps.filter(s => s.status === "completed").length, 0) : 0;
  const overallProgress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  // ─── LOOKUP ───
  if (view === "lookup") {
    return (
      <div style={{
        minHeight: "100vh", background: "#FFFFFF",
        fontFamily: "'Inter', -apple-system, sans-serif",
        display: "flex", flexDirection: "column", paddingTop: 64,
      }}>
        <header style={{
          padding: "18px 32px", display: "flex", alignItems: "center",
          justifyContent: "space-between",
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          transition: "background 0.3s, box-shadow 0.3s",
          background: scrolled ? "rgba(255, 255, 255, 0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid #E2E8F0" : "1px solid transparent",
          boxShadow: scrolled ? "0 1px 3px rgba(0,0,0,0.04)" : "none",
        }}>
          <img src="https://deltasmith.io/assets/brand/DeltaSmith_logo1.png" alt="DeltaSmith" style={{ height: 28 }} />
          <span style={{
            fontSize: 11, color: "#94A3B8", letterSpacing: "0.12em",
            textTransform: "uppercase", fontWeight: 500,
          }}>
            Client Portal
          </span>
        </header>

        <div style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "40px 20px", background: "#F8FAFC",
        }}>
          <div style={{
            width: "100%", maxWidth: 420, textAlign: "center",
            background: "#FFFFFF", borderRadius: 10, padding: "40px 36px",
            border: "1px solid #E2E8F0",
            boxShadow: "0 1px 3px rgba(15,29,61,0.04), 0 4px 14px rgba(15,29,61,0.03)",
          }}>
            <h1 style={{
              fontSize: 24, fontWeight: 700, color: "#0F1D3D", margin: "0 0 6px 0",
              letterSpacing: "-0.02em",
            }}>
              Project <em style={{ fontStyle: "italic", color: "#2563EB", fontWeight: 600 }}>Status</em>
            </h1>
            <p style={{
              fontSize: 15, color: "#64748B", margin: "0 0 28px 0", lineHeight: 1.5,
            }}>
              Track your engagement with DeltaSmith.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input
                type="text"
                placeholder="Project ID (e.g. DS-2026-001)"
                value={projectId}
                onChange={e => { setProjectId(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleLookup()}
                style={{
                  width: "100%", padding: "12px 16px", fontSize: 14,
                  background: "#FFFFFF", border: "1px solid #E2E8F0",
                  borderRadius: 6, color: "#1E293B", outline: "none", boxSizing: "border-box",
                }}
              />
              <input
                type="text"
                placeholder="4-digit PIN"
                value={pin}
                onChange={e => { setPin(e.target.value.replace(/\D/g, "").slice(0, 4)); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleLookup()}
                maxLength={4}
                style={{
                  width: "100%", padding: "12px 16px", fontSize: 14,
                  background: "#FFFFFF", border: "1px solid #E2E8F0",
                  borderRadius: 6, color: "#1E293B", outline: "none", boxSizing: "border-box",
                  letterSpacing: "0.15em", textAlign: "center",
                }}
              />
              <button
                onClick={handleLookup}
                disabled={loading}
                style={{
                  width: "100%", padding: "13px", fontSize: 14, fontWeight: 600,
                  background: loading ? "#334155" : "#0F1D3D",
                  color: "#FFFFFF", border: "none", borderRadius: 28, cursor: loading ? "wait" : "pointer",
                  transition: "background 0.2s", marginTop: 4,
                }}
              >
                {loading ? "Looking up…" : "View project status  ↗"}
              </button>
            </div>

            {error && (
              <p style={{
                fontSize: 13, color: "#DC2626", marginTop: 14,
                background: "#FEF2F2", padding: "10px 14px",
                borderRadius: 6, border: "1px solid #FECACA",
              }}>
                {error}
              </p>
            )}

            <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 20, lineHeight: 1.5 }}>
              Your project ID and PIN were provided when your engagement started.
            </p>

            <div style={{
              marginTop: 24, padding: "12px 16px", borderRadius: 6,
              background: "#F8FAFC", border: "1px solid #E2E8F0", textAlign: "left",
            }}>
              <p style={{ fontSize: 10, color: "#94A3B8", margin: "0 0 4px 0", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Demo credentials
              </p>
              <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>
                ID: DS-2026-001 · PIN: 4821<br />
                ID: DS-2026-007 · PIN: 1155
              </p>
            </div>
          </div>
        </div>

        <footer style={{
          padding: "16px 32px", borderTop: "1px solid #E2E8F0",
          textAlign: "center", background: "#FFFFFF",
        }}>
          <p style={{ fontSize: 11, color: "#CBD5E1", margin: 0, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            © 2026 DeltaSmith · We forge scattered data into intelligence that works
          </p>
        </footer>
      </div>
    );
  }

  // ─── DASHBOARD ───
  return (
    <div style={{
      minHeight: "100vh", background: "#F8FAFC",
      fontFamily: "'Inter', -apple-system, sans-serif",
      paddingTop: 64,
    }}>
      <header style={{
        padding: "14px 32px", display: "flex", alignItems: "center",
        justifyContent: "space-between",
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        transition: "background 0.3s, box-shadow 0.3s",
        background: scrolled ? "rgba(255, 255, 255, 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #E2E8F0" : "1px solid transparent",
        boxShadow: scrolled ? "0 1px 3px rgba(0,0,0,0.04)" : "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src="https://deltasmith.io/assets/brand/DeltaSmith_logo1.png" alt="DeltaSmith" style={{ height: 28 }} />
          <span style={{ fontSize: 12, color: "#CBD5E1", margin: "0 4px" }}>/</span>
          <span style={{ fontSize: 12, color: "#94A3B8" }}>Client Portal</span>
        </div>
        <button
          onClick={() => { setView("lookup"); setProject(null); setProjectId(""); setPin(""); setTab("progress"); }}
          style={{
            fontSize: 12, color: "#64748B", background: "#FFFFFF",
            border: "1px solid #E2E8F0", borderRadius: 6, padding: "6px 14px",
            cursor: "pointer",
          }}
        >
          Sign out
        </button>
      </header>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px" }}>
        {/* Project header */}
        <div style={{ marginBottom: 24 }}>
          <span style={{
            fontSize: 11, fontWeight: 600, color: "#94A3B8", letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            {projectId.toUpperCase()}
          </span>
          <h1 style={{
            fontSize: 26, fontWeight: 700, color: "#0F1D3D", margin: "4px 0 4px 0",
            letterSpacing: "-0.02em",
          }}>
            {project.projectName}
          </h1>
          <p style={{ fontSize: 15, color: "#64748B", margin: 0 }}>
            {project.company} · {project.clientName}
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 12,
        }}>
          {[
            { label: "Overall progress", value: `${overallProgress}%`, sub: `${completedSteps} of ${totalSteps} steps` },
            { label: "Current phase", value: project.phases[project.currentPhase].name, sub: project.phases[project.currentPhase].subtitle },
            { label: "Last update", value: new Date(project.updates[0].date).toLocaleDateString("en-US", { month: "short", day: "numeric" }), sub: project.updates[0].title },
          ].map((stat, i) => (
            <div key={i} style={{
              padding: "18px 16px", borderRadius: 8,
              background: "#FFFFFF", border: "1px solid #E2E8F0",
            }}>
              <p style={{ fontSize: 10, color: "#94A3B8", margin: "0 0 6px 0", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
                {stat.label}
              </p>
              <p style={{ fontSize: 22, fontWeight: 700, color: "#0F1D3D", margin: "0 0 2px 0" }}>
                {stat.value}
              </p>
              <p style={{ fontSize: 12, color: "#94A3B8", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{
          padding: "16px 20px", borderRadius: 8, marginBottom: 28,
          background: "#FFFFFF", border: "1px solid #E2E8F0",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            {project.phases.map((phase, i) => (
              <span key={i} style={{
                fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
                color: phase.status === "completed" ? "#059669"
                  : phase.status === "in-progress" ? "#2563EB"
                  : "#CBD5E1",
              }}>
                {phase.name}
              </span>
            ))}
          </div>
          <div style={{
            width: "100%", height: 6, background: "#F1F5F9",
            borderRadius: 6, overflow: "hidden",
          }}>
            <div style={{
              width: `${overallProgress}%`, height: "100%", borderRadius: 6,
              background: "linear-gradient(90deg, #059669, #2563EB)",
              transition: "width 0.8s ease",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 11, color: "#CBD5E1" }}>
              Started {new Date(project.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <span style={{ fontSize: 11, color: "#CBD5E1" }}>
              Est. {new Date(project.estimatedEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: 0, marginBottom: 20,
          borderBottom: "1px solid #E2E8F0",
        }}>
          {[
            { id: "progress", label: "Phase breakdown" },
            { id: "updates", label: `Updates (${project.updates.length})` },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                fontSize: 13, fontWeight: 500, padding: "10px 20px",
                color: tab === t.id ? "#0F1D3D" : "#94A3B8",
                background: "none", border: "none", cursor: "pointer",
                borderBottom: tab === t.id ? "2px solid #2563EB" : "2px solid transparent",
                marginBottom: -1, transition: "all 0.2s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "progress" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {project.phases.map((phase, i) => (
              <PhaseCard key={i} phase={phase} index={i} isActive={i === project.currentPhase} />
            ))}
          </div>
        )}

        {tab === "updates" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {project.updates.map((update, i) => (
              <UpdateCard key={i} update={update} />
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <div style={{
          marginTop: 36, padding: "20px 24px", borderRadius: 8,
          background: "#FFFFFF", border: "1px solid #E2E8F0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 12,
        }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#0F1D3D", margin: "0 0 2px 0" }}>
              Questions about your project?
            </p>
            <p style={{ fontSize: 14, color: "#64748B", margin: 0 }}>
              Reach out to your DeltaSmith project lead anytime.
            </p>
          </div>
          <a
            href="mailto:hello@deltasmith.io"
            style={{
              fontSize: 13, fontWeight: 600, color: "#FFFFFF",
              textDecoration: "none", padding: "10px 20px", borderRadius: 28,
              background: "#0F1D3D", display: "inline-block",
            }}
          >
            Contact us  ↗
          </a>
        </div>
      </div>

      <footer style={{
        padding: "20px 32px", borderTop: "1px solid #E2E8F0",
        textAlign: "center", marginTop: 40, background: "#FFFFFF",
      }}>
        <p style={{ fontSize: 11, color: "#CBD5E1", margin: 0, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          © 2026 DeltaSmith · We forge scattered data into intelligence that works
        </p>
      </footer>
    </div>
  );
}
