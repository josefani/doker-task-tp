from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, Task
import os
import time # Importé pour mesurer la durée des requêtes

# --- NOUVEAUX IMPORTS POUR PROMETHEUS ---
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
from metrics import REQUEST_COUNT, REQUEST_LATENCY 
# ----------------------------------------

app = Flask(__name__)
CORS(app)

# ── Configuration de la base de données ────────────────────────
app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"mysql+pymysql://"
    f"{os.environ.get('DB_USER', 'taskuser')}:"
    f"{os.environ.get('DB_PASSWORD', 'taskpass')}@"
    f"{os.environ.get('DB_HOST', 'localhost')}:"
    f"{os.environ.get('DB_PORT', '3306')}/"
    f"{os.environ.get('DB_NAME', 'taskdb')}"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# ── LOGIQUE DE COLLECTE DES METRIQUES ──────────────────────────

@app.before_request
def start_timer():
    """S'exécute avant chaque requête pour mémoriser l'heure de début."""
    request.start_time = time.time()

@app.after_request
def log_request(response):
    """S'exécute après chaque requête pour calculer le temps et incrémenter le compteur."""
    # On ne mesure pas les appels à l'endpoint /metrics lui-même pour ne pas fausser les stats
    if request.path != '/metrics':
        # 1. Calcul de la latence (temps écoulé)
        latency = time.time() - request.start_time
        
        # 2. Mise à jour du compteur (Nombre de requêtes par méthode, route et code HTTP)
        REQUEST_COUNT.labels(
            method=request.method, 
            endpoint=request.path, 
            http_status=response.status_code
        ).inc()
        
        # 3. Mise à jour de l'histogramme (Temps de réponse par route)
        REQUEST_LATENCY.labels(endpoint=request.path).observe(latency)
        
    return response

# ── EXPOSITION DES METRIQUES ────────────────────────────────────

@app.route('/metrics')
def metrics():
    """Route spéciale que le serveur Prometheus viendra consulter toutes les X secondes."""
    return generate_latest(), 200, {'Content-Type': CONTENT_TYPE_LATEST}

# ── Health check ────────────────────────────────────────────────
@app.route('/api/health', methods=['GET'])
def health():
    try:
        db.session.execute(db.text('SELECT 1'))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    return jsonify({
        "status": "ok",
        "service": "DockerTask Backend",
        "database": db_status
    })

# ── GET /api/tasks — Récupérer toutes les tâches ───────────────
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.order_by(Task.created_at.desc()).all()
    return jsonify([t.to_dict() for t in tasks])

# ── POST /api/tasks — Créer une nouvelle tâche ─────────────────
@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    if not data or not data.get('title', '').strip():
        return jsonify({"error": "Le titre est requis"}), 400

    task = Task(
        title=data['title'].strip(),
        priority=data.get('priority', 'medium'),
        done=False
    )
    db.session.add(task)
    db.session.commit()
    return jsonify(task.to_dict()), 201

# ── PUT /api/tasks/<id> — Modifier une tâche ───────────────────
@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.get_json()

    if 'title' in data:
        task.title = data['title'].strip()
    if 'done' in data:
        task.done = bool(data['done'])
    if 'priority' in data:
        task.priority = data['priority']

    db.session.commit()
    return jsonify(task.to_dict())

# ── DELETE /api/tasks/<id> — Supprimer une tâche ───────────────
@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": f"Tâche {task_id} supprimée"}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)