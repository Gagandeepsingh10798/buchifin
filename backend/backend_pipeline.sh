#!/bin/bash

export NVM_DIR="/home/ubuntu/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd /home/ubuntu/Buchifin_Backend
git pull
npm install
pm2 restart all
