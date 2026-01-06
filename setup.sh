#!/bin/bash

# AtomGit MCP Server Setup Script
# This script helps set up the development environment

echo "🚀 Setting up AtomGit MCP Server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file and add your AtomGit token:"
    echo "   1. Visit https://atomgit.com/setting/token-classic"
    echo "   2. Generate a new token"
    echo "   3. Copy the token to .env file"
else
    echo "✅ .env file already exists"
fi

# Run MCP server test
echo "🧪 Running MCP server test..."
npm run test:mcp

echo ""
echo "🎉 Setup completed!"
echo ""
echo "📚 Next steps:"
echo "   1. Edit .env file with your AtomGit token"
echo "   2. Run 'npm start' to start the server"
echo "   3. Add the server to your Claude Desktop configuration"
echo ""
echo "📖 For more information, see README.md"