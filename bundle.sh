#!/bin/bash
#########################################################################
# Copyright (C) 2020 - BetterLink Internet Services and Systems (BLISS) #
# This script prepares the working directory before being able to build #
# the Docker container. It then builds the Docker container and tags it #
# as betterlink/specdb.                                                 # 
#########################################################################
set -o xtrace
# Clone the Git repo if it doesn't already exist
git clone https://github.com/betterlink-isas/specdb.git specdb 2> /dev/null
cd specdb
# Install necessary packages to build
npm install
# Build latest version of SpecDB
npm run clean
npm run build
cd ..
# Copy built files to local directory
cp -r specdb/build .
cp -r specdb/dist .
cp -r specdb/package.json .
# Install only production dependencies
npm install --only=production
# Make owner/group root for correct UID/GID in container
chown -R root:root .
# Build docker container
docker build -t betterlink/specdb .