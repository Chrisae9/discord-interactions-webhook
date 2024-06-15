.PHONY: build dev pull push shell root docker-test env-check service-check cron-check

include .env

# Makefile for Discord Interactions Webhook
# =========================================
# 1. build         - Build the Docker image and tag it
# 2. dev           - Run the application in development mode
# 3. pull          - Pull current commands from Discord
# 4. push          - Push updated commands to Discord
# 5. shell         - Open a shell inside the container
# 6. root          - Open a root shell inside the container
# 7. docker-test   - Test Docker setup inside the container
# 8. env-check     - Check if .env file exists and print environment variables
# 9. service-check - Run docker-compose up on ./services/example/docker-compose.yaml
# 10. cron-check   - Check cron jobs for node user inside the container

# 1. Build the Docker image and tag it
build:
	docker build --no-cache . -t discord-webhook-service
	docker tag discord-webhook-service chrisae9/discord-webhook-service:dev

# 2. Run the application in development mode
dev:
	docker run --env-file .env -it --rm -v ./services:/services -v ./data:/app/src/data -v /var/run/docker.sock:/var/run/docker.sock -p $(PORT):5000 chrisae9/discord-webhook-service:dev

# 3. Pull current commands from Discord
pull:
	docker run --env-file .env -it --rm -v ./data:/app/src/data chrisae9/discord-webhook-service:dev /bin/sh -c "npm run pull"

# 4. Push updated commands to Discord
push:
	docker run --env-file .env -it --rm -v ./data:/app/src/data chrisae9/discord-webhook-service:dev /bin/sh -c "npm run push"

# 5. Open a shell inside the container
shell:
	docker run --env-file .env -it --rm -v ./services:/services -v ./data:/app/src/data -v /var/run/docker.sock:/var/run/docker.sock -p $(PORT):5000 chrisae9/discord-webhook-service:dev /bin/sh

# 6. Open a root shell inside the container
root:
	docker run --env-file .env -it --rm --entrypoint /bin/sh -v ./services:/services -v ./data:/app/src/data -v /var/run/docker.sock:/var/run/docker.sock -p $(PORT):5000 chrisae9/discord-webhook-service:dev

# 7. Test Docker setup inside the container
docker-test:
	@echo "Getting Docker group ID on the host..."
	@HOST_DOCKER_GID=$(shell stat -c '%g' /var/run/docker.sock) && echo "Host Docker GID: $$HOST_DOCKER_GID"
	@echo "Getting Docker group ID inside the container..."
	@CONTAINER_DOCKER_GID=$$(docker run --env-file .env -e SHUTDOWN_ENABLED=false -it --rm -v /var/run/docker.sock:/var/run/docker.sock chrisae9/discord-webhook-service:dev /bin/sh -c "getent group docker | cut -d: -f3") && echo "Container Docker GID: $$CONTAINER_DOCKER_GID"
	@if [ "$$HOST_DOCKER_GID" = "$$CONTAINER_DOCKER_GID" ]; then \
		echo "Docker GID matches."; \
	else \
		echo "Docker GID does not match!"; \
	fi
	@echo "Running whoami, groups, and docker ps in the container..."
	@docker run --env-file .env -e SHUTDOWN_ENABLED=false -it --rm -v /var/run/docker.sock:/var/run/docker.sock chrisae9/discord-webhook-service:dev /bin/sh -c "\
		echo 'Current user:' && whoami && \
		echo 'Groups:' && groups && \
		echo 'Docker PS Check:' && docker ps >/dev/null && echo 'docker ps successful' || echo 'docker ps failed'"

# 8. Check if .env file exists and print environment variables
env-check:
	@echo "Checking if .env file exists..."
	@if [ -f .env ]; then \
		echo ".env file found. Printing environment variables from the container..."; \
		docker run --env-file .env -it --rm -v /var/run/docker.sock:/var/run/docker.sock chrisae9/discord-webhook-service:dev /bin/sh -c "printenv"; \
	else \
		echo ".env file not found!"; \
	fi

# 9. Run docker-compose up on ./services/example/docker-compose.yaml
service-check:
	@echo "Running docker-compose up on ./services/example/docker-compose.yaml..."
	@docker run --env-file .env -it --rm -v ./services:/services -v /var/run/docker.sock:/var/run/docker.sock -w /services/example chrisae9/discord-webhook-service:dev /bin/sh -c "cd /services/example && docker compose up && docker compose down"

# 10. Check cron jobs for node user inside the container
cron-check:
	@echo "Checking cron jobs for node user inside the container..."
	@docker run --env-file .env -it --rm -v /var/run/docker.sock:/var/run/docker.sock chrisae9/discord-webhook-service:dev /bin/sh -c "\
		echo 'Cron jobs for node user:' && crontab -l"
