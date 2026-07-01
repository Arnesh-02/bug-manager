import React, { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, X, Check, Search, ClipboardList } from "lucide-react";

const STATUS_META = {
  pending: { label: "Pending", text: "#C4231A", bg: "#FDF0EF", border: "#F5C7C2", dot: "#E14A3E" },
  partial: { label: "Partial", text: "#B4650A", bg: "#FEF6E7", border: "#F6DCA6", dot: "#E1962F" },
  done: { label: "Done", text: "#15803D", bg: "#EFFAF1", border: "#BBE8C4", dot: "#22A649" },
};

function uid() {
  return "b" + Math.random().toString(36).slice(2, 9);
}

export default function App() {
  const [bugs, setBugs] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ text: "", status: "pending" });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const counts = useMemo(() => {
    const c = { pending: 0, partial: 0, done: 0, total: bugs.length };
    bugs.forEach((b) => {
      if (c[b.status] !== undefined) c[b.status] += 1;
    });
    return c;
  }, [bugs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bugs.filter((bug) => {
      if (statusFilter !== "all" && bug.status !== statusFilter) return false;
      if (q && !bug.text.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [bugs, query, statusFilter]);

  const saveDraft = () => {
    const text = draft.text.trim();
    if (!text) return;

    if (editingId) {
      setBugs((prev) => prev.map((bug) => (bug.id === editingId ? { ...bug, text, status: draft.status } : bug)));
    } else {
      setBugs((prev) => [...prev, { id: uid(), text, status: draft.status }]);
    }

    setFormOpen(false);
    setEditingId(null);
    setDraft({ text: "", status: "pending" });
  };

  const openEdit = (bug) => {
    setEditingId(bug.id);
    setDraft({ text: bug.text, status: bug.status });
    setFormOpen(true);
  };

  const removeBug = (id) => {
    setBugs((prev) => prev.filter((bug) => bug.id !== id));
    setConfirmDeleteId(null);
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .bt-btn { cursor: pointer; border: 1px solid #E2E2E5; background: #FFFFFF; font-family: 'Inter', sans-serif; font-weight: 600; border-radius: 10px; transition: background .15s, border-color .15s; }
        .bt-btn:hover { background: #F7F7F8; border-color: #CDD2DA; }
        .bt-chip { cursor: pointer; border: 1px solid #E2E2E5; background: #FFFFFF; font-family: 'Inter', sans-serif; font-weight: 500; border-radius: 999px; color: #57585D; }
        .bt-chip:hover { border-color: #CDD2DA; }
        .bt-chip.active { background: #17181C; color: #FFFFFF; border-color: #17181C; }
        .bt-card { background: #FFFFFF; border: 1px solid #E7E7EA; border-radius: 18px; padding: 18px; display: flex; flex-direction: column; gap: 14px; transition: transform .16s ease, box-shadow .16s ease; }
        .bt-card:hover { transform: translateY(-1px); box-shadow: 0 20px 40px rgba(23, 24, 28, 0.08); }
        .bt-pill { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 12px; padding: 4px 10px; border-radius: 999px; border: 1px solid; display: inline-flex; align-items: center; gap: 8px; }
        .bt-dot { width: 8px; height: 8px; border-radius: 999px; flex-shrink: 0; }
        .bt-icon-btn { cursor: pointer; border: none; background: transparent; color: #71717A; padding: 6px; border-radius: 10px; display: inline-flex; }
        .bt-icon-btn:hover { background: #F5F5F7; color: #17181C; }
        .bt-input, .bt-textarea, .bt-select { font-family: 'Inter', sans-serif; border: 1px solid #E2E2E5; background: #FFFFFF; padding: 12px 14px; font-size: 14px; width: 100%; border-radius: 14px; color: #17181C; }
        .bt-input:focus, .bt-textarea:focus, .bt-select:focus { outline: none; border-color: #17181C; box-shadow: 0 0 0 4px rgba(23,24,28,0.08); }
        .bt-overlay { position: fixed; inset: 0; background: rgba(23, 24, 28, 0.32); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 16px; }
      `}</style>

      <header style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.brandRow}>
            <div style={styles.brandIcon}><ClipboardList size={20} color="#17181C" strokeWidth={1.8} /></div>
            <div>
              <h1 style={styles.title}>Bug tracker</h1>
              <p style={styles.subtitle}>Report bugs and manage status in a clean card-based flow.</p>
            </div>
          </div>
          <button className="bt-btn" style={styles.addBtn} type="button" onClick={() => setFormOpen(true)}>
            <Plus size={16} /> New issue
          </button>
        </div>

        <div style={styles.statCards}>
          <div style={styles.statCard}>
            <span style={styles.statNum}>{counts.total}</span>
            <span style={styles.statLabel}>Total</span>
          </div>
          <div style={{ ...styles.statCard, borderColor: STATUS_META.pending.border }}>
            <span style={{ ...styles.statNum, color: STATUS_META.pending.text }}>{counts.pending}</span>
            <span style={styles.statLabel}>Pending</span>
          </div>
          <div style={{ ...styles.statCard, borderColor: STATUS_META.partial.border }}>
            <span style={{ ...styles.statNum, color: STATUS_META.partial.text }}>{counts.partial}</span>
            <span style={styles.statLabel}>Partial</span>
          </div>
          <div style={{ ...styles.statCard, borderColor: STATUS_META.done.border }}>
            <span style={{ ...styles.statNum, color: STATUS_META.done.text }}>{counts.done}</span>
            <span style={styles.statLabel}>Done</span>
          </div>
        </div>
      </header>

      <div style={styles.controls}>
        <div style={styles.searchBox}>
          <Search size={15} color="#A5A6AC" />
          <input
            className="bt-input"
            placeholder="Search bugs…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div style={styles.chipRow}>
          {["all", "pending", "partial", "done"].map((status) => (
            <button
              key={status}
              type="button"
              className={"bt-chip" + (statusFilter === status ? " active" : "")}
              style={styles.chip}
              onClick={() => setStatusFilter(status)}
            >
              {status === "all" ? "All" : STATUS_META[status].label}
            </button>
          ))}
        </div>
      </div>

      <main style={styles.cardGrid}>
        {filtered.length === 0 ? (
          <div style={styles.empty}>No bug reports found. Add a new issue to get started.</div>
        ) : (
          filtered.map((bug) => {
            const status = STATUS_META[bug.status];
            return (
              <div key={bug.id} className="bt-card">
                <div style={styles.cardTop}>
                  <span className="bt-pill" style={{ color: status.text, background: status.bg, borderColor: status.border }}>
                    <span className="bt-dot" style={{ background: status.dot }} />
                    {status.label}
                  </span>
                  <div style={styles.cardActions}>
                    <button className="bt-icon-btn" type="button" onClick={() => openEdit(bug)} aria-label="Edit"><Pencil size={14} /></button>
                    <button className="bt-icon-btn" type="button" onClick={() => setConfirmDeleteId(bug.id)} aria-label="Delete"><Trash2 size={14} /></button>
                  </div>
                </div>
                <p style={styles.cardText}>{bug.text}</p>
              </div>
            );
          })
        )}
      </main>

      {formOpen && (
        <div className="bt-overlay" onClick={() => setFormOpen(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHead}>
              <h2 style={styles.modalTitle}>{editingId ? "Edit bug" : "New bug"}</h2>
              <button className="bt-icon-btn" type="button" onClick={() => setFormOpen(false)}><X size={18} /></button>
            </div>

            <label style={styles.fieldLabel}>Bug description</label>
            <textarea
              className="bt-textarea"
              rows={4}
              value={draft.text}
              onChange={(e) => setDraft({ ...draft, text: e.target.value })}
              placeholder="What is the bug?"
            />

            <label style={styles.fieldLabel}>Status</label>
            <div style={styles.statusPicker}>
              {["pending", "partial", "done"].map((status) => (
                <button
                  key={status}
                  type="button"
                  className={"bt-chip" + (draft.status === status ? " active" : "")}
                  style={{ ...styles.chip, flex: 1, justifyContent: "center", display: "flex" }}
                  onClick={() => setDraft({ ...draft, status })}
                >
                  {STATUS_META[status].label}
                </button>
              ))}
            </div>

            <div style={styles.modalFooter}>
              <button className="bt-btn" type="button" style={styles.cancelBtn} onClick={() => setFormOpen(false)}>Cancel</button>
              <button className="bt-btn" type="button" style={styles.saveBtn} onClick={saveDraft}><Check size={14} /> Save</button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="bt-overlay" onClick={() => setConfirmDeleteId(null)}>
          <div style={{ ...styles.modal, maxWidth: 360 }} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Delete bug?</h2>
            <p style={styles.confirmText}>This will permanently remove the bug from the list.</p>
            <div style={styles.modalFooter}>
              <button className="bt-btn" type="button" style={styles.cancelBtn} onClick={() => setConfirmDeleteId(null)}>Cancel</button>
              <button className="bt-btn" type="button" style={styles.deleteBtn} onClick={() => removeBug(confirmDeleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { fontFamily: "'Inter', sans-serif", background: "#F8F9FB", minHeight: "100vh", color: "#18181B", padding: "32px 20px 48px" },
  header: { maxWidth: 1100, margin: "0 auto 24px" },
  headerTop: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" },
  brandRow: { display: "flex", alignItems: "center", gap: 14 },
  brandIcon: { width: 44, height: 44, borderRadius: 14, background: "#E7E7F0", display: "flex", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" },
  subtitle: { margin: "6px 0 0", color: "#6B7280", fontSize: 14 },
  addBtn: { display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 18px", fontSize: 14, background: "#17181C", color: "#FFFFFF", borderColor: "#17181C" },
  statCards: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 14, marginTop: 24 },
  statCard: { background: "#FFFFFF", border: "1px solid #E7E7EA", borderRadius: 18, padding: "18px 16px", display: "flex", flexDirection: "column", gap: 6 },
  statNum: { fontSize: 24, fontWeight: 700 },
  statLabel: { fontSize: 13, color: "#6B7280" },
  controls: { maxWidth: 1100, margin: "0 auto 24px", display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "space-between" },
  searchBox: { display: "flex", alignItems: "center", gap: 10, flex: "1 1 280px", minWidth: 240 },
  chipRow: { display: "flex", flexWrap: "wrap", gap: 10 },
  chip: { fontSize: 13, padding: "10px 14px" },
  cardGrid: { maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 },
  empty: { background: "#FFFFFF", border: "1px dashed #D6D6E0", borderRadius: 18, padding: "48px 24px", textAlign: "center", color: "#6B7280", fontSize: 15 },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 },
  cardActions: { display: "flex", gap: 8 },
  cardText: { margin: 0, fontSize: 15, lineHeight: 1.65, color: "#111827" },
  modal: { background: "#FFFFFF", border: "1px solid #E7E7EA", borderRadius: 22, padding: 24, width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", gap: 16, boxShadow: "0 26px 60px rgba(23,24,28,0.14)" },
  modalHead: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  modalTitle: { fontSize: 20, fontWeight: 700, margin: 0 },
  fieldLabel: { fontSize: 13, color: "#6B7280", marginBottom: 8, fontWeight: 600 },
  statusPicker: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 },
  modalFooter: { display: "flex", justifyContent: "flex-end", gap: 12, flexWrap: "wrap" },
  cancelBtn: { padding: "11px 18px", fontSize: 14 },
  saveBtn: { padding: "11px 18px", fontSize: 14, background: "#17181C", color: "#FFFFFF", borderColor: "#17181C", display: "inline-flex", alignItems: "center", gap: 8 },
  deleteBtn: { padding: "11px 18px", fontSize: 14, background: "#DC2626", color: "#FFFFFF", borderColor: "#DC2626" },
  confirmText: { margin: 0, color: "#6B7280", fontSize: 14 },
};
