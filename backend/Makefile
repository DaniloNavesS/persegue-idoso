DOCKER_COMPOSE_FILE := docker-compose.yml
DOCKER_COMPOSE_COMMAND := docker compose

DB_SERVICE_NAME := postgres-db
DB_VOLUME_NAME := pgdata

DB_USER := admin
DB_NAME := tracker

.PHONY: all up detached down restart logs build rebuild-up ps clean-volumes shell-db psql-db help

all: help ## Exibe esta mensagem de ajuda.

detached: ## Sobe os containers em segundo plano (detached).
	@echo "Subindo os containers Docker em segundo plano..."
	$(DOCKER_COMPOSE_COMMAND) -f $(DOCKER_COMPOSE_FILE) up -d

up: ## Sobe os containers com logs.
	@echo "Subindo os containers Docker..."
	$(DOCKER_COMPOSE_COMMAND) -f $(DOCKER_COMPOSE_FILE) up

down: ## Derruba os containers.
	@echo "Derrubando os containers Docker..."
	$(DOCKER_COMPOSE_COMMAND) -f $(DOCKER_COMPOSE_FILE) down

restart: ## Reinicia os serviços.
	@echo "Reiniciando os serviços Docker..."
	$(DOCKER_COMPOSE_COMMAND) -f $(DOCKER_COMPOSE_FILE) restart

logs: ## Exibe os logs dos containers.
	@echo "Exibindo os logs dos containers Docker..."
	$(DOCKER_COMPOSE_COMMAND) -f $(DOCKER_COMPOSE_FILE) logs -f

build: ## Reconstrói as imagens Docker.
	@echo "Reconstruindo as imagens Docker..."
	$(DOCKER_COMPOSE_COMMAND) -f $(DOCKER_COMPOSE_FILE) build

rebuild-up: ## Reconstrói imagens e sobe os containers.
	@echo "Reconstruindo imagens e subindo os containers Docker..."
	$(DOCKER_COMPOSE_COMMAND) -f $(DOCKER_COMPOSE_FILE) up -d --build

ps: ## Lista os containers em execução.
	@echo "Listando containers Docker Compose..."
	$(DOCKER_COMPOSE_COMMAND) -f $(DOCKER_COMPOSE_FILE) ps

clean-volumes: ## ATENÇÃO: Remove volumes e dados persistentes.
	@echo "ATENÇÃO: Isso apagará os dados persistentes dos volumes Docker..."
	$(DOCKER_COMPOSE_COMMAND) -f $(DOCKER_COMPOSE_FILE) down -v

shell-db: ## Abre shell no container do banco.
	@echo "Abrindo shell no container do banco ($(DB_SERVICE_NAME))..."
	$(DOCKER_COMPOSE_COMMAND) -f $(DOCKER_COMPOSE_FILE) exec $(DB_SERVICE_NAME) bash || $(DOCKER_COMPOSE_COMMAND) -f $(DOCKER_COMPOSE_FILE) exec $(DB_SERVICE_NAME) sh

psql-db: ## Conecta ao banco via psql dentro do container.
	@echo "Conectando ao PostgreSQL dentro do container ($(DB_SERVICE_NAME))..."
	$(DOCKER_COMPOSE_COMMAND) -f $(DOCKER_COMPOSE_FILE) exec $(DB_SERVICE_NAME) psql -U $(DB_USER) -d $(DB_NAME)

help: ## Exibe esta mensagem de ajuda.
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'