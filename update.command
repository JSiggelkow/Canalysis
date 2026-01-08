#!/bin/bash
echo "stopping docker"
docker compose down
echo "docker stopped"
echo "updating canalysis"
git pull
echo "updated successfully"
echo "rebuilding and restarting docker"
docker compose up --build --force-recreate -d
read -p "restarted successfully, press enter to close"