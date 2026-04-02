export default function StatusBadge({ status }) {
  const config = {
    checking: { label: "Vérification...", color: "status-checking", dot: "⬤" },
    online: { label: "Connectée", color: "status-online", dot: "⬤" },
    offline: { label: "Hors ligne", color: "status-offline", dot: "⬤" },
  };
  const c = config[status] || config.checking;

  return (
    <div className={`status-badge ${c.color}`}>
      <span className="status-dot">{c.dot}</span>
      <span>{c.label}</span>
    </div>
  );
}
