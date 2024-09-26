#!/bin/sh

# Path to the services.json file
servicesFile="/app/src/data/services.json"

# Log file path
logFile="/var/log/cron/cron.log"

# Log function to include timestamps
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$logFile"
}

# Start logging
log "shutdown-services.sh started"

# Check if the services.json file exists
if [ ! -f "$servicesFile" ]; then
    log "Error: services.json file not found at $servicesFile."
    exit 1
fi

# Iterate over each service in the services.json file
jq -c '.[]' "$servicesFile" | while read -r service; do
    # Extract the path and compose file
    servicePath=$(echo "$service" | jq -r '.path')
    composeFile=$(echo "$service" | jq -r '.composeFile')

    # Check if the compose file is not null or empty
    if [ "$composeFile" != "null" ] && [ -n "$composeFile" ]; then
        log "Running docker-compose down for $composeFile in $servicePath"
        # Navigate to the service path and run docker-compose down
        (
            cd "$servicePath" && docker-compose -f "$composeFile" down >> "$logFile" 2>&1
            if [ $? -eq 0 ]; then
                log "Successfully stopped service at $servicePath"
            else
                log "Error stopping service at $servicePath"
            fi
        )
    else
        log "Compose file not specified for a service at $servicePath. Skipping."
    fi
done

log "All services have been processed."
log "shutdown-services.sh completed"
