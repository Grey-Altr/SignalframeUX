const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('components').concat(walk('app'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  // Match clamp(..., ...vw, ...)
  const regex = /clamp\(\s*([0-9.]+(?:px|rem|em)?)\s*,\s*([0-9.]+)vw\s*,\s*([0-9.]+)px\s*\)/g;
  content = content.replace(regex, (match, min, vw, max) => {
    const maxVal = parseFloat(max);
    const newVw = (maxVal / 14.4).toFixed(3);
    changed = true;
    return `clamp(${min}, ${newVw}vw, ${max}px)`;
  });

  // Match clamp(..., ...vh, ...)
  const vhRegex = /clamp\(\s*([0-9.]+(?:px|rem|em)?)\s*,\s*([0-9.]+)vh\s*,\s*([0-9.]+)px\s*\)/g;
  content = content.replace(vhRegex, (match, min, vh, max) => {
    const maxVal = parseFloat(max);
    const newVh = (maxVal / 9).toFixed(3); // Assuming 900px height
    changed = true;
    return `clamp(${min}, ${newVh}vh, ${max}px)`;
  });

  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
