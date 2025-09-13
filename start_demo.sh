#!/bin/bash

echo "🚀 Starting Gen-Z Ballot Demo Setup..."
echo

echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo
echo "🔧 Deploying contracts..."
npx hardhat run scripts/deploy.js --network localhost

echo
echo "🎬 Setting up demo data..."
npx hardhat run demo_setup.js --network localhost

echo
echo "🌐 Starting frontend server..."
echo "Open http://localhost:5173 in your browser"
echo "Connect MetaMask to Hardhat network (Chain ID: 1337)"
echo
cd frontend
npm run dev
