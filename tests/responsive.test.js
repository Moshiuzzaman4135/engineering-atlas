const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ROOT=path.resolve(__dirname,'..');

test('diagram-bearing grid children can shrink on narrow screens',()=>{
  const css=fs.readFileSync(path.join(ROOT,'css/styles.css'),'utf8').replace(/\s+/g,'');
  assert.match(
    css,
    /\.lesson-layout>\*,\.lab-layout>\*\{min-width:0\}|\.lab-layout>\*,\.lesson-layout>\*\{min-width:0\}/,
    'lesson and lab grid children need min-width:0 so 540px scrollable SVGs do not widen the page on phones'
  );
});


test('study settings stack form controls on very narrow screens',()=>{
  const css=fs.readFileSync(path.join(ROOT,'css/styles.css'),'utf8').replace(/\s+/g,'');
  assert.match(
    css,
    /@media\(max-width:520px\)[\s\S]*\.settings-row\{grid-template-columns:1fr/,
    'settings rows must stack below 520px so date/select controls do not force horizontal page overflow'
  );
  assert.match(
    css,
    /\.settings-rowinput:not\(\.switch\),\.settings-rowselect\{width:100%;max-width:100%;min-width:0\}/,
    'stacked settings controls must be allowed to shrink to the card width'
  );
});

test('visual system supports light theme, keyboard focus, and reduced motion',()=>{
  const css=fs.readFileSync(path.join(ROOT,'css/styles.css'),'utf8');
  assert.match(css,/\[data-theme=["']light["']\]/);
  assert.match(css,/:focus-visible/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css,/color-scheme:\s*light/);
});
