#!/bin/bash

echo "🚀 Démarrage du Gestionnaire de Tâches"

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Fonction pour vérifier si un port est utilisé
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Démarrer le backend
echo "📡 Démarrage du backend API..."
if check_port 3080; then
    echo "⚠️  Le port 3080 est déjà utilisé. Assurez-vous que le backend n'est pas déjà en cours d'exécution."
else
    echo "📂 Navigation vers le dossier backend..."
    cd /home/papa-sidy-fall/Bureau/explication

    echo "🔧 Installation des dépendances backend..."
    npm install

    echo "🏃 Démarrage du serveur backend sur le port 3080..."
    npm start &
    BACKEND_PID=$!

    echo "✅ Backend démarré (PID: $BACKEND_PID)"
fi

# Attendre un peu pour que le backend démarre
sleep 3

# Démarrer le frontend
echo "🎨 Démarrage du frontend React..."
cd /home/papa-sidy-fall/Bureau/explication/frontend

echo "🔧 Installation des dépendances frontend..."
npm install

echo "🏃 Démarrage du serveur de développement sur le port 5173..."
npm run dev &
FRONTEND_PID=$!

echo "✅ Frontend démarré (PID: $FRONTEND_PID)"

echo ""
echo "🎉 Application démarrée avec succès !"
echo "📱 Frontend: http://localhost:5173"
echo "🔌 Backend API: http://localhost:3080"
echo ""
echo "💡 Pour arrêter l'application, utilisez Ctrl+C"

# Attendre que l'utilisateur arrête l'application
wait
