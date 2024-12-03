#!/bin/bash

# Build the project
npm run build

# Navigate to dist folder
cd dist

# Initialize git repo
git init
git add -A
git commit -m 'deploy'

# Push to gh-pages branch
git push -f git@github.com:g-nitin/medium-network-viz.git master:gh-pages

cd -