# backend/metrics.py
from prometheus_client import Counter, Histogram

# Compteur pour le trafic global
REQUEST_COUNT = Counter(
    'http_requests_total', 
    'Total des requêtes HTTP', 
    ['method', 'endpoint', 'http_status']
)

# Histogramme pour la performance
REQUEST_LATENCY = Histogram(
    'http_request_duration_seconds', 
    'Latence des requêtes en secondes', 
    ['endpoint']
)