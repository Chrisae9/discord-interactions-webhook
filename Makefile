.PHONY: build dev pull push start stop

include .env

build:
	docker build --no-cache . -t discord-webhook-service

dev:
	docker run --env-file .env -it --rm -v ./data:/app/src/data -v /var/run/docker.sock:/var/run/docker.sock -p 5001:5000 discord-webhook-service:latest /bin/sh

pull:
	docker run --env-file .env -it --rm -v ./data:/app/src/data discord-webhook-service /bin/sh -c "npm run pull"

push:
	docker run --env-file .env -it --rm -v ./data:/app/src/data discord-webhook-service /bin/sh -c "npm run push"
