@echo off
echo Starting Pizza Point Backend...
start cmd /k "cd backend && python run.py"

echo Starting Pizza Point Frontend...
start cmd /k "cd frontend && npm run dev"

echo Both servers are starting! You can close this window.
