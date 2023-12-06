#!/bin/bash

# 0 3 * * * /hdd/discord-interactions-webhook/scripts/shutdown-services.sh

# Path to the services.json file
servicesFile="/hdd/discord-interactions-webhook/src/data/services.json"

# Check if the services.json file exists
if [ ! -f "$servicesFile" ]; then
    echo "Error: services.json file not found at $servicesFile."
    exit 1
fi

# Iterate over each service in the services.json file
jq -c '.[]' "$servicesFile" | while read -r service; do
    # Extract the path and compose file
    servicePath=$(echo "$service" | jq -r '.path')
    composeFile=$(echo "$service" | jq -r '.composeFile')

    # Check if the compose file is not null or empty
    if [ "$composeFile" != "null" ] && [ -n "$composeFile" ]; then
        echo "Running docker-compose down for $composeFile in $servicePath"
        # Navigate to the service path and run docker-compose down
        (cd "$servicePath" && docker-compose -f "$composeFile" down)
    else
        echo "Compose file not specified for a service. Skipping."
    fi
done

echo "All services have been processed."
