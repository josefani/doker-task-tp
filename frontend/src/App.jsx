import { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import StatusBadge from './components/StatusBadge';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');

  // Simulate API check (real call will work once backend is up)
  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await fetch(`${API_URL}/api/health`);
        if (res.ok) setApiStatus('online');
        else setApiStatus('offline');
      } catch {
        setApiStatus('offline');
      }
    };
    checkApi();
  }, []);

  // Mock tasks for frontend-only demo
  useEffect(() => {
    setTasks([
      {
        id: 1,
        title: 'Installer Docker Desktop',
        done: true,
        priority: 'high',
      },
      {
        id: 2,
        title: 'Créer le Dockerfile du frontend',
        done: true,
        priority: 'high',
      },
      {
        id: 3,
        title: 'Créer le Dockerfile du backend Flask',
        done: false,
        priority: 'high',
      },
      {
        id: 4,
        title: 'Configurer docker-compose.yml',
        done: false,
        priority: 'medium',
      },
      {
        id: 5,
        title: 'Tester la communication entre conteneurs',
        done: false,
        priority: 'medium',
      },
      {
        id: 6,
        title: "Publier l'image sur Docker Hub",
        done: false,
        priority: 'low',
      },
    ]);
  }, []);

  const addTask = (title, priority) => {
    const newTask = { id: Date.now(), title, done: false, priority };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const stats = {
    total: tasks.length,
    done: tasks.filter((t) => t.done).length,
    pending: tasks.filter((t) => !t.done).length,
  };

  return (
    <div className="app">
      <div className="noise-overlay" />

      <header className="header">
        <div className="header-inner">
          <div className="logo-group">
            <span className="logo-icon">⬡</span>
            <div>
              <h1 className="logo-title">DockerTask</h1>
              <p className="logo-sub">Travaux Pratiques — Conteneurisation</p>
            </div>
          </div>
          <StatusBadge status={apiStatus} />
        </div>
      </header>

      <main className="main">
        <section className="stats-bar">
          <div className="stat-card">
            <span className="stat-num">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card accent">
            <span className="stat-num">{stats.done}</span>
            <span className="stat-label">Complétées</span>
          </div>
          <div className="stat-card muted">
            <span className="stat-num">{stats.pending}</span>
            <span className="stat-label">En attente</span>
          </div>
          <div className="progress-wrap">
            <div className="progress-label">
              Progression —{' '}
              {stats.total > 0
                ? Math.round((stats.done / stats.total) * 100)
                : 0}
              %
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${stats.total > 0 ? (stats.done / stats.total) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </section>

        <div className="content-grid">
          <aside className="sidebar">
            <TaskForm onAdd={addTask} />
            <div className="info-box">
              <h3 className="info-title">🐳 Architecture</h3>
              <ul className="info-list">
                <li>
                  <span className="tag blue">frontend</span> React + Vite — port
                  5173
                </li>
                <li>
                  <span className="tag green">backend</span> Flask API — port
                  5000
                </li>
                <li>
                  <span className="tag orange">database</span> MySQL — port 3306
                </li>
                <li>
                  <span className="tag purple">network</span> app-network
                  (bridge)
                </li>
              </ul>
            </div>
          </aside>

          <section className="task-section">
            <div className="section-header">
              <h2 className="section-title">Liste des tâches</h2>
              <span className="task-count">
                {tasks.length} tâche{tasks.length > 1 ? 's' : ''}
              </span>
            </div>
            {loading ? (
              <div className="loader">Chargement...</div>
            ) : (
              <TaskList
                tasks={tasks}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            )}
          </section>
        </div>
      </main>

      <footer className="footer">
        <span>TP · React + Flask + MySQL</span>
        <span className="footer-sep">·</span>
        <span>
          API: <code>{API_URL}</code>
        </span>
      </footer>
    </div>
  );
}

export default App;
