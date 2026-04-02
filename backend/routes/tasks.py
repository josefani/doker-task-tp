from flask import Blueprint, request, jsonify
from database import db
from models import Task

tasks_bp = Blueprint('tasks', __name__)


# ── GET /api/tasks ─────────────────────────────────────────────
# Retourne toutes les tâches (optionnel: filtrer par ?priority=high)
@tasks_bp.route('/tasks', methods=['GET'])
def get_tasks():
    priority = request.args.get('priority')       # filtre optionnel
    query = Task.query.order_by(Task.created_at.desc())
    if priority:
        query = query.filter_by(priority=priority)
    tasks = query.all()
    return jsonify([t.to_dict() for t in tasks]), 200


# ── GET /api/tasks/<id> ────────────────────────────────────────
# Retourne une seule tâche par son ID
@tasks_bp.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    task = Task.query.get_or_404(task_id)
    return jsonify(task.to_dict()), 200


# ── POST /api/tasks ────────────────────────────────────────────
# Crée une nouvelle tâche
# Body JSON: { "title": "...", "priority": "low|medium|high" }
@tasks_bp.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()

    if not data or not data.get('title', '').strip():
        return jsonify({'error': 'Le champ "title" est obligatoire'}), 400

    priority = data.get('priority', 'medium')
    if priority not in ('low', 'medium', 'high'):
        return jsonify({'error': 'Priorité invalide. Valeurs: low, medium, high'}), 400

    task = Task(title=data['title'].strip(), priority=priority)
    db.session.add(task)
    db.session.commit()

    return jsonify(task.to_dict()), 201


# ── PUT /api/tasks/<id> ────────────────────────────────────────
# Met à jour une tâche (titre, done, priorité)
@tasks_bp.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.get_json()

    if 'title' in data:
        if not data['title'].strip():
            return jsonify({'error': 'Le titre ne peut pas être vide'}), 400
        task.title = data['title'].strip()

    if 'done' in data:
        task.done = bool(data['done'])

    if 'priority' in data:
        if data['priority'] not in ('low', 'medium', 'high'):
            return jsonify({'error': 'Priorité invalide'}), 400
        task.priority = data['priority']

    db.session.commit()
    return jsonify(task.to_dict()), 200


# ── DELETE /api/tasks/<id> ─────────────────────────────────────
# Supprime une tâche
@tasks_bp.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': f'Tâche {task_id} supprimée'}), 200
