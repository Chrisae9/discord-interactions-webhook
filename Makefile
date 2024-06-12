.PHONY: build dev pull push shell docker-test env-check service-check

include .env

build:
	docker build --no-cache . -t discord-webhook-service
	docker tag discord-webhook-service chrisae9/discord-webhook-service:dev

dev:
	docker run --env-file .env -it --rm -v ./services:/services -v ./data:/app/src/data -v /var/run/docker.sock:/var/run/docker.sock -p 5000:5000 chrisae9/discord-webhook-service:dev

pull:
	docker run --env-file .env -it --rm -v ./data:/app/src/data chrisae9/discord-webhook-service:dev /bin/sh -c "npm run pull"

push:
	docker run --env-file .env -it --rm -v ./data:/app/src/data chrisae9/discord-webhook-service:dev /bin/sh -c "npm run push"

shell:
	docker run --env-file .env -it --rm -v ./services:/services -v ./data:/app/src/data -v /var/run/docker.sock:/var/run/docker.sock -p 5000:5000 chrisae9/discord-webhook-service:dev "/bin/sh"

docker-test:
	@echo "Getting Docker group ID on the host..."
	@HOST_DOCKER_GID=$(shell stat -c '%g' /var/run/docker.sock) && echo "Host Docker GID: $$HOST_DOCKER_GID"
	@echo "Getting Docker group ID inside the container..."
	@CONTAINER_DOCKER_GID=$$(docker run --env-file .env -it --rm -v /var/run/docker.sock:/var/run/docker.sock chrisae9/discord-webhook-service:dev /bin/sh -c "getent group docker | cut -d: -f3") && echo "Container Docker GID: $$CONTAINER_DOCKER_GID"
	@if [ "$$HOST_DOCKER_GID" = "$$CONTAINER_DOCKER_GID" ]; then \
		echo "Docker GID matches."; \
	else \
		echo "Docker GID does not match!"; \
	fi
	@echo "Running whoami, groups, and docker ps in the container..."
	@docker run --env-file .env -it --rm -v /var/run/docker.sock:/var/run/docker.sock chrisae9/discord-webhook-service:dev /bin/sh -c "\
		echo 'Current user:' && whoami && \
		echo 'Groups:' && groups && \
		echo 'Docker PS Check:' && docker ps >/dev/null && echo 'docker ps successful' || echo 'docker ps failed'"

env-check:
	@echo "Checking if .env file exists..."
	@if [ -f .env ]; then \
		echo ".env file found. Printing environment variables from the container..."; \
		docker run --env-file .env -it --rm -v /var/run/docker.sock:/var/run/docker.sock chrisae9/discord-webhook-service:dev /bin/sh -c "printenv"; \
	else \
		echo ".env file not found!"; \
	fi

service-check:
	@echo "Running docker-compose up on ./services/example/docker-compose.yaml..."
	@docker run --env-file .env -it --rm -v ./services:/services -v /var/run/docker.sock:/var/run/docker.sock -w /services/example chrisae9/discord-webhook-service:dev /bin/sh -c "cd /services/example && docker compose up && docker compose down"
