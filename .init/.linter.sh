#!/bin/bash
cd /home/kavia/workspace/code-generation/personal-notes-manager-17275-17284/notes_frontend
npm run lint
ESLINT_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

