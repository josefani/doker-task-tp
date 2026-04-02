import { useState } from "react";

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), priority);
    setTitle("");
    setPriority("medium");
  };

  return (
    <div className="form-card">
      <h3 className="form-title">Nouvelle tâche</h3>
      <div className="form-body">
        <div className="field">
          <label className="field-label">Titre</label>
          <input
            className="field-input"
            type="text"
            placeholder="Ex: Créer un Dockerfile..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
          />
        </div>
        <div className="field">
          <label className="field-label">Priorité</label>
          <div className="priority-group">
            {["low", "medium", "high"].map((p) => (
              <button
                key={p}
                type="button"
                className={`priority-btn priority-${p} ${priority === p ? "active" : ""}`}
                onClick={() => setPriority(p)}
              >
                {p === "low" ? "Basse" : p === "medium" ? "Moyenne" : "Haute"}
              </button>
            ))}
          </div>
        </div>
        <button className="submit-btn" onClick={handleSubmit} disabled={!title.trim()}>
          <span>＋</span> Ajouter
        </button>
      </div>
    </div>
  );
}
