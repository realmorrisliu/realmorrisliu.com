# Kira Calendar App - Development Makefile
# Author: Morris Liu
# Description: Minimal commands for development workflow

.PHONY: help dev dev-frontend dev-backend install check typecheck format lint env-check

# Default target - show help
.DEFAULT_GOAL := help

##@ 🚀 Development

dev: ## Start both frontend and backend in parallel (recommended)
	@echo "🚀 Starting development servers..."
	@echo "📱 Frontend: http://localhost:4321"
	@echo "🔧 Backend:  http://localhost:8000"
	@echo ""
	@$(MAKE) -j2 dev-frontend dev-backend

dev-frontend: ## Start Astro frontend only (port 4321)
	@echo "📱 Starting frontend..."
	@pnpm dev

dev-backend: ## Start FastAPI backend only (port 8000)
	@echo "🔧 Starting backend..."
	@cd agent && uv run python main.py

##@ 📦 Installation

install: ## Install all dependencies (frontend + backend)
	@echo "📦 Installing dependencies..."
	@pnpm install
	@cd agent && uv sync
	@echo "✅ All dependencies installed!"

install-frontend: ## Install frontend dependencies only
	@pnpm install

install-backend: ## Install backend dependencies only
	@cd agent && uv sync

##@ ✅ Code Quality

check: typecheck format lint ## Run all quality checks (recommended before commit)
	@echo "✅ All checks passed!"

typecheck: ## Run TypeScript type checking
	@echo "🔍 Running type checks..."
	@pnpm typecheck

format: ## Format code (frontend: prettier, backend: ruff)
	@echo "✨ Formatting code..."
	@pnpm prettier --write "src/**/*.{ts,tsx,astro}"
	@cd agent && uv run ruff format . || echo "⚠️  Install ruff: uv add --dev ruff"

format-check: ## Check code formatting without modifying
	@echo "🔍 Checking code formatting..."
	@pnpm prettier --check "src/**/*.{ts,tsx,astro}"
	@cd agent && uv run ruff format --check . || echo "⚠️  Install ruff: uv add --dev ruff"

lint: ## Lint code (ESLint for frontend, Ruff for backend)
	@echo "🔍 Linting code..."
	@cd agent && uv run ruff check . || echo "⚠️  Install ruff: uv add --dev ruff"

##@ 🔧 Utilities

env-check: ## Check environment configuration
	@echo "🔍 Checking environment..."
	@echo "Frontend .env:"
	@[ -f .env ] && echo "  ✅ .env exists" || echo "  ❌ .env missing"
	@echo "Backend .env:"
	@[ -f agent/.env ] && echo "  ✅ agent/.env exists" || echo "  ❌ agent/.env missing"
	@echo ""
	@echo "Node version: $$(node --version)"
	@echo "pnpm version: $$(pnpm --version)"
	@echo "Python version: $$(cd agent && uv run python --version)"
	@echo "uv version: $$(uv --version)"

##@ 📝 Help

help: ## Display this help message
	@awk 'BEGIN {FS = ":.*##"; printf "\n\033[1mKira Calendar App - Development Commands\033[0m\n\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
	@echo ""
	@echo "💡 Quick Start:"
	@echo "  1. make install          # Install dependencies"
	@echo "  2. make env-check        # Verify environment"
	@echo "  3. make dev              # Start development"
	@echo ""
	@echo "📚 Documentation:"
	@echo "  Frontend: http://localhost:4321"
	@echo "  Backend:  http://localhost:8000/docs"
	@echo ""
