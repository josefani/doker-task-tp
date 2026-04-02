-- ============================================================
--  DockerTask — Initialisation de la base de données MySQL
--  Ce fichier est exécuté automatiquement au 1er démarrage
--  du conteneur MySQL via docker-compose.yml
-- ============================================================

-- Créer la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS taskdb
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Utiliser la base de données
USE taskdb;

-- Créer l'utilisateur applicatif (séparé de root)
CREATE USER IF NOT EXISTS 'taskuser'@'%' IDENTIFIED BY 'taskpass';
GRANT ALL PRIVILEGES ON taskdb.* TO 'taskuser'@'%';
FLUSH PRIVILEGES;

-- ── Table principale : tasks ────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    title      VARCHAR(255)                    NOT NULL,
    done       BOOLEAN                         NOT NULL DEFAULT FALSE,
    priority   ENUM('low', 'medium', 'high')   NOT NULL DEFAULT 'medium',
    created_at DATETIME                        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME                        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                               ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Données de démonstration ────────────────────────────────────
INSERT INTO tasks (title, done, priority) VALUES
  ('Installer Docker Desktop',                  TRUE,  'high'),
  ('Créer le Dockerfile du frontend',           TRUE,  'high'),
  ('Créer le Dockerfile du backend Flask',      FALSE, 'high'),
  ('Configurer docker-compose.yml',             FALSE, 'medium'),
  ('Tester la communication entre conteneurs',  FALSE, 'medium'),
  ('Publier l''image sur Docker Hub',           FALSE, 'low');
