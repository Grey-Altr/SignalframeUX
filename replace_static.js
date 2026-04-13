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

const replacements = {
  'p-1': 'p-[var(--sfx-space-1)]',
  'p-2': 'p-[var(--sfx-space-2)]',
  'p-3': 'p-[var(--sfx-space-3)]',
  'p-4': 'p-[var(--sfx-space-4)]',
  'p-6': 'p-[var(--sfx-space-6)]',
  'p-8': 'p-[var(--sfx-space-8)]',
  'p-12': 'p-[var(--sfx-space-12)]',
  
  'px-1': 'px-[var(--sfx-space-1)]',
  'px-2': 'px-[var(--sfx-space-2)]',
  'px-3': 'px-[var(--sfx-space-3)]',
  'px-4': 'px-[var(--sfx-space-4)]',
  'px-6': 'px-[var(--sfx-space-6)]',
  'px-8': 'px-[var(--sfx-space-8)]',
  'px-12': 'px-[var(--sfx-space-12)]',
  
  'py-1': 'py-[var(--sfx-space-1)]',
  'py-2': 'py-[var(--sfx-space-2)]',
  'py-3': 'py-[var(--sfx-space-3)]',
  'py-4': 'py-[var(--sfx-space-4)]',
  'py-6': 'py-[var(--sfx-space-6)]',
  'py-8': 'py-[var(--sfx-space-8)]',
  'py-12': 'py-[var(--sfx-space-12)]',
  
  'pt-1': 'pt-[var(--sfx-space-1)]',
  'pt-2': 'pt-[var(--sfx-space-2)]',
  'pt-3': 'pt-[var(--sfx-space-3)]',
  'pt-4': 'pt-[var(--sfx-space-4)]',
  'pt-6': 'pt-[var(--sfx-space-6)]',
  'pt-8': 'pt-[var(--sfx-space-8)]',
  'pt-12': 'pt-[var(--sfx-space-12)]',
  
  'pb-1': 'pb-[var(--sfx-space-1)]',
  'pb-2': 'pb-[var(--sfx-space-2)]',
  'pb-3': 'pb-[var(--sfx-space-3)]',
  'pb-4': 'pb-[var(--sfx-space-4)]',
  'pb-6': 'pb-[var(--sfx-space-6)]',
  'pb-8': 'pb-[var(--sfx-space-8)]',
  'pb-12': 'pb-[var(--sfx-space-12)]',
  
  'mt-1': 'mt-[var(--sfx-space-1)]',
  'mt-2': 'mt-[var(--sfx-space-2)]',
  'mt-3': 'mt-[var(--sfx-space-3)]',
  'mt-4': 'mt-[var(--sfx-space-4)]',
  'mt-6': 'mt-[var(--sfx-space-6)]',
  'mt-8': 'mt-[var(--sfx-space-8)]',
  'mt-12': 'mt-[var(--sfx-space-12)]',
  
  'mb-1': 'mb-[var(--sfx-space-1)]',
  'mb-2': 'mb-[var(--sfx-space-2)]',
  'mb-3': 'mb-[var(--sfx-space-3)]',
  'mb-4': 'mb-[var(--sfx-space-4)]',
  'mb-6': 'mb-[var(--sfx-space-6)]',
  'mb-8': 'mb-[var(--sfx-space-8)]',
  'mb-12': 'mb-[var(--sfx-space-12)]',
  
  'gap-1': 'gap-[var(--sfx-space-1)]',
  'gap-2': 'gap-[var(--sfx-space-2)]',
  'gap-3': 'gap-[var(--sfx-space-3)]',
  'gap-4': 'gap-[var(--sfx-space-4)]',
  'gap-6': 'gap-[var(--sfx-space-6)]',
  'gap-8': 'gap-[var(--sfx-space-8)]',
  'gap-12': 'gap-[var(--sfx-space-12)]',
};

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  // Replace whole words to avoid replacing px-12 in px-120
  Object.keys(replacements).forEach(key => {
    const regex = new RegExp(`\\b${key}\\b`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, replacements[key]);
      changed = true;
    }
  });

  // Replace max-w-[440px] with max-w-[clamp(280px,30.55vw,440px)]
  if (content.includes('max-w-[440px]')) {
    content = content.replace(/max-w-\[440px\]/g, 'max-w-[clamp(280px,30.556vw,440px)]');
    changed = true;
  }
  if (content.includes('max-w-[420px]')) {
    content = content.replace(/max-w-\[420px\]/g, 'max-w-[clamp(260px,29.167vw,420px)]');
    changed = true;
  }
  if (content.includes('max-w-[520px]')) {
    content = content.replace(/max-w-\[520px\]/g, 'max-w-[clamp(320px,36.111vw,520px)]');
    changed = true;
  }
  if (content.includes('max-w-[700px]')) {
    content = content.replace(/max-w-\[700px\]/g, 'max-w-[clamp(320px,48.611vw,700px)]');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
