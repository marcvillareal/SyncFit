#!/bin/bash

# SyncFit Development Server Starter
echo "🏋️  Starting SyncFit Full-Stack Application..."
echo ""

# Check if backend is already running
if lsof -i :8080 >/dev/null 2>&1; then
    echo "⚠️  Backend already running on port 8080"
else
    echo "🚀 Starting Backend API (Spring Boot)..."
    cd sync-fit-api
    mvn spring-boot:run &
    BACKEND_PID=$!
    cd ..
    echo "📡 Backend started with PID: $BACKEND_PID"
fi

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 15

# Check if frontend is already running
if lsof -i :3000 >/dev/null 2>&1; then
    echo "⚠️  Frontend already running on port 3000"
else
    echo "🎨 Starting Frontend (React + Vite)..."
    cd sync-fit-client-side
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    echo "💻 Frontend started with PID: $FRONTEND_PID"
fi

echo ""
echo "✅ SyncFit is now running!"
echo "🌐 Frontend: http://localhost:3000"
echo "📡 Backend API: http://localhost:8080"
echo "🗄️  H2 Console: http://localhost:8080/h2-console"
echo ""
echo "Press Ctrl+C to stop both servers"

# Keep script running and handle Ctrl+C
trap 'echo "🛑 Stopping servers..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' INT

# Wait for user to stop
wait