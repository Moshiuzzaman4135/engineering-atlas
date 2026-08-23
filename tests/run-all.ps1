$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '..')

$scripts = @(
  'js/data.js',
  'js/expanded-data.js',
  'js/store.js',
  'js/scheduler.js',
  'js/simulations.js',
  'js/diagrams.js',
  'js/app.js'
)

foreach ($script in $scripts) {
  & node --check $script
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

& node --test tests/*.test.js
exit $LASTEXITCODE
