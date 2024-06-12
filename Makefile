STAGE ?= dev

.PHONY: dev
dev: .cp-env build .install-deps start

.PHONY: build
build:
	@echo "Building the Docker images..."
	@docker-compose -f docker-compose.$(STAGE).yaml build

start:
	@echo "Starting the server..."
	@docker-compose -f docker-compose.$(STAGE).yaml up -d

.PHONY: stop
stop:
	@echo "Stopping the server..."
	@docker-compose -f docker-compose.$(STAGE).yaml down

.PHONY: .cp-env
.cp-env:
	@echo "Copying .env file..."
	@cp -n .env.dist .env

.PHONY: .install-deps
.install-deps:
	@echo "Installing dependencies..."
	@docker-compose -f docker-compose.$(STAGE).yaml run --rm web npm install