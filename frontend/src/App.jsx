import { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import StatusBadge from './components/StatusBadge';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://backend-service:5000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('checking');

  // Vérifier l'état de l'API
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

  // Charger les tâches depuis le backend
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/tasks`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        console.error('Erreur chargement tâches');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les tâches au démarrage
  useEffect(() => {
    fetchTasks();
  }, []);

  // Ajouter une tâche
  const addTask = async (title, priority) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, done: false, priority }),
      });
      if (response.ok) {
        fetchTasks(); // Recharger la liste
      }
    } catch (error) {
      console.error('Erreur ajout:', error);
    }
  };

  // Basculer l'état d'une tâche
  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, done: !task.done }),
      });
      if (response.ok) {
        fetchTasks(); // Recharger la liste
      }
    } catch (error) {
      console.error('Erreur mise à jour:', error);
    }
  };

  // Supprimer une tâche
  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchTasks(); // Recharger la liste
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const stats = {
    total: tasks.length,
    done: tasks.filter((t) => t.done).length,
    pending: tasks.filter((t) => !t.done).length,
  };

  return (
    // ... le reste du JSX reste identique
    <div className="app">
      {/* ... gardez le même contenu JSX ... */}
    </div>
  );
}

export default App;