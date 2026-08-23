#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
node --check js/data.js
node --check js/store.js
node --check js/scheduler.js
node --check js/simulations.js
node --check js/diagrams.js
node --check js/app.js
node --test tests/*.test.js
