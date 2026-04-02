export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className={`task-item priority-border-${task.priority} ${task.done ? "done" : ""}`}>
      <button className="check-btn" onClick={() => onToggle(task.id)}>
        <span className="check-icon">{task.done ? "✓" : ""}</span>
      </button>
      <span className="task-title">{task.title}</span>
      <button className="delete-btn" onClick={() => onDelete(task.id)} title="Supprimer">
        ✕
      </button>
    </div>
  );
}
