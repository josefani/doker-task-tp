import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📋</span>
        <p>Aucune tâche pour l'instant.</p>
        <p className="empty-sub">Ajoutez votre première tâche Docker !</p>
      </div>
    );
  }

  const high = tasks.filter((t) => t.priority === "high");
  const medium = tasks.filter((t) => t.priority === "medium");
  const low = tasks.filter((t) => t.priority === "low");

  return (
    <div className="task-list">
      {high.length > 0 && (
        <div className="task-group">
          <div className="group-label high">🔴 Haute priorité</div>
          {high.map((t) => <TaskItem key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} />)}
        </div>
      )}
      {medium.length > 0 && (
        <div className="task-group">
          <div className="group-label medium">🟡 Priorité moyenne</div>
          {medium.map((t) => <TaskItem key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} />)}
        </div>
      )}
      {low.length > 0 && (
        <div className="task-group">
          <div className="group-label low">🟢 Basse priorité</div>
          {low.map((t) => <TaskItem key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} />)}
        </div>
      )}
    </div>
  );
}
