from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Task(db.Model):
    __tablename__ = 'tasks'

    id         = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title      = db.Column(db.String(255), nullable=False)
    done       = db.Column(db.Boolean, default=False, nullable=False)
    priority   = db.Column(db.Enum('low', 'medium', 'high'), default='medium', nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id":         self.id,
            "title":      self.title,
            "done":       self.done,
            "priority":   self.priority,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self):
        return f"<Task {self.id}: {self.title} [{self.priority}]>"
